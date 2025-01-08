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
  const [repository, setRepository] = useState("roywikan/job-uk");

  const handleSendToGithub = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to save to GitHub");
      return;
    }

    // Validate repository format
    if (!repository.match(/^[a-zA-Z0-9-]+\/[a-zA-Z0-9-_\.]+$/)) {
      toast.error("Invalid repository format. Please use format: username/repository");
      return;
    }

    try {
      const result = await sendToGithub(htmlContent, slug, repository);
      if (result.success) {
        toast.success("Successfully sent to GitHub repository!");
      } else {
        toast.error("Failed to send to GitHub repository");
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
      const result = await sendToGithub('', '', repository, true);
      if (result.success) {
        toast.success("Successfully regenerated index files!");
      } else {
        toast.error("Failed to regenerate index files");
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
          Send to GitHub
        </Button>
        <Button
          onClick={handleRegenerateIndex}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Regenerate Index
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="repository" className="text-sm whitespace-nowrap">Target Repository:</label>
        <Input
          id="repository"
          value={repository}
          onChange={(e) => setRepository(e.target.value)}
          placeholder="username/repository"
          className="max-w-xs"
        />
      </div>
    </div>
  );
};

export default PreviewControls;