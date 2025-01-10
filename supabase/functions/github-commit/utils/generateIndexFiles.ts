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