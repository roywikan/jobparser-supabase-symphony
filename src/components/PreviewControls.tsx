import { Button } from "@/components/ui/button";
import { Copy, Github, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { sendToGithub } from "@/utils/githubUtils";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface PreviewControlsProps {
  onCopy: () => Promise<void>;
  htmlContent: string;
  slug: string;
}

const PreviewControls = ({ onCopy, htmlContent, slug }: PreviewControlsProps) => {
  const [customDomain, setCustomDomain] = useState("");
  const [customRepo, setCustomRepo] = useState("");
  const [customCountry, setCustomCountry] = useState("United Kingdom");
  
  // Internal function to get the effective domain
  const getEffectiveDomain = () => customDomain || "uk.job.web.id";
  
  // Internal function to get the effective repository
  const getEffectiveRepo = () => customRepo || "roywikan/job-uk";

  const handleSendToGithub = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to save to GitHub");
      return;
    }

    const effectiveRepo = getEffectiveRepo();
    
    // Validate repository format if custom repo is provided
    if (customRepo && !customRepo.match(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-_\.]+$/)) {
      toast.error("Invalid repository format. Please use format: username/repository");
      return;
    }

    try {
      const result = await sendToGithub(htmlContent, slug, effectiveRepo);
      if (result.success) {
        toast.success("Successfully sent to GitHub repository!");
      } else {
        toast.error(`Failed to send to GitHub repository: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to send to GitHub repository");
    }
  };

  const handleRegenerateIndex = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to regenerate index");
      return;
    }

    try {
      const result = await sendToGithub('', '', getEffectiveRepo(), true);
      if (result.success) {
        toast.success("Successfully regenerated index files!");
      } else {
        toast.error(`Failed to regenerate index files: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to regenerate index files");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button 
          onClick={onCopy}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy HTML
        </Button>
        <Button
          onClick={handleSendToGithub}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Github className="h-4 w-4" />
          Send HTML to GitHub repo
        </Button>
        <Button
          onClick={handleRegenerateIndex}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate Index HTMLs File
        </Button>
      </div>
      

      <div className="flex items-center gap-2">
        <label
          htmlFor="defaultValuesInfo"
          className="text-sm whitespace-nowrap"
        >
          Change default values?
        </label>
        <Input
          id="defaultValuesInfo"
          placeholder="Edit: /src/components/PreviewControls.tsx"
          className="max-w-xs"
          readOnly // Marked as read-only to clarify its purpose
        />
      </div>





      
      <div className="flex items-center gap-2">
        <label htmlFor="customDomain" className="text-sm whitespace-nowrap">Custom Domain:</label>
        <Input
          id="customDomain"
          value={customDomain}
          onChange={(e) => setCustomDomain(e.target.value)}
          placeholder="Leave empty for default"
          className="max-w-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="customRepo" className="text-sm whitespace-nowrap">Custom Repository:</label>
        <Input
          id="customRepo"
          value={customRepo}
          onChange={(e) => setCustomRepo(e.target.value)}
          placeholder="Leave empty for default"
          className="max-w-xs"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="customCountry" className="text-sm whitespace-nowrap">Custom Country:</label>
        <Input
          id="customCountry"
          value={customCountry}
          onChange={(e) => setCustomCountry(e.target.value)}
          placeholder="Leave empty for default"
          className="max-w-xs"
        />
      </div>
    </div>
  );
};

export default PreviewControls;
