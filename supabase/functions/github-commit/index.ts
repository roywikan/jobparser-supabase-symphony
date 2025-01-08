import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'
import { generateIndexHtml, generateIndexCss } from './utils/generateIndexFiles.ts'
import { fetchRepoFiles, fetchFileContent, commitFile } from './utils/githubApi.ts'

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
    const { content, fileName, repo, branch, regenerateIndex = false } = await req.json()
    
    // If we're just regenerating the index, skip committing the job post
    if (!regenerateIndex) {
      // Commit the job post file
      await commitFile(repo, fileName, content, branch);
    }

    // Get all HTML files in the repository
    const files = await fetchRepoFiles(repo);
    const htmlFiles = files.filter(file => 
      file.name.endsWith('.html') && file.name !== 'index.html'
    );

    // Get content of each HTML file to extract job details
    const jobs = await Promise.all(htmlFiles.map(async (file) => {
      const html = await fetchFileContent(file.download_url);
      
      // Extract job details from HTML
      const titleMatch = html.match(/<title>(.*?)<\/title>/);
      const companyMatch = html.match(/<meta property="og:site_name" content="(.*?)">/);
      const locationMatch = html.match(/<meta property="og:description" content=".*? in (.*?)">/);

      return {
        fileName: file.name,
        title: titleMatch ? titleMatch[1].split(' - ')[1] : 'Job Title',
        company: companyMatch ? companyMatch[1] : 'Company',
        location: locationMatch ? locationMatch[1] : 'Location'
      };
    }));

    // Generate and commit index.html
    const indexHtml = generateIndexHtml(jobs);
    await commitFile(repo, 'index.html', indexHtml, branch);

    // Generate and commit index.css
    const indexCss = generateIndexCss();
    await commitFile(repo, 'index.css', indexCss, branch);

    return new Response(
      JSON.stringify({ success: true, message: 'Files updated successfully' }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})