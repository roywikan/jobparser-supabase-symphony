import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { generateIndexHtml, generateIndexCss } from './utils/generateIndexFiles.ts'
import { fetchRepoFiles, fetchFileContent, commitFile } from './utils/githubApi.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const JOBS_PER_PAGE = 12;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content, fileName, repo, branch, regenerateIndex = false, customDomain } = await req.json()
    console.log('Received request:', { fileName, repo, branch, regenerateIndex, customDomain });
    
    // Ensure proper URL formatting for custom domain
    const formattedDomain = customDomain ? customDomain.replace(/:+$/, '') : '';
    console.log('Formatted domain:', formattedDomain);
    
    if (!regenerateIndex) {
      try {
        await commitFile(repo, fileName, content, branch);
        console.log('Successfully committed job post file:', fileName);
      } catch (error) {
        console.error('Error committing job post file:', error);
        return new Response(
          JSON.stringify({ success: false, error: `Error committing file: ${error.message}` }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    try {
      const files = await fetchRepoFiles(repo);
      const htmlFiles = files.filter(file => 
        file.name.endsWith('.html') && !file.name.startsWith('index')
      );
      console.log('Found HTML files:', htmlFiles.length);

      const jobs = await Promise.all(htmlFiles.map(async (file) => {
        const html = await fetchFileContent(file.download_url);
        const titleMatch = html.match(/<title>(.*?)<\/title>/);
        const companyMatch = html.match(/<strong>Company:<\/strong> (.*?)<\/p>/);
        const locationMatch = html.match(/<strong>Location:<\/strong> (.*?)<\/p>/);

        return {
          fileName: file.name,
          title: titleMatch ? titleMatch[1] : 'Job Title',
          company: companyMatch ? companyMatch[1].trim() : 'Company',
          location: locationMatch ? locationMatch[1].trim() : 'Location'
        };
      }));

      jobs.sort((a, b) => b.fileName.localeCompare(a.fileName));
      const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

      for (let page = 1; page <= totalPages; page++) {
        const indexHtml = await generateIndexHtml(jobs, page, formattedDomain, repo);
        const fileName = page === 1 ? 'index.html' : `index-${page}.html`;
        await commitFile(repo, fileName, indexHtml, branch);
        console.log(`Generated and committed ${fileName}`);
      }

      if (!regenerateIndex) {
        const cssExists = files.some(file => file.name === 'index.css');
        if (!cssExists) {
          const indexCss = generateIndexCss();
          await commitFile(repo, 'index.css', indexCss, branch);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Files updated successfully. Generated ${totalPages} index pages.` 
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    } catch (error) {
      console.error('Error processing repository files:', error);
      return new Response(
        JSON.stringify({ success: false, error: `Error processing repository files: ${error.message}` }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
  } catch (error) {
    console.error('Error in edge function:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})