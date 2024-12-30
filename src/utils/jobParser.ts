// Job parser utility functions
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
  const element = doc.querySelector('.RcZtZb');
  return element?.textContent?.trim() || '';
};

export const parseSalary = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find salary in the highlights section
  const salaryElement = Array.from(doc.querySelectorAll('.LevrW'))
    .find(el => el.textContent?.includes('Salary'));
    
  return salaryElement?.textContent?.trim() || '';
};

export const parseQualifications = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find qualifications section and list items
  const qualificationsList = Array.from(doc.querySelectorAll('.zqeyHd'))
    .find(el => el.previousElementSibling?.textContent?.includes('Qualifications'));
    
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
  const benefitsList = Array.from(doc.querySelectorAll('.zqeyHd'))
    .find(el => el.previousElementSibling?.textContent?.includes('Benefits'));
    
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
  const responsibilitiesList = Array.from(doc.querySelectorAll('.zqeyHd'))
    .find(el => el.previousElementSibling?.textContent?.includes('Responsibilities'));
    
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
  
  // Get full description from the job description section
  const descriptionElement = doc.querySelector('.us2QZb');
  return descriptionElement?.textContent?.trim() || '';
};

export const parseApplyLink = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find the first apply button link
  const applyLink = doc.querySelector('a[title^="Apply"]');
  return applyLink?.getAttribute('href') || '';
};

export const generateSlug = (title: string, company: string): string => {
  const combined = `${title}-${company}`.toLowerCase();
  return combined
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const generateMetaDescription = (responsibilities: string[]): string => {
  const desc = responsibilities.join(' ').substring(0, 147).trim();
  return desc.length === 147 ? `${desc}...` : desc;
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
  const metaDescription = generateMetaDescription(responsibilities);
  
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