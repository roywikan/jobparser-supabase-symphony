import { encode as base64Encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';

const token = Deno.env.get('GITHUB_TOKEN');

export const fetchRepoFiles = async (repo: string) => {
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/`, {
    headers: {
      'Authorization': `token ${token}`,
      'Accept': 'application/vnd.github.v3+json',
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch repository files');
  }
  
  return await response.json();
};

export const fetchFileContent = async (downloadUrl: string) => {
  const response = await fetch(downloadUrl);
  return await response.text();
};

export const commitFile = async (repo: string, fileName: string, content: string, branch: string) => {
  console.log(`Committing ${fileName} to ${repo} on branch ${branch}`);
  
  try {
    // First try to get the file to get its SHA if it exists
    const getFileResponse = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      }
    });

    let sha;
    if (getFileResponse.ok) {
      const fileData = await getFileResponse.json();
      sha = fileData.sha;
    }

    // Prepare the request body
    const body: any = {
      message: `Update ${fileName}`,
      content: base64Encode(new TextEncoder().encode(content)),
      branch: branch
    };

    // Include SHA if file exists (for update) or omit it (for create)
    if (sha) {
      body.sha = sha;
    }

    // Make the commit
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('GitHub API Error:', errorData);
      throw new Error(`Failed to commit file: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error in commitFile:', error);
    throw error;
  }
};