export const cleanField = (field: string) => {
  if (!field) return '';
  return field
    .replace(/Identified by Google from the original job post/g, '')
    .replace(/Job highlightsIdentified Google from original job post/g, '')
    .replace(/<br>/g, ' ')
    .replace(/(?:• )+/g, '<BR>- ')
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    .replace(/<\/li><li class="LevrW">/g, '<BR>- ')
    .trim();
};

export const cleanJsonLdField = (field: string) => {
  if (!field) return '';
  return field
    .replace(/Identified by Google from the original job post/g, '')
    .replace(/Job highlightsIdentified Google from original job post/g, '')
    .replace(/<\/li><li class="LevrW">/g, '\n - ')
    .trim();
};

export const cleanMetaField = (field: string) => {
  if (!field) return '';
  return field
    .replace(/Identified by Google from the original job post/g, '')
    .replace(/Job highlightsIdentified Google from original job post/g, '')
    .replace(/<\/li><li class="LevrW">/g, ' - ')
    .trim();
};

export const generateHashtags = (title: string, maxTags = 7) => {
  const hashtags = title
    .toLowerCase()
    .split(/[\s-]+/)
    .filter(word => word.length > 2)
    .map(word => word.trim())
    .filter(Boolean)
    .slice(0, maxTags)
    .map(word => `#${word}`);

  return {
    commaList: hashtags.join(', '),
    hashList: hashtags.join(', '),
    spaceHashList: hashtags.map(tag => tag.replace('#', '# ')).join(', '),
  };
};

export const generateHtmlTemplate = (job: any, date: string, hashtags: any) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${job.metaDescription}">
    <meta property="og:title" content="${job.pageTitle}">
    <meta property="og:description" content="${job.metaDescription}">
    ${job.imageUrl ? `<meta property="og:image" content="${job.imageUrl}">` : ''}
    <title>${job.pageTitle}</title>
    <link rel="stylesheet" href="/post.css">
</head>
<body>
    <header>
      <nav class="menu">
        <a href="/">Home</a> | 
        <a href="https://job.web.id/">Jobs</a>
      </nav>
      ${job.imageUrl ? `<img src="${job.imageUrl}" alt="${job.jobTitle}" class="featured-image">` : ''}
      <h1>${job.pageTitle}</h1>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Job Type:</strong> ${job.jobType}</p>
      <p><strong>Salary:</strong> ${job.salary}</p>
    </header>
    <main>
        ${job.description ? `
        <section>
            <h2>Job Description</h2>
            <p>${job.description}</p>
        </section>` : ''}
        
        ${job.qualifications?.length ? `
        <section>
            <h2>Qualifications</h2>
            <ul>
                ${job.qualifications?.map(qual => `<li>- ${qual}</li>`).join('\n                ') || ''}
            </ul>
        </section>` : ''}
        
        ${job.benefits?.length ? `
        <section>
            <h2>Benefits</h2>
            <ul>
                ${job.benefits?.map(benefit => `<li>- ${benefit}</li>`).join('\n                ') || ''}
            </ul>
        </section>` : ''}
        
        ${job.responsibilities?.length ? `
        <section>
            <h2>Responsibilities</h2>
            <ul>
                ${job.responsibilities?.map(resp => `<li>- ${resp}</li>`).join('\n                ') || ''}
            </ul>
        </section>` : ''}
        
        <section>
            <h2>How to Apply</h2>
            <a href="${job.applyLink}" rel="nofollow">Apply Here</a>
        </section>
        <section>
            <h2>Location Map</h2>
            <p><strong>Location Map:</strong> <div class="mapouter"><div class="gmap_canvas"><iframe loading="lazy" id="gmap_canvas" title="${job.jobTitle}" src="https://maps.google.com/maps?q=${encodeURIComponent(job.location)}&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=&amp;output=embed" width="100%" height="240px" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width: 100%;"></iframe></div></div></p>
        </section>
        <section>
            <h2>Hashtags</h2>
            <p>${hashtags.hashList}</p>
            <p>${hashtags.commaList}</p>
            <p>${hashtags.spaceHashList}</p>
        </section>
        <section>
            <h2>Snippet</h2>
            <blockquote>
                ${job.metaDescription} ${hashtags.hashList}
            </blockquote>
        </section>
        <section>
            <h2>Slug</h2>
            <textarea>
                ${job.slug}
            </textarea>
        </section>
    </main>
    <footer>
        <p>Published on ${date}</p>
        <p>Created by <a href="https://job.web.id">Andreas Wikan</a></p>
        <p>&copy; ${new Date().getFullYear()} All rights reserved.</p>
    </footer>
    <p><script type="application/ld+json">${JSON.stringify({
      ...job.jsonLd,
      image: job.imageUrl || undefined
    }, null, 2)}</script></p>
</body>
</html>`;
