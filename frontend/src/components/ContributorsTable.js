import React from 'react';

function ContributorsTable({ contributors }) {
  if (!contributors || contributors.length === 0) return <div>No contributors found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Avatar</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Contributions</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map(c => (
            <tr key={c.login}>
              <td className="px-4 py-2"><img src={c.avatar_url} alt="avatar" className="w-8 h-8 rounded-full" /></td>
              <td className="px-4 py-2"><a href={c.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{c.login}</a></td>
              <td className="px-4 py-2">{c.contributions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContributorsTable;
