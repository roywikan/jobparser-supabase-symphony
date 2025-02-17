export const cleanMetaDescription = (text: string): string => {
  if (!text) return '';
  
  let cleaned = text
    .replace(/Identified by Google from the original job post/g, '')
    .replace(/Job highlightsIdentified Google from original job post/g, '')
    .replace(/<\/li><li class="LevrW">/g, ' - ')
    .replace(/<\/li><li jsname="wsRnQ" style="" class="LevrW">/g, ' - ');
    
  // Add space after punctuation marks
  cleaned = cleaned.replace(/([.!?])([A-Z])/g, '$1 $2');
  
  // Remove symbols and non-ASCII characters
  cleaned = cleaned.replace(/[^\x00-\x7F]/g, '');
  
  // Remove unimportant words for meta description
  const unimportantWords = ['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  cleaned = cleaned.split(' ')
    .filter(word => !unimportantWords.includes(word.toLowerCase()))
    .join(' ');
    
  // Limit to 20 words
  return cleaned.split(' ').slice(0, 20).join(' ').trim();
};

export const cleanUrl = (url: string): string => {
  if (!url) return '';
  
  // Remove any whitespace
  let cleaned = url.trim();
  
  // Ensure URL starts with http:// or https://
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  
  // Remove query strings
  cleaned = cleaned.split('?')[0];
  
  // Remove any trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  
  return cleaned;
};

// Create a context to manage the custom country state
import { createContext, useContext } from 'react';

export const CustomCountryContext = createContext<string>("United Kingdom");

export const useCustomCountry = () => {
  return useContext(CustomCountryContext);
};

export const cleanLocation = (location: string): string => {
  const customCountry = useCustomCountry();
  
  // Check if location is empty
  if (!location) return customCountry;

  const lowerCaseLocation = location.toLowerCase();

  // If location contains "Remote", return a formatted string
  if (lowerCaseLocation.includes('remote')) {
    return 'Remote Job';
  }

  // Remove everything after "via" (case insensitive)
  const viaIndex = lowerCaseLocation.indexOf(' via ');
  if (viaIndex !== -1) {
    return location.substring(0, viaIndex).trim();
  }

  // Check for "via" at the start
  if (lowerCaseLocation.startsWith('via ')) {
    return customCountry;
  }

  // Return trimmed location
  return location.trim();
};

export const formatListContent = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/Job highlights Identified by Google from the original job post/g, '')
    .replace(/Identified by Google from the original job post/g, '')
    .replace(/<h4 class="yVFmQd cS4Vcb-pGL6qe-KUvarc">/g, '<br><br>')
    .replace(/<\/li><li class="LevrW">/g, '<BR>- ')
    .replace(/<\/li><li jsname="wsRnQ" style="" class="LevrW">/g, '<BR>- ')
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    .replace(/items\(s\)Benefits/g, 'items(s)\nBenefits')
    .replace(/items\(s\)Responsibilities/g, 'items(s)\nResponsibilities')
    .trim();
};

export const formatJsonLdContent = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/Job highlights Identified by Google from the original job post/g, '')
    .replace(/Identified by Google from the original job post/g, '')
    .replace(/<h4 class="yVFmQd cS4Vcb-pGL6qe-KUvarc">/g, '\n\n')
    .replace(/<\/li><li class="LevrW">/g, '\n- ')
    .replace(/<\/li><li jsname="wsRnQ" style="" class="LevrW">/g, '\n- ')
    .replace(/([.!?])([A-Z])/g, '$1 $2')
    .replace(/items\(s\)Benefits/g, 'items(s)\nBenefits')
    .replace(/items\(s\)Responsibilities/g, 'items(s)\nResponsibilities')
    .trim();
};