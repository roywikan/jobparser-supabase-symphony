export const parseJobTitle = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Updated selector for Google Jobs format
  const titleElement = doc.querySelector('.LZAQDf');
  if (titleElement) {
    return titleElement.textContent?.trim() || '';
  }
  
  console.log('Job title not found with primary selector');
  return '';
};

export const parseCompanyAndLocation = (html: string): { company: string; location: string } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Updated selector for Google Jobs format
  const element = doc.querySelector('.waQ7qe');
  if (!element) {
    console.log('Company and location container not found');
    return { company: '', location: '' };
  }
  
  const text = element.textContent || '';
  const parts = text.split('•').map(s => s.trim());
  
  return { 
    company: parts[0] || '', 
    location: parts[1] || '' 
  };
};

export const parseJobType = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Updated selector for job type
  const elements = doc.querySelectorAll('.RcZtZb');
  for (const element of elements) {
    const text = element.textContent?.trim() || '';
    if (text.includes('Full-time') || text.includes('Part-time') || text.includes('Contract')) {
      return text;
    }
  }
  return '';
};

export const parseSalary = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const elements = doc.querySelectorAll('.RcZtZb');
  for (const element of elements) {
    const text = element.textContent?.trim() || '';
    if (text.includes('$') || text.toLowerCase().includes('hour') || text.toLowerCase().includes('year')) {
      return text;
    }
  }
  return '';
};

export const parseQualifications = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find qualifications section and list items
  const sections = doc.querySelectorAll('.yVFmQd');
  let qualificationsList: Element | null = null;
  
  for (const section of sections) {
    if (section.textContent?.includes('Qualifications')) {
      qualificationsList = section.nextElementSibling;
      break;
    }
  }
    
  if (!qualificationsList) {
    console.log('Qualifications section not found');
    return [];
  }
  
  return Array.from(qualificationsList.querySelectorAll('.LevrW'))
    .map(item => item.textContent?.trim() || '')
    .filter(Boolean);
};

export const parseBenefits = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find benefits section and list items
  const sections = doc.querySelectorAll('.yVFmQd');
  let benefitsList: Element | null = null;
  
  for (const section of sections) {
    if (section.textContent?.includes('Benefits')) {
      benefitsList = section.nextElementSibling;
      break;
    }
  }
    
  if (!benefitsList) {
    console.log('Benefits section not found');
    return [];
  }
  
  return Array.from(benefitsList.querySelectorAll('.LevrW'))
    .map(item => item.textContent?.trim() || '')
    .filter(Boolean);
};

export const parseResponsibilities = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find responsibilities section and list items
  const sections = doc.querySelectorAll('.yVFmQd');
  let responsibilitiesList: Element | null = null;
  
  for (const section of sections) {
    if (section.textContent?.includes('Responsibilities')) {
      responsibilitiesList = section.nextElementSibling;
      break;
    }
  }
    
  if (!responsibilitiesList) {
    console.log('Responsibilities section not found');
    return [];
  }
  
  return Array.from(responsibilitiesList.querySelectorAll('.LevrW'))
    .map(item => item.textContent?.trim() || '')
    .filter(Boolean);
};

export const parseDescription = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Try the original selector
  let descriptionElement = doc.querySelector('.us2QZb');
  
  // If not found, try the new selector
  if (!descriptionElement || !descriptionElement.textContent) {
    const nguyPeDiv = doc.querySelector('.NgUYpe div');
    if (nguyPeDiv) {
      descriptionElement = nguyPeDiv;
    }
  }
  
  return descriptionElement?.textContent?.trim() || '';
};

export const parseApplyLink = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find the first apply button link
  const applyLinks = doc.querySelectorAll('a[href*="apply"]');
  for (const link of applyLinks) {
    const href = link.getAttribute('href');
    if (href) {
      // Clean the URL before returning
      return cleanUrl(href);
    }
  }
  return '';
};

const cleanUrl = (url: string): string => {
  // Remove GTM query parameters
  const urlObj = new URL(url);
  urlObj.searchParams.delete('utm_campaign');
  urlObj.searchParams.delete('utm_source');
  urlObj.searchParams.delete('utm_medium');
  return urlObj.toString();
};

const cleanMetaDescription = (text: string): string => {
  // Remove symbols and non-ASCII characters
  let cleaned = text.replace(/[^\x00-\x7F]/g, '');
  // Remove unimportant words
  const unimportantWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  cleaned = cleaned.split(' ')
    .filter(word => !unimportantWords.includes(word.toLowerCase()))
    .join(' ');
  // Limit to 20 words
  return cleaned.split(' ').slice(0, 20).join(' ').trim();
};

export const generateSlug = (title: string, company: string): string => {
  const combined = `${title}-${company}`.toLowerCase();
  return combined
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateMetaDescription = (description: string): string => {
  const desc = description.substring(0, 147).trim();
  return desc.length === 147 ? `${desc}...` : desc;
};

export const generateJsonLd = (jobData: any) => {
  return {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    "title": jobData.jobTitle,
    "description": jobData.description,
    "hiringOrganization": {
      "@type": "Organization",
      "name": jobData.company
    },
    "jobLocation": {
      "@type": "Place",
      "address": jobData.location
    },
    "employmentType": jobData.jobType,
    "datePosted": new Date().toISOString(),
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    "baseSalary": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": {
        "@type": "QuantitativeValue",
        "value": jobData.salary,
        "unitText": "YEAR"
      }
    }
  };
};

export const parseJobDetails = (html: string) => {
  console.log('Starting to parse job details');
  
  const jobTitle = parseJobTitle(html);
  console.log('Parsed job title:', jobTitle);
  
  const { company, location } = parseCompanyAndLocation(html);
  console.log('Parsed company:', company);
  console.log('Parsed location:', location);
  
  const jobType = parseJobType(html);
  console.log('Parsed job type:', jobType);
  
  const salary = parseSalary(html);
  console.log('Parsed salary:', salary);
  
  const qualifications = parseQualifications(html);
  console.log('Parsed qualifications:', qualifications);
  
  const benefits = parseBenefits(html);
  console.log('Parsed benefits:', benefits);
  
  const responsibilities = parseResponsibilities(html);
  console.log('Parsed responsibilities:', responsibilities);
  
  const description = parseDescription(html);
  console.log('Parsed description length:', description.length);
  
  const applyLink = parseApplyLink(html);
  console.log('Parsed apply link:', applyLink);
  
  const slug = generateSlug(jobTitle, company);
  const metaDescription = cleanMetaDescription(description);
  
  const jobData = {
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
  
  const jsonLd = generateJsonLd(jobData);
  
  return {
    ...jobData,
    jsonLd
  };
};
