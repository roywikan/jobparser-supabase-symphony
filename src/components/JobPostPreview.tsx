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
  rawHtml?: string; // Add new prop for raw HTML
}

const JobPostPreview = ({ parsedJob, rawHtml }: JobPostPreviewProps) => {
  if (!parsedJob) return null;

  const formattedDate = new Date().toISOString();
  
  // Ensure consistent title across all fields
  const rawTitle = `${parsedJob.company} - ${parsedJob.jobTitle}${parsedJob.location ? ` - ${parsedJob.location}` : ''}`;
  const pageTitle = removeDuplicatePhrases(rawTitle);

  const hashtags = generateHashtags(pageTitle);

  // Preserve original values before cleaning
  const cleanedJob = {
    ...parsedJob,
    pageTitle,
    jobTitle: pageTitle, // Set job title to match og:title
    imageUrl: cleanField(parsedJob.imageUrl),
    company: cleanField(parsedJob.company || ''), // Add fallback for empty company
    location: cleanLocation(parsedJob.location || ''), // Add fallback for empty location
    jobType: cleanField(parsedJob.jobType || ''), // Add fallback for empty job type
    salary: cleanField(parsedJob.salary || ''), // Add fallback for empty salary
    description: cleanField(parsedJob.description || ''),
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
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">HTML Preview</h2>
        <PreviewControls 
          onCopy={handleCopy}
          htmlContent={htmlContent}
          slug={cleanedJob.slug}
        />
      </div>
      <div className="space-y-4">
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