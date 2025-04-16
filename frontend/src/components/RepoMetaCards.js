import React from 'react';

function RepoMetaCards({ meta }) {
  if (!meta) return null;
  const { name, full_name, stars, forks, issues } = meta;
  const items = [
    { label: 'Repository', value: name || full_name },
    { label: 'Stars', value: stars },
    { label: 'Forks', value: forks },
    { label: 'Open Issues', value: issues },
  ];
  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map(item => (
        <div key={item.label} className="bg-white rounded shadow p-4 flex flex-col items-center">
          <div className="text-gray-500 text-sm">{item.label}</div>
          <div className="text-2xl font-bold">{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export default RepoMetaCards;
