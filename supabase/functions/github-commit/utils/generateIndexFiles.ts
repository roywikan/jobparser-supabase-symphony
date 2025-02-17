import { Job } from './types.ts';
import { fetchLastCommitTimestamp } from './githubApi.ts';

const JOBS_PER_PAGE = 12;

export const generateIndexHtml = async (jobs: Job[], pageNum: number = 1, customDomain?: string, repo?: string) => {
  //const sortedJobs = [...jobs].sort((a, b) => b.fileName.localeCompare(a.fileName));
  //ini kode dari chatGPT:
  const sortedJobs = await Promise.all(jobs.map(async (job) => {
  let timestamp = null;
  if (repo) {
    timestamp = await fetchLastCommitTimestamp(repo, job.fileName);
  }
  return {
    ...job,
    lastCommitTimestamp: timestamp
  };
}));

sortedJobs.sort((a, b) => {
  const timestampA = a.lastCommitTimestamp ? new Date(a.lastCommitTimestamp).getTime() : 0;
  const timestampB = b.lastCommitTimestamp ? new Date(b.lastCommitTimestamp).getTime() : 0;
  return timestampB - timestampA;
});

//kode dari chatgpt berhenti di sini.


  
  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
  const startIndex = (pageNum - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const pageJobs = sortedJobs.slice(startIndex, endIndex);

  // Fetch commit timestamps for all jobs on this page
  const jobsWithTimestamps = await Promise.all(pageJobs.map(async (job) => {
    let timestamp = null;
    if (repo) {
      timestamp = await fetchLastCommitTimestamp(repo, job.fileName);
    }
    return {
      ...job,
      lastCommitTimestamp: timestamp
    };
  }));

  const effectiveDomain = customDomain || 'uk.job.web.id';
  const currentYear = new Date().getFullYear();

  const paginationLinks = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(page => {
      const isActive = page === pageNum;
      const fileName = page === 1 ? 'index.html' : `index-${page}.html`;
      return `<a href="${fileName}" class="page-link${isActive ? ' active' : ''}">${page}</a>`;
    })
    .join('');

  const jobCards = jobsWithTimestamps.map(job => {
    const timestamp = job.lastCommitTimestamp 
      ? new Date(job.lastCommitTimestamp).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        })
      : new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC'
        });

    return `
    <div class="job-card">
      <h2><a href="/${job.fileName}" title="${job.title} ${job.company} ${job.location}" class="job-title-link">${job.title}</a></h2>
      <p class="company">${job.company}</p>
      <p class="location">${job.location}</p>
      <p class="updated"><time datetime="${job.lastCommitTimestamp || new Date().toISOString()}">${timestamp} UTC</time></p>
      <p class="hashtags">${job.hashtags ? job.hashtags.split(',').map(tag => `#${tag.trim()}`).join(' ') : ''}</p>
    </div>
  `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2447926075248129" crossorigin="anonymous"></script>

    <meta name="description" content="UK JOBS ${jobs.length > 0 ? jobs[0]?.title : 'Unknown'} ${jobs.length > 0 ? jobs[0]?.company : ''} ${jobs.length > 0 ? jobs[0]?.location : ''}">
    <title>UK Jobs ${jobs.length > 0 ? jobs[0]?.title : 'Unknown'}</title>

    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 1.6;
        color: #222;
        background-color: #2563eb12;
        margin: 0;
        padding: 0;
      }
      
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
      
      header {
        text-align: center;
        padding: 2rem 1rem;
        background: #f8fafc;
      }
      
      .jobs-grid {
        display: grid;
        gap: 1.5rem;
        padding: 1.5rem;
        max-width: 1200px;
        margin: 0 auto;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
      
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
      
      .job-title-link {
        color: #1e293b;
        text-decoration: none;
        font-weight: 600;
      }
      
      .job-title-link:hover {
        color: #2563eb;
      }
      
      .company {
        color: #64748b;
        margin: 0.5rem 0;
        font-weight: 500;
      }
      
      .location {
        color: #94a3b8;
        margin: 0.5rem 0;
      }
      
      .updated {
        color: #888;
        font-size: 0.9em;
        margin: 0.5rem 0;
      }
      
      .hashtags {
        color: #2563eb;
        font-size: 0.9em;
        margin: 0.5rem 0;
        word-wrap: break-word;
      }
      
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
      
      .page-link:hover,
      .page-link.active {
        background: #2563eb;
        color: white;
      }
      
      .site-footer {
        background: #f8fafc;
        padding: 1.5rem;
        margin-top: 2rem;
        border-top: 1px solid #e2e8f0;
        text-align: center;
      }
      
      .footer-link {
        color: #2563eb;
        text-decoration: none;
      }
      
      .footer-link:hover {
        text-decoration: underline;
      }
      
      @media (max-width: 768px) {
        .jobs-grid {
          grid-template-columns: 1fr;
          padding: 1rem;
        }
      }
    </style>
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2447926075248129"
     crossorigin="anonymous"></script>
</head>
<body>
    <nav class="top-menu">
        <a href="/" class="menu-item">Home</a>
    </nav>

    <header>
         <h1>UK Jobs ${jobs.length > 0 ? jobs[0]?.location : 'Unknown'}</h1>
    </header>

    <main class="jobs-grid">
        ${jobCards}
    </main>

    <div class="pagination">
        ${paginationLinks}
    </div>

    <footer class="site-footer">
        <div class="footer-content">
            <span>&copy; ${currentYear} <a href="https://${effectiveDomain}" class="footer-link">${effectiveDomain}</a></span>
            <span> | </span>
            <span><a href="https://job.web.id" class="footer-link">Main Site</a></span>
        </div>
    </footer>

</body>
</html>`;
};

// Note: We're not using the separate CSS file anymore as we've inlined critical styles
export const generateIndexCss = () => '';
