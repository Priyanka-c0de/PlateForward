import React from 'react';
import './Table.css';

interface TableProps<T> {
  data: T[];
  title?: string;
}

export default function Table<T extends Record<string, any>>({ data, title }: TableProps<T>) {
  if (!data || data.length === 0) {
    return <p>No records to display.</p>;
  }
  const headers = Object.keys(data[0]);
  return (
    <div className="table-container">
      {title && <h2>{title}</h2>}
      <table className="responsive-table">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map((h) => (
                <td key={h}>{String(row[h])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
