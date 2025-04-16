import React from 'react';

function CommitMetrics({ metrics }) {
  if (!metrics) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-6">
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <div className="text-gray-500 text-sm">Total Commits (Last 52 Weeks)</div>
        <div className="text-2xl font-bold">{metrics.totalCommits}</div>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <div className="text-gray-500 text-sm">Average Commits/Week</div>
        <div className="text-2xl font-bold">{metrics.avgCommits}</div>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <div className="text-gray-500 text-sm">Most Active Week</div>
        <div className="text-2xl font-bold">Week {metrics.mostActiveWeek} ({metrics.maxCommits} commits)</div>
      </div>
      <div className="bg-white rounded shadow p-4 flex flex-col items-center">
        <div className="text-gray-500 text-sm">Least Active Week</div>
        <div className="text-2xl font-bold">Week {metrics.leastActiveWeek} ({metrics.minCommits} commits)</div>
      </div>
    </div>
  );
}

export default CommitMetrics;
