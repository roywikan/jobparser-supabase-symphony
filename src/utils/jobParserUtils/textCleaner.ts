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

export const formatListContent = (content: string): string => {
  if (!content) return '';
  
  return content
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between joined words
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