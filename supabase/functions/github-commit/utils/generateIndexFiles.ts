import { Job } from './types.ts';

const JOBS_PER_PAGE = 12;

export const generateIndexHtml = (jobs: Job[], pageNum: number = 1, customDomain?: string) => {
  // Sort jobs by filename (newest first)
  const sortedJobs = [...jobs].sort((a, b) => b.fileName.localeCompare(a.fileName));
  
  const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
  const startIndex = (pageNum - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  const pageJobs = sortedJobs.slice(startIndex, endIndex);

  const effectiveDomain = customDomain || 'uk.job.web.id';
  const currentYear = new Date().getFullYear();

  // Generate pagination links
  const paginationLinks = Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(page => {
      const isActive = page === pageNum;
      const fileName = page === 1 ? 'index.html' : `index-${page}.html`;
      return `<a href="${fileName}" class="page-link${isActive ? ' active' : ''}">${page}</a>`;
    })
    .join('');

  // Generate job cards for current page
  const jobCards = pageJobs.map(job => `
    <div class="job-card">
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p class="location">${job.location}</p>
      <a href="${job.fileName}" class="view-job">View Details</a>
    </div>
  `).join('');

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

export const generateIndexCss = () => {
  return `
    /* Reset and base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }

    /* Navigation */
    .top-menu {
      background-color: #fff;
      padding: 1rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .menu-item {
      color: #333;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .menu-item:hover {
      background-color: #f0f0f0;
    }

    /* Header */
    header {
      text-align: center;
      padding: 2rem 1rem;
      background-color: #fff;
      margin-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }

    h1 {
      font-size: 2.5rem;
      color: #2d3748;
      margin-bottom: 1rem;
    }

    /* Job Grid */
    .jobs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
      padding: 0 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .job-card {
      background: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .job-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }

    .job-card h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: #2d3748;
    }

    .job-card .company {
      color: #4a5568;
      font-weight: 500;
      margin-bottom: 0.5rem;
    }

    .job-card .location {
      color: #718096;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    .view-job {
      display: inline-block;
      background-color: #4299e1;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .view-job:hover {
      background-color: #3182ce;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      padding: 2rem 0;
      margin-top: 2rem;
    }

    .page-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2rem;
      height: 2rem;
      padding: 0 0.5rem;
      border-radius: 4px;
      background-color: #fff;
      color: #4a5568;
      text-decoration: none;
      font-weight: 500;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .page-link:hover {
      background-color: #f7fafc;
      border-color: #cbd5e0;
    }

    .page-link.active {
      background-color: #4299e1;
      color: white;
      border-color: #4299e1;
    }

    /* Footer */
    .site-footer {
      background-color: #2d3748;
      color: #fff;
      padding: 2rem 1rem;
      margin-top: 4rem;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }

    .footer-link {
      color: #63b3ed;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-link:hover {
      color: #90cdf4;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .jobs-grid {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 2rem;
      }

      .job-card {
        margin: 0 1rem;
      }
    }
  `;
};