import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface JobPostPreviewProps {
  parsedJob: any;
}

const JobPostPreview = ({ parsedJob }: JobPostPreviewProps) => {
  if (!parsedJob) return null;

  const formattedDate = new Date().toISOString();
  
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${parsedJob.metaDescription}">
    <title>${parsedJob.jobTitle} - ${parsedJob.company}</title>
</head>
<body>
    <header>
        <h1>${parsedJob.jobTitle}</h1>
        <p><strong>Company:</strong> ${parsedJob.company}</p>
        <p><strong>Location:</strong> ${parsedJob.location}</p>
        <p><strong>Job Type:</strong> ${parsedJob.jobType}</p>
        <p><strong>Salary:</strong> ${parsedJob.salary}</p>
    </header>
    <main>
        <section>
            <h2>Job Description</h2>
            <p>${parsedJob.description}</p>
        </section>
        <section>
            <h2>Qualifications</h2>
            <ul>
                ${parsedJob.qualifications?.map(qual => `<li>${qual}</li>`).join('\n                ') || ''}
            </ul>
        </section>
        <section>
            <h2>Benefits</h2>
            <ul>
                ${parsedJob.benefits?.map(benefit => `<li>${benefit}</li>`).join('\n                ') || ''}
            </ul>
        </section>
        <section>
            <h2>Responsibilities</h2>
            <ul>
                ${parsedJob.responsibilities?.map(resp => `<li>${resp}</li>`).join('\n                ') || ''}
            </ul>
        </section>
        <section>
            <h2>How to Apply</h2>
            <a href="${parsedJob.applyLink}" rel="nofollow">Apply Here</a>
        </section>
        <section>
            <h2>Location Map</h2>
            <p><strong>Location Map:</strong> <div class="mapouter"><div class="gmap_canvas"><iframe loading="lazy" id="gmap_canvas" title="${parsedJob.jobTitle}" src="https://maps.google.com/maps?q=${encodeURIComponent(parsedJob.location)}&amp;t=&amp;z=18&amp;ie=UTF8&amp;iwloc=&amp;output=embed" width="100%" height="240px" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="width: 100%;"></iframe></div></div></p>
        </section>
        <section>
            <h2>Snippet</h2>
            <blockquote>
                ${parsedJob.metaDescription}
            </blockquote>
        </section>
    </main>
    <footer>
        <p>Published on ${formattedDate}</p>
    </footer>
    <p><script type="application/ld+json">${JSON.stringify(parsedJob.jsonLd, null, 2)}</script></p>
</body>
</html>`;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">HTML Preview</h2>
      <Textarea
        value={htmlTemplate}
        readOnly
        className="min-h-[300px] font-mono text-sm"
      />
    </Card>
  );
};

export default JobPostPreview;