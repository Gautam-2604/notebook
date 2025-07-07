'use client'
import { useApp } from "@/contexts/Appcontext";
import { useState } from "react";

export function SchemaExplorer() {
  const { state, executeQuery } = useApp();
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const toggleTable = (tableName: string) => {
    const newExpanded = new Set(expandedTables);
    if (newExpanded.has(tableName)) {
      newExpanded.delete(tableName);
    } else {
      newExpanded.add(tableName);
    }
    setExpandedTables(newExpanded);
  };

  const handlePreview = (tableName: string) => {
    const query = `SELECT * FROM ${tableName} LIMIT 10`;
    executeQuery(query, tableName);
  };

  if (!state.schema) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Schema Explorer</h2>
        <div className="text-gray-600 text-center py-8">
          <div className="text-4xl mb-4">🔌</div>
          <p>Please connect to a database first to explore the schema</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Schema Explorer</h2>
      <div className="space-y-3">
        {state.schema.tables.map((table: any) => (
          <div key={table.name} className="border border-gray-200 rounded-lg">
            <div className="p-3 bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => toggleTable(table.name)}
                className="flex items-center text-left flex-1"
              >
                <span className="mr-2">
                  {expandedTables.has(table.name) ? '▼' : '▶'}
                </span>
                <span className="font-medium text-gray-800">📋 {table.name}</span>
                <span className="ml-2 text-sm text-gray-600">
                  ({table.columns.length} columns)
                </span>
              </button>
              <button
                onClick={() => handlePreview(table.name)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
              >
                Preview
              </button>
            </div>
            {expandedTables.has(table.name) && (
              <div className="p-3 border-t border-gray-200">
                <div className="space-y-2">
                  {table.columns.map((column: any) => (
                    <div key={column.name} className="flex items-center text-sm">
                      <span className="font-mono text-blue-600 mr-2">•</span>
                      <span className="font-medium mr-2 text-black">{column.name}</span>
                      <span className="text-gray-600 mr-2">{column.type}</span>
                      {column.primaryKey && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          PK
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}