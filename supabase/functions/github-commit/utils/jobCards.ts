import { Job } from './types.ts';

export const JOBS_PER_PAGE = 12;

export const generateJobCards = (jobs: Job[], currentPage: number = 1) => {
  // Sort jobs by fileName (newest first)
  //const sortedJobs = [...jobs].sort((a, b) => b.fileName.localeCompare(a.fileName));
  //diganti kode dari chatgpt:
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

 //kode dari chatgpt selesai. 






  
  // Calculate pagination indices
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = startIndex + JOBS_PER_PAGE;
  
  // Get jobs for current page
  const pageJobs = sortedJobs.slice(startIndex, endIndex);
  
  return pageJobs.map(job => `
    <div class="job-card">
      <h2>${job.title}</h2>
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
