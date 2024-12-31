import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { parseJobDetails } from '@/utils/jobParser';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [parsedJob, setParsedJob] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleParse = () => {
    try {
      const jobDetails = parseJobDetails(htmlInput);
      setParsedJob(jobDetails);
      toast({
        title: "Successfully parsed job details",
        description: "You can now review and edit the parsed information.",
      });
    } catch (error) {
      console.error('Parsing error:', error);
      toast({
        title: "Error parsing job details",
        description: "Please check the HTML input and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!parsedJob) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('job_posts')
        .insert([{
          job_title: parsedJob.jobTitle,
          company: parsedJob.company,
          location: parsedJob.location,
          job_type: parsedJob.jobType,
          salary: parsedJob.salary,
          qualifications: parsedJob.qualifications,
          benefits: parsedJob.benefits,
          responsibilities: parsedJob.responsibilities,
          job_description: parsedJob.description,
          application_link: parsedJob.applyLink,
          slug: parsedJob.slug,
          meta_description: parsedJob.metaDescription,
          json_ld: parsedJob.jsonLd
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Job post saved",
        description: "Successfully saved to database",
      });
      
      // Reset form
      setHtmlInput('');
      setParsedJob(null);
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Error saving job post",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Post Parser</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Input HTML</h2>
          <Textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste job post HTML here..."
            className="min-h-[300px] mb-4"
          />
          <Button onClick={handleParse} className="w-full">
            Parse HTML
          </Button>
        </Card>

        {parsedJob && (
          <Card className="p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4">Parsed Results</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Job Title</label>
                <Input
                  value={parsedJob.jobTitle}
                  onChange={(e) => setParsedJob({...parsedJob, jobTitle: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <Input
                  value={parsedJob.company}
                  onChange={(e) => setParsedJob({...parsedJob, company: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={parsedJob.location}
                  onChange={(e) => setParsedJob({...parsedJob, location: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Job Type</label>
                <Input
                  value={parsedJob.jobType}
                  onChange={(e) => setParsedJob({...parsedJob, jobType: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Salary</label>
                <Input
                  value={parsedJob.salary}
                  onChange={(e) => setParsedJob({...parsedJob, salary: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Job Description</label>
                <Textarea
                  value={parsedJob.description}
                  onChange={(e) => setParsedJob({...parsedJob, description: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Qualifications</label>
                <Textarea
                  value={parsedJob.qualifications?.join('\n')}
                  onChange={(e) => setParsedJob({...parsedJob, qualifications: e.target.value.split('\n')})}
                  className="min-h-[100px]"
                  placeholder="One qualification per line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Benefits</label>
                <Textarea
                  value={parsedJob.benefits?.join('\n')}
                  onChange={(e) => setParsedJob({...parsedJob, benefits: e.target.value.split('\n')})}
                  className="min-h-[100px]"
                  placeholder="One benefit per line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Responsibilities</label>
                <Textarea
                  value={parsedJob.responsibilities?.join('\n')}
                  onChange={(e) => setParsedJob({...parsedJob, responsibilities: e.target.value.split('\n')})}
                  className="min-h-[100px]"
                  placeholder="One responsibility per line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Application Link</label>
                <Input
                  value={parsedJob.applyLink}
                  onChange={(e) => setParsedJob({...parsedJob, applyLink: e.target.value})}
                />
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Saving...' : 'Save to Database'}
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Parser Configuration Guide</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Supported Currency Symbols</h3>
            <p className="text-sm text-gray-600">
              Rp, US$, AU$, S$, SGD, IDR, AED, ₹, £
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Time Period Formats</h3>
            <p className="text-sm text-gray-600">
              per day, a day, per hour, an hour, per month, a month, per week, a week, per year, a year
            </p>
          </div>
          
          <div>
            <h3 className="font-medium">Base URL Configuration</h3>
            <p className="text-sm text-gray-600">
              To change the base URL, update the VITE_APP_URL environment variable in your .env file
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Index;
