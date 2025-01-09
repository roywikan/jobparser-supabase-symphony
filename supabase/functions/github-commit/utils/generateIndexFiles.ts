import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts'
import { Job } from './types.ts';
import { generateJobCards, generatePagination } from './jobCards.ts';
import { generateIndexCss } from './styles.ts';

export const generateIndexHtml = (jobs: Job[], currentPage: number = 1) => {
  const jobCards = generateJobCards(jobs, currentPage);
  const pagination = generatePagination(jobs.length, currentPage);
  const effectiveDomain = 'uk.job.web.id'; // Default domain

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

    <footer class="site-footer">
        <div class="footer-content">
            <p>&copy; ${new Date().getFullYear()} 
                <a href="https://${effectiveDomain}" class="footer-link">
                    ${effectiveDomain}
                </a>
                | <a href="https://job.web.id" class="footer-link">Main Site</a>
            </p>
        </div>
    </footer>
</body>
</html>`;
}

export { generateIndexCss };