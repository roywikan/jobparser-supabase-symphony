// Job parser utility functions
export const parseJobTitle = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Try different selectors
  const selectors = [
    'h1.LZAQDf',
    '[aria-label*="job"]',
    '[data-title]'
  ];
  
  for (const selector of selectors) {
    const element = doc.querySelector(selector);
    if (element) {
      return element.textContent?.trim() || '';
    }
  }
  
  return '';
};

export const parseCompanyAndLocation = (html: string): { company: string; location: string } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const element = doc.querySelector('.waQ7qe');
  const text = element?.textContent || '';
  const [company, location] = text.split('•').map(s => s.trim());
  
  return { company: company || '', location: location || '' };
};

export const generateSlug = (title: string, company: string): string => {
  const combined = `${title}-${company}`.toLowerCase();
  return combined
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateMetaDescription = (responsibilities: string): string => {
  const desc = responsibilities.substring(0, 147).trim();
  return desc.length === 147 ? `${desc}...` : desc;
};

export const parseJobDetails = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const jobTitle = parseJobTitle(html);
  const { company, location } = parseCompanyAndLocation(html);
  
  const jobType = doc.querySelector('.RcZtZb')?.textContent?.trim() || '';
  const salary = doc.querySelector('li:contains("Salary")')?.textContent?.trim() || '';
  
  const qualifications = Array.from(
    doc.querySelectorAll('h4:contains("Qualifications") + ul li')
  ).map(li => li.textContent?.trim()).filter(Boolean);
  
  const benefits = Array.from(
    doc.querySelectorAll('h4:contains("Benefits") + ul li')
  ).map(li => li.textContent?.trim()).filter(Boolean);
  
  const responsibilities = Array.from(
    doc.querySelectorAll('h4:contains("Responsibilities") + ul li')
  ).map(li => li.textContent?.trim()).filter(Boolean);
  
  const description = doc.querySelector('h3:contains("Job description") + span')?.textContent?.trim() || '';
  
  const applyLink = doc.querySelector('a[title*="Apply"]')?.getAttribute('href') || '';
  
  const slug = generateSlug(jobTitle, company);
  const metaDescription = generateMetaDescription(responsibilities.join(' '));
  
  return {
    jobTitle,
    company,
    location,
    jobType,
    salary,
    qualifications,
    benefits,
    responsibilities,
    description,
    applyLink,
    slug,
    metaDescription
  };
};