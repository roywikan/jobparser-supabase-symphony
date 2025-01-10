import { supabase } from "@/integrations/supabase/client";

export const sendToGithub = async (htmlContent: string, slug: string, repository: string, regenerateIndex = false) => {
  try {
    console.log('Sending to GitHub:', { repository, slug, regenerateIndex });
    
    const { data, error } = await supabase.functions.invoke('github-commit', {
      body: {
        content: htmlContent,
        fileName: `${slug}.html`,
        repo: repository,
        branch: 'main',
        regenerateIndex
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    console.log('GitHub commit response:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending to GitHub:', error);
    return { success: false, error };
  }
};