import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import PreviewControls from "./PreviewControls";
import { cleanField, cleanJsonLdField, cleanMetaField, generateHashtags, generateHtmlTemplate } from "@/utils/jobPreviewUtils";
import { cleanUrl } from "@/utils/jobParserUtils/textCleaner";

interface JobPostPreviewProps {
  parsedJob: any;
}

const JobPostPreview = ({ parsedJob }: JobPostPreviewProps) => {
  if (!parsedJob) return null;

  const formattedDate = new Date().toISOString();
  
  const pageTitle = `${parsedJob.company} - ${parsedJob.jobTitle}${parsedJob.location ? ` - ${parsedJob.location}` : ''}`;
  const hashtags = generateHashtags(pageTitle);

  const cleanedJob = {
    ...parsedJob,
    pageTitle,
    jobTitle: pageTitle, // Set job title to match og:title
    imageUrl: cleanField(parsedJob.imageUrl),
    company: cleanField(parsedJob.company),
    location: cleanField(parsedJob.location),
    jobType: cleanField(parsedJob.jobType),
    salary: cleanField(parsedJob.salary),
    description: cleanField(parsedJob.description),
    qualifications: parsedJob.qualifications?.map(cleanField).filter(Boolean),
    benefits: parsedJob.benefits?.map(cleanField).filter(Boolean),
    responsibilities: parsedJob.responsibilities?.map(cleanField).filter(Boolean),
    metaDescription: cleanMetaField(parsedJob.metaDescription),
    applyLink: cleanUrl(parsedJob.applyLink),
    slug: pageTitle, // Set slug to match og:title
    jsonLd: {
      ...parsedJob.jsonLd,
      title: pageTitle, // Set JSON-LD title to match og:title
      description: cleanJsonLdField(parsedJob.jsonLd?.description),
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