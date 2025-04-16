import React, { useState } from 'react';
import axios from 'axios';
import RepoMetaCards from './components/RepoMetaCards';
import ContributorsTable from './components/ContributorsTable';
import CommitChart from './components/CommitChart';
import CommitMetrics from './components/CommitMetrics';

function App() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await axios.post(`${BACKEND_URL}/analyze`, { repoUrl });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">GitHub Repo Analyzer</h1>
        <div className="flex gap-2 mb-6 items-center">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Enter GitHub repo URL (e.g. https://github.com/facebook/react)"
            value={repoUrl}
            onChange={e => setRepoUrl(e.target.value)}
            disabled={loading}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            onClick={handleAnalyze}
            disabled={loading || !repoUrl}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        {error && (
          <div className="mb-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}
        {data && (
          <>
            <RepoMetaCards meta={data.meta} />
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Contributors</h2>
              <ContributorsTable contributors={data.contributors} />
            </div>
            {data.commitMetrics && (
              <CommitMetrics metrics={data.commitMetrics} />
            )}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Weekly Commit Activity</h2>
              <CommitChart activity={data.commitActivity} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
