import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import PreviewControls from "./PreviewControls";
import { cleanField, cleanJsonLdField, cleanMetaField, generateHashtags, generateHtmlTemplate } from "@/utils/jobPreviewUtils";
import { cleanUrl, cleanLocation } from "@/utils/jobParserUtils/textCleaner";

const removeDuplicatePhrases = (title: string): string => {
  if (!title) return '';
  const parts = title.split('-').map(part => part.trim());
  const uniqueParts = parts.filter((part, index) => parts.indexOf(part) === index);
  return uniqueParts.join(' - ');
};

interface JobPostPreviewProps {
  parsedJob: any;
  rawHtml?: string;
}

const JobPostPreview = ({ parsedJob, rawHtml }: JobPostPreviewProps) => {
  if (!parsedJob) return null;

  const formattedDate = new Date().toISOString();
  
  // Ensure consistent title across all fields
  const rawTitle = `${parsedJob.company} - ${parsedJob.jobTitle}${parsedJob.location ? ` - ${parsedJob.location}` : ''}`;
  const pageTitle = removeDuplicatePhrases(rawTitle);

  const hashtags = generateHashtags(pageTitle);

  // Clean and format the job description
  const cleanDescription = (html: string) => {
    if (!html) return '';
    return html
      .replace(/<h3[^>]*>.*?<\/h3>/g, '') // Remove h3 tags
      .replace(/<span[^>]*>(.*?)<\/span>/g, '$1') // Remove span tags but keep content
      .replace(/\s*<br>\s*/g, '<br>') // Normalize br tags
      .replace(/(<br>){3,}/g, '<br><br>') // Replace multiple br tags with double br
      .trim();
  };

  // Preserve original values before cleaning
  const cleanedJob = {
    ...parsedJob,
    pageTitle,
    jobTitle: pageTitle,
    imageUrl: cleanField(parsedJob.imageUrl),
    company: cleanField(parsedJob.company || ''),
    location: cleanLocation(parsedJob.location || ''),
    jobType: cleanField(parsedJob.jobType || ''),
    salary: cleanField(parsedJob.salary || ''),
    description: cleanDescription(parsedJob.description || ''),
    qualifications: (parsedJob.qualifications || []).map(cleanField).filter(Boolean),
    benefits: (parsedJob.benefits || []).map(cleanField).filter(Boolean),
    responsibilities: (parsedJob.responsibilities || []).map(cleanField).filter(Boolean),
    metaDescription: cleanMetaField(parsedJob.metaDescription || ''),
    applyLink: cleanUrl(parsedJob.applyLink || ''),
    slug: parsedJob.slug,
    jsonLd: {
      ...parsedJob.jsonLd,
      title: pageTitle,
      description: cleanJsonLdField(parsedJob.jsonLd?.description || ''),
    },
  };

  const [htmlContent, setHtmlContent] = useState(generateHtmlTemplate(cleanedJob, formattedDate, hashtags));

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent);
      toast.success("HTML copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy HTML to clipboard");
    }
  };

  // Extract raw job description from HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml || '', 'text/html');
  const nguyPeDiv = doc.querySelector('.NgUYpe div');
  let rawDescription = '';
  
  if (nguyPeDiv) {
    const header = nguyPeDiv.querySelector('.FkMLeb');
    if (header && header.textContent?.includes('Job description')) {
      rawDescription = nguyPeDiv.innerHTML;
    }
  }

  if (!rawDescription) {
    const us2QZbElement = doc.querySelector('.us2QZb');
    rawDescription = us2QZbElement?.innerHTML || '';
  }

  return (
    <Card className="p-6 space-y-6">
      {rawHtml && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Raw Job Description HTML</h3>
          <Textarea
            value={rawDescription}
            readOnly
            className="min-h-[150px] font-mono text-sm"
          />
        </div>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">HTML Preview</h2>
          <PreviewControls 
            onCopy={handleCopy}
            htmlContent={htmlContent}
            slug={cleanedJob.slug}
          />
        </div>
        <Textarea
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          className="min-h-[300px] font-mono text-sm"
        />
      </div>
    </Card>
  );
};

export default JobPostPreview;