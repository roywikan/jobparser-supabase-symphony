import { supabase } from "@/integrations/supabase/client";

export const sendToGithub = async (htmlContent: string, slug: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('github-commit', {
      body: {
        content: htmlContent,
        fileName: `${slug}.html`,
        repo: 'roywikan/job-uk',
        branch: 'main'
      }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending to GitHub:', error);
    return { success: false, error };
  }
};