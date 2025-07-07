'use client'
import { useApp } from "@/contexts/Appcontext";

export function QueryResults() {
  const { state } = useApp();

  if (!state.queryResults) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Query Results</h2>
        <div className="text-gray-600 text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <p>Execute a query to see results here</p>
        </div>
      </div>
    );
  }

  const { query, tableName, results, columns } = state.queryResults;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Query Results</h2>
      
      <div className="mb-4">
        <div className="bg-gray-100 p-3 rounded-md">
          <p className="text-sm text-gray-600 mb-1">Executed Query:</p>
          <code className="text-sm font-mono text-blue-600">{query}</code>
        </div>
      </div>
      
      <div className="mb-2">
        <p className="text-sm text-gray-600">
          Results: {results.length} row(s) from table '{tableName}'
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column: string) => (
                <th key={column} className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row: any, index: number) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column: string) => (
                  <td key={column} className="px-4 py-2 text-sm text-gray-900 border-b">
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}