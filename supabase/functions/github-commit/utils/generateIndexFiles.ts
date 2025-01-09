import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'
import { Job } from './types.ts';
import { generateJobCards, generatePagination } from './jobCards.ts';
import { generateIndexCss } from './styles.ts';



// Modifikasi di supabase/functions/github-commit/utils/generateIndexFiles.ts

export const generateIndexHtml = (jobs) => {

// Sort jobs by filename (newest first)

jobs.sort((a, b) => b.fileName.localeCompare(a.fileName));

const jobsPerPage = 12;

const totalPages = Math.ceil(jobs.length / jobsPerPage);

// Generate job cards with proper pagination

const generateJobCards = (pageNum) => {

const startIndex = (pageNum - 1) * jobsPerPage;
const endIndex = startIndex + jobsPerPage;
const pageJobs = jobs.slice(startIndex, endIndex);
return pageJobs.map(job => `
  <div class="job-card">
    <h3>${job.title}</h3>
    <p class="company">${job.company}</p>
    <p class="location">${job.location}</p>
    <a href="${job.fileName}" class="view-job">View Details</a>
  </div>
`).join('');
};

// Get current page from URL or default to 1

const urlParams = new URLSearchParams(window.location.search);

const currentPage = parseInt(urlParams.get('page')) || 1;

const jobCards = generateJobCards(currentPage);

// Generate pagination links

const pagination = Array.from({ length: totalPages }, (_, i) => i + 1)

.map(page => `<a href="?page=${page}" class="page-link${page === currentPage ? ' active' : ''}">${page}</a>`)
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
};



//export { generateIndexCss };




export const generateIndexCss = () => `

/* Existing CSS styles... */

/* Add active state for pagination */

.page-link.active {

background: #2563eb;
color: white;
}

`;
