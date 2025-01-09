import { Job } from './types.ts';

export const JOBS_PER_PAGE = 12;

export const generateJobCards = (jobs: Job[], currentPage: number = 1) => {
  // Sort jobs by fileName (newest first)
  const sortedJobs = [...jobs].sort((a, b) => b.fileName.localeCompare(a.fileName));
  
  // Calculate pagination indices
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  
  // Get jobs for current page
  const pageJobs = sortedJobs.slice(startIndex, endIndex);
  
  return pageJobs.map(job => `
    <div class="job-card">
      <h3>${job.title}</h3>
      <p class="company">${job.company}</p>
      <p class="location">${job.location}</p>
      <a href="${job.fileName}" class="view-job">View Details</a>
    </div>
  `).join('');
};

export const generatePagination = (totalJobs: number, currentPage: number = 1) => {
  const totalPages = Math.ceil(totalJobs / JOBS_PER_PAGE);
  
  return Array.from({ length: totalPages }, (_, i) => i + 1)
    .map(page => `
      <a href="?page=${page}" 
         class="page-link ${page === currentPage ? 'active' : ''}">${page}</a>
    `).join('');
};