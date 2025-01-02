import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, fileName, repo, branch } = await req.json()
    const token = Deno.env.get('GITHUB_TOKEN')
    
    if (!token) {
      throw new Error('GitHub token not found')
    }

    // Encode content to base64
    const encoder = new TextEncoder()
    const data = encoder.encode(content)
    const contentBase64 = btoa(String.fromCharCode(...data))

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        ...corsHeaders
      },
      body: JSON.stringify({
        message: `Update ${fileName}`,
        content: contentBase64,
        branch: branch
      })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Failed to commit to GitHub')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})