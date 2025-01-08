import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateIndexHtml = (jobs) => {
  const jobsPerPage = 12;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  
  const jobCards = jobs.map(job => `
    <div class="job-card">
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p class="location">${job.location}</p>
      <a href="${job.fileName}" class="view-job">View Details</a>
    </div>
  `).join('');

  const pagination = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(page => `<a href="?page=${page}" class="page-link">${page}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>UK Jobs</title>
    <link rel="stylesheet" href="index.css">
</head>
<body>
    <nav class="top-menu">
        <a href="index.html" class="menu-item">Home</a>
    </nav>
    
    <header>
        <h1>UK Jobs</h1>
    </header>

    <main class="jobs-grid">
        ${jobCards}
    </main>

    <div class="pagination">
        ${pagination}
    </div>
</body>
</html>`;
}

const generateIndexCss = () => `
/* Base styles */
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    margin: 0;
    padding: 0;
    line-height: 1.6;
}

/* Navigation */
.top-menu {
    background: #2563eb;
    padding: 1rem;
    position: sticky;
    top: 0;
    z-index: 10;
}

.menu-item {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
}

/* Header */
header {
    text-align: center;
    padding: 2rem 1rem;
    background: #f8fafc;
}

h1 {
    margin: 0;
    color: #1e293b;
}

/* Grid Layout */
.jobs-grid {
    display: grid;
    gap: 1.5rem;
    padding: 1.5rem;
    max-width: 1200px;
    margin: 0 auto;
}

/* Responsive grid */
@media (min-width: 640px) {
    .jobs-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 768px) {
    .jobs-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .jobs-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

/* Job Cards */
.job-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    transition: transform 0.2s;
}

.job-card:hover {
    transform: translateY(-2px);
}

.job-card h3 {
    margin: 0 0 0.5rem;
    color: #1e293b;
}

.company {
    color: #64748b;
    margin: 0.5rem 0;
}

.location {
    color: #94a3b8;
    margin: 0.5rem 0;
}

.view-job {
    display: inline-block;
    background: #2563eb;
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    margin-top: 1rem;
}

/* Pagination */
.pagination {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    background: #f8fafc;
}

.page-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    color: #64748b;
    text-decoration: none;
}

.page-link:hover {
    background: #2563eb;
    color: white;
}
`;

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

    // First, commit the job post file
    const contentBase64 = base64Encode(content);
    
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Update ${fileName}`,
        content: contentBase64,
        branch: branch
      })
    });

    if (!response.ok) {
      throw new Error('Failed to commit job post')
    }

    // Get all HTML files in the repository
    const filesResponse = await fetch(`https://api.github.com/repos/${repo}/contents/`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    const files = await filesResponse.json();
    const htmlFiles = files.filter(file => 
      file.name.endsWith('.html') && file.name !== 'index.html'
    );

    // Get content of each HTML file to extract job details
    const jobs = await Promise.all(htmlFiles.map(async (file) => {
      const contentResponse = await fetch(file.download_url);
      const html = await contentResponse.text();
      
      // Basic extraction of title, company, and location
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
    const indexCss = generateIndexCss();

    // Commit index.html
    await fetch(`https://api.github.com/repos/${repo}/contents/index.html`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Update index.html',
        content: base64Encode(indexHtml),
        branch: branch
      })
    });

    // Commit index.css
    await fetch(`https://api.github.com/repos/${repo}/contents/index.css`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: 'Update index.css',
        content: base64Encode(indexCss),
        branch: branch
      })
    });

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