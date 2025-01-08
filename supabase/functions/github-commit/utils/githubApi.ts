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
  const contentBase64 = encode(content);
  
  const response = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json',
    },
    body: JSON.stringify({
      message: `Update ${fileName}`,
      content: contentBase64,
      branch: branch
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to commit ${fileName}`);
  }

  return await response.json();
};