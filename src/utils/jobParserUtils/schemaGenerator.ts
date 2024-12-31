export const generateSlug = (title: string, company: string): string => {
  const combined = `${title}-${company}`.toLowerCase();
  return combined
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
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