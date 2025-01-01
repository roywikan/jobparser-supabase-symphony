import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface JobPostPreviewProps {
  parsedJob: any;
}

const JobPostPreview = ({ parsedJob }: JobPostPreviewProps) => {
  if (!parsedJob) return null;

  const formattedDate = new Date().toISOString();
  
  // Clean the unwanted text from all fields and handle bullet points
  const cleanField = (field: string) => {
    if (!field) return '';
    return field
      .replace(/Identified by Google from the original job post/g, '')
      .replace(/Job highlightsIdentified Google from original job post/g, '')
      .replace(/(?:• )+/g, '- ') // Replace consecutive bullet points with a single dash
      .trim();
  };

  const cleanedJob = {
    ...parsedJob,
    jobTitle: cleanField(parsedJob.jobTitle),
    company: cleanField(parsedJob.company),
    location: cleanField(parsedJob.location),
    jobType: cleanField(parsedJob.jobType),
    salary: cleanField(parsedJob.salary),
    description: cleanField(parsedJob.description),
    qualifications: parsedJob.qualifications?.map(cleanField),
    benefits: parsedJob.benefits?.map(cleanField),
    responsibilities: parsedJob.responsibilities?.map(cleanField),
    metaDescription: cleanField(parsedJob.metaDescription),
    slug: cleanField(parsedJob.slug),
  };
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${cleanedJob.metaDescription}">
    <title>${cleanedJob.jobTitle} - ${cleanedJob.company}</title>
</head>
<body>
    <header>
        <h1>${cleanedJob.jobTitle}</h1>
        <p><strong>Company:</strong> ${cleanedJob.company}</p>
        <p><strong>Location:</strong> ${cleanedJob.location}</p>
        <p><strong>Job Type:</strong> ${cleanedJob.jobType}</p>
        <p><strong>Salary:</strong> ${cleanedJob.salary}</p>
    </header>
    <main>
        <section>
            <h2>Job Description</h2>
            <p>${cleanedJob.description}</p>
        </section>
        <section>
            <h2>Qualifications</h2>
            <ul>
                ${cleanedJob.qualifications?.map(qual => `<li>${qual}</li>`).join('\n                ') || ''}
            </ul>
        </section>
        <section>
            <h2>Benefits</h2>
            <ul>
                ${cleanedJob.benefits?.map(benefit => `<li>${benefit}</li>`).join('\n                ') || ''}
            </ul>
        </section>
        <section>
            <h2>Responsibilities</h2>
            <ul>
                ${cleanedJob.responsibilities?.map(resp => `<li>${resp}</li>`).join('\n                ') || ''}
            </ul>
        </section>
        <section>
            <h2>How to Apply</h2>
            <a href="${cleanedJob.applyLink}" rel="nofollow">Apply Here</a>
        </section>
        <section>
            <h2>Location Map</h2>
            <p><strong>Location Map:</strong> <div class="mapouter"><div class="gmap_canvas"><iframe loading="lazy" id="gmap_canvas" title="${cleanedJob.jobTitle}" src="https://maps.google.com/maps?q=${encodeURIComponent(cleanedJob.location)}&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=&amp;output=embed" width="100%" height="240px" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width: 100%;"></iframe></div></div></p>
        </section>
        <section>
            <h2>Snippet</h2>
            <blockquote>
                ${cleanedJob.metaDescription}
            </blockquote>
        </section>
        <section>
            <h2>Slug</h2>
            <textarea>
                ${cleanedJob.slug}
            </textarea>
        </section>
    </main>
    <footer>
        <p>Published on ${formattedDate}</p>
    </footer>
    <p><script type="application/ld+json">${JSON.stringify(cleanedJob.jsonLd, null, 2)}</script></p>
</body>
</html>`;

  const handleCopy = async () => {
    try {
      // Clear clipboard first
      await navigator.clipboard.writeText('');
      // Copy new content
      await navigator.clipboard.writeText(htmlTemplate);
      toast.success("HTML copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy HTML to clipboard");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">HTML Preview</h2>
        <Button 
          onClick={handleCopy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy HTML
        </Button>
      </div>
      <Textarea
        value={htmlTemplate}
        readOnly
        className="min-h-[300px] font-mono text-sm"
      />
    </Card>
  );
};

export default JobPostPreview;