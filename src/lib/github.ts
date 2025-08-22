export interface CreatePrInput {
    owner: string;
    repo: string;
    token: string;
    roomId: string;
    filename: string;
    content: string;
  }
  
  export interface CreatePrResult { url: string }
  
  export async function createPullRequest(input: CreatePrInput): Promise<CreatePrResult> {
    const { owner, repo, token, roomId, filename, content } = input;
  
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "pairpilot",
      Accept: "application/vnd.github+json",
    };
  
    // 1) Get default branch + sha
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
    if (!repoRes.ok) throw new Error(`repo fetch failed: ${repoRes.status}`);
    const repoJson = await repoRes.json() as { default_branch: string };
    const base = repoJson.default_branch;
  
    const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${base}`, { headers });
    const refJson = await refRes.json() as { object: { sha: string } };
    const baseSha = refJson.object.sha;
  
    // 2) Create branch
    const branch = `pairpilot/${roomId}-${Date.now()}`;
    const newRef = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: baseSha }),
    });
    if (!newRef.ok) throw new Error(`create ref failed: ${newRef.status}`);
  
    // 3) Create/Update file on the branch
    const b64 = Buffer.from(content, "utf8").toString("base64");
    const path = `sessions/${roomId}/${filename}`;
    const put = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        message: `feat(pairpilot): add ${path}`,
        content: b64,
        branch,
        committer: { name: "PairPilot", email: "bot@pairpilot.dev" },
        author: { name: "PairPilot", email: "bot@pairpilot.dev" },
      }),
    });
    if (!put.ok) throw new Error(`put file failed: ${put.status}`);
  
    // 4) Open PR
    const pr = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: `PairPilot: ${roomId}`,
        head: branch,
        base,
        body: `Automatically created from PairPilot room **${roomId}**.\n\nCodeRabbit will review shortly.`,
      }),
    });
    if (!pr.ok) throw new Error(`create PR failed: ${pr.status}`);
    const prJson = await pr.json() as { html_url: string };
  
    return { url: prJson.html_url };
  }