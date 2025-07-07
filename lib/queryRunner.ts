import { mockData } from "@/lib/mockData";

export interface QueryResult {
  query: string;
  tableName: string;
  results: any[];
  columns: string[];
  executionTime: number;
  rowCount: number;
}

export interface QueryError {
  message: string;
  code?: string;
  details?: string;
}

export class QueryRunner {
  private static instance: QueryRunner;
  
  private constructor() {}
  
  static getInstance(): QueryRunner {
    if (!QueryRunner.instance) {
      QueryRunner.instance = new QueryRunner();
    }
    return QueryRunner.instance;
  }

  async executeQuery(query: string, tableName: string): Promise<QueryResult> {
    const startTime = performance.now();
    
    try {
      // Simulate network delay
      await this.simulateDelay();
      
      // Validate query
      this.validateQuery(query, tableName);
      
      // Execute query simulation
      const results = this.processQuery(query, tableName);
      const columns = this.extractColumns(results);
      
      const executionTime = performance.now() - startTime;
      
      return {
        query,
        tableName,
        results,
        columns,
        executionTime: Math.round(executionTime),
        rowCount: results.length
      };
    } catch (error) {
      throw this.createQueryError(error, query, tableName);
    }
  }

  private async simulateDelay(): Promise<void> {
    // Simulate realistic query execution time (200-800ms)
    const delay = Math.random() * 600 + 200;
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private validateQuery(query: string, tableName: string): void {
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    if (!tableName || tableName.trim().length === 0) {
      throw new Error('Table name cannot be empty');
    }

    // Check if table exists in mock data
    if (!mockData[tableName as keyof typeof mockData]) {
      throw new Error(`Table '${tableName}' not found in database`);
    }

    // Basic SQL validation (extend as needed)
    const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP'];
    const upperQuery = query.toUpperCase().trim();
    
    if (!sqlKeywords.some(keyword => upperQuery.startsWith(keyword))) {
      throw new Error('Invalid SQL query: Must start with a valid SQL keyword');
    }
  }

  private processQuery(query: string, tableName: string): any[] {
    const tableData = mockData[tableName as keyof typeof mockData];
    const upperQuery = query.toUpperCase().trim();
    
    // Simple query processing simulation
    if (upperQuery.startsWith('SELECT')) {
      return this.processSelectQuery(query, tableData);
    } else if (upperQuery.startsWith('INSERT')) {
      return this.processInsertQuery(query, tableData);
    } else if (upperQuery.startsWith('UPDATE')) {
      return this.processUpdateQuery(query, tableData);
    } else if (upperQuery.startsWith('DELETE')) {
      return this.processDeleteQuery(query, tableData);
    }
    
    return tableData;
  }

  private processSelectQuery(query: string, data: any[]): any[] {
    // Simple SELECT simulation
    const upperQuery = query.toUpperCase();
    
    if (upperQuery.includes('LIMIT')) {
      const limitMatch = upperQuery.match(/LIMIT\s+(\d+)/);
      if (limitMatch) {
        const limit = parseInt(limitMatch[1]);
        return data.slice(0, limit);
      }
    }
    
    if (upperQuery.includes('WHERE')) {
      // Simple WHERE clause simulation
      return data.slice(0, Math.floor(data.length * 0.7));
    }
    
    return data;
  }

  private processInsertQuery(query: string, data: any[]): any[] {
    // For INSERT queries, return a success indicator
    return [{ message: 'INSERT successful', affected_rows: 1 }];
  }

  private processUpdateQuery(query: string, data: any[]): any[] {
    // For UPDATE queries, return affected rows count
    const affectedRows = Math.floor(data.length * 0.3);
    return [{ message: 'UPDATE successful', affected_rows: affectedRows }];
  }

  private processDeleteQuery(query: string, data: any[]): any[] {
    // For DELETE queries, return affected rows count
    const affectedRows = Math.floor(data.length * 0.1);
    return [{ message: 'DELETE successful', affected_rows: affectedRows }];
  }

  private extractColumns(results: any[]): string[] {
    if (!results || results.length === 0) {
      return [];
    }
    
    return Object.keys(results[0]);
  }

  private createQueryError(error: unknown, query: string, tableName: string): QueryError {
    const baseMessage = error instanceof Error ? error.message : 'Query execution failed';
    
    return {
      message: baseMessage,
      code: 'QUERY_ERROR',
      details: `Failed to execute query on table '${tableName}': ${query.substring(0, 100)}${query.length > 100 ? '...' : ''}`
    };
  }

  // Utility methods for query analysis
  getQueryType(query: string): string {
    const upperQuery = query.toUpperCase().trim();
    
    if (upperQuery.startsWith('SELECT')) return 'SELECT';
    if (upperQuery.startsWith('INSERT')) return 'INSERT';
    if (upperQuery.startsWith('UPDATE')) return 'UPDATE';
    if (upperQuery.startsWith('DELETE')) return 'DELETE';
    if (upperQuery.startsWith('CREATE')) return 'CREATE';
    if (upperQuery.startsWith('DROP')) return 'DROP';
    
    return 'UNKNOWN';
  }

  isReadOnlyQuery(query: string): boolean {
    const readOnlyTypes = ['SELECT', 'SHOW', 'DESCRIBE', 'EXPLAIN'];
    return readOnlyTypes.includes(this.getQueryType(query));
  }

  formatQuery(query: string): string {
    // Simple query formatting
    return query
      .replace(/\s+/g, ' ')
      .replace(/,\s*/g, ', ')
      .replace(/\(\s*/g, '(')
      .replace(/\s*\)/g, ')')
      .trim();
  }
}

// Export singleton instance
export const queryRunner = QueryRunner.getInstance();