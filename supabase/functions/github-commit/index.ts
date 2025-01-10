import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'
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
    
    // If not just regenerating index, commit the job post file
    if (!regenerateIndex) {
      await commitFile(repo, fileName, content, branch);
    }

    // Get all HTML files in the repository
    const files = await fetchRepoFiles(repo);
    const htmlFiles = files.filter(file => 
      file.name.endsWith('.html') && !file.name.startsWith('index')
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

    // Calculate total pages needed
    const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);

    // Generate and commit index.html and index-{n}.html files
    for (let page = 1; page <= totalPages; page++) {
      const indexHtml = generateIndexHtml(jobs, page, customDomain);
      const fileName = page === 1 ? 'index.html' : `index-${page}.html`;
      await commitFile(repo, fileName, indexHtml, branch);
      console.log(`Generated and committed ${fileName}`);
    }

    // Only generate and commit index.css if it's a new job post or if index.css doesn't exist
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
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  }
})