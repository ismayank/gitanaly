require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const path = require('path');
const app = express();
app.use(cors());
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function parseRepoUrl(url) {
  try {
    const match = url.match(/github.com[/:]([\w-]+)\/([\w.-]+)/i);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/(.git)?$/, '') };
  } catch {
    return null;
  }
}

async function githubRequest(url, params = {}) {
  return axios.get(url, {
    headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
    params,
  });
}

app.post('/analyze', async (req, res) => {
  const { repoUrl } = req.body;
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) return res.status(400).json({ error: 'Invalid GitHub repository URL.' });
  const { owner, repo } = parsed;
  try {
    // 1. Repo metadata
    const repoResp = await githubRequest(`${GITHUB_API}/repos/${owner}/${repo}`);
    const meta = {
      name: repoResp.data.name,
      full_name: repoResp.data.full_name,
      stars: repoResp.data.stargazers_count,
      forks: repoResp.data.forks_count,
      issues: repoResp.data.open_issues_count,
    };
    // 2. Contributors (first 30)
    const contribResp = await githubRequest(`${GITHUB_API}/repos/${owner}/${repo}/contributors`, { per_page: 30 });
    const contributors = contribResp.data.map(c => ({
      login: c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
      contributions: c.contributions,
    }));
    // 3. Commit activity (weekly, last year)
    const commitResp = await githubRequest(`${GITHUB_API}/repos/${owner}/${repo}/stats/commit_activity`);
    // commitResp.data is array of 52 weeks, each { total: int, week: unix, days: [int] }
    const commitActivity = Array.isArray(commitResp.data) ? commitResp.data.map(w => w.total) : [];

    // Additional commit frequency metrics
    let commitMetrics = null;
    if (commitActivity.length > 0) {
      const totalCommits = commitActivity.reduce((a, b) => a + b, 0);
      const avgCommits = +(totalCommits / commitActivity.length).toFixed(2);
      const maxCommits = Math.max(...commitActivity);
      const minCommits = Math.min(...commitActivity);
      const mostActiveWeek = commitActivity.indexOf(maxCommits) + 1;
      const leastActiveWeek = commitActivity.indexOf(minCommits) + 1;
      commitMetrics = {
        totalCommits,
        avgCommits,
        maxCommits,
        minCommits,
        mostActiveWeek,
        leastActiveWeek
      };
    }

    res.json({ meta, contributors, commitActivity, commitMetrics });
  } catch (err) {
    if (err.response && err.response.status === 202) {
      // GitHub is calculating stats, ask user to try again
      return res.status(202).json({ error: 'GitHub is generating commit stats. Please try again in a moment.' });
    }
    res.status(500).json({ error: err.response?.data?.message || 'Failed to analyze repository.' });
  }
});

// SPA fallback: send index.html for non-API GET requests
app.get('*', (req, res) => {
  if (req.path.startsWith('/analyze')) return res.status(404).end();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
