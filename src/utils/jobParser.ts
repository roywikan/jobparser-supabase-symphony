import { cleanMetaDescription, cleanUrl, formatListContent } from './jobParserUtils/textCleaner';
import { generateSlug, generateJsonLd } from './jobParserUtils/schemaGenerator';
import { getRandomJobImage } from './jobParserUtils/imageUrls';

export const parseJobTitle = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
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
  
  const currencySymbols = ['Rp', 'US$', 'AU$', 'S$', 'SGD', 'IDR', 'AED', '₹', '£'];
  const timePeriods = ['per day', 'a day', 'per hour', 'an hour', 'per month', 'a month', 
                       'per week', 'a week', 'per year', 'a year'];
  const magnitudes = ['K', 'M'];
  
  const elements = doc.querySelectorAll('.RcZtZb');
  for (const element of elements) {
    const text = element.textContent?.trim() || '';
    
    const hasCurrency = currencySymbols.some(symbol => text.includes(symbol));
    const hasTimePeriod = timePeriods.some(period => 
      text.toLowerCase().includes(period.toLowerCase())
    );
    const hasMagnitude = magnitudes.some(mag => text.includes(mag));
    const hasNumbers = /\d/.test(text);
    
    if (hasNumbers && (hasCurrency || hasMagnitude) && hasTimePeriod) {
      return text.replace(/\s+/g, ' ');
    }
  }
  return '';
};

export const parseQualifications = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
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
  
  const items = Array.from(qualificationsList.querySelectorAll('.LevrW'))
    .map(item => item.textContent?.trim() || '')
    .filter(Boolean);
    
  return items.map(item => formatListContent(item));
};

export const parseBenefits = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
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
  
  const items = Array.from(benefitsList.querySelectorAll('.LevrW'))
    .map(item => item.textContent?.trim() || '')
    .filter(Boolean);
    
  return items.map(item => formatListContent(item));
};

export const parseResponsibilities = (html: string): string[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
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
  
  const items = Array.from(responsibilitiesList.querySelectorAll('.LevrW'))
    .map(item => item.textContent?.trim() || '')
    .filter(Boolean);
    
  return items.map(item => formatListContent(item));
};

export const parseDescription = (html: string): { formatted: string; plain: string } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const nguyPeDiv = doc.querySelector('.NgUYpe div');
  let rawDescription = '';
  
  if (nguyPeDiv) {
    const header = nguyPeDiv.querySelector('.FkMLeb');
    if (header && header.textContent?.includes('Job description')) {
      const dotsSpan = nguyPeDiv.querySelector('span[jsname="pqRzIf"]');
      if (dotsSpan) {
        dotsSpan.remove();
      }
      
      rawDescription = Array.from(nguyPeDiv.querySelectorAll('span'))
        .map(span => span.textContent?.trim())
        .filter(Boolean)
        .join('\n');
    }
  }
  
  if (!rawDescription) {
    const us2QZbElement = doc.querySelector('.us2QZb');
    rawDescription = us2QZbElement?.textContent?.trim() || '';
  }
  
  const formattedDescription = formatListContent(rawDescription)
    .replace(/\n/g, '<br>'); // Convert newlines to <br> tags
  
  const plainDescription = formatListContent(rawDescription)
    .replace(/<br>/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' '); // Collapse multiple spaces
    
  return {
    formatted: formattedDescription,
    plain: plainDescription
  };
};

export const parseApplyLink = (html: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  const applyLinks = doc.querySelectorAll('a[href*="apply"]');
  for (const link of applyLinks) {
    const href = link.getAttribute('href');
    if (href) {
      return cleanUrl(href);
    }
  }
  return '';
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
  
  const { formatted: description, plain: descriptionPlain } = parseDescription(html);
  console.log('Parsed description length:', description.length);
  
  const applyLink = parseApplyLink(html);
  console.log('Parsed apply link:', applyLink);
  
  const slug = generateSlug(jobTitle, company);
  const metaDescription = cleanMetaDescription(descriptionPlain); // Use plain version for meta
  const imageUrl = getRandomJobImage();
  console.log('Selected random image URL:', imageUrl);
  
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
    descriptionPlain,
    applyLink,
    slug,
    metaDescription,
    imageUrl
  };
  
  const jsonLd = generateJsonLd({
    ...jobData,
    description: descriptionPlain // Use plain version for JSON-LD
  });
  
  return {
    ...jobData,
    jsonLd
  };
};
