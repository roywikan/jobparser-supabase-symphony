import { Button } from "@/components/ui/button";
import { Copy, Github } from "lucide-react";
import { toast } from "sonner";
import { sendToGithub } from "@/utils/githubUtils";
import { supabase } from "@/integrations/supabase/client";

interface PreviewControlsProps {
  onCopy: () => Promise<void>;
  htmlContent: string;
  slug: string;
}

const PreviewControls = ({ onCopy, htmlContent, slug }: PreviewControlsProps) => {
  const handleSendToGithub = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to save to GitHub");
      return;
    }

    try {
      const result = await sendToGithub(htmlContent, slug);
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

  return (
    <div className="flex gap-2">
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
    </div>
  );
};

export default PreviewControls;