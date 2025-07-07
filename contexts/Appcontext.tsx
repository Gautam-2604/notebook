'use client'
import { mockSchema } from "@/lib/mockSchema";
import { queryRunner, QueryResult } from "@/lib/queryRunner"
import { createContext, ReactNode, useContext, useReducer } from "react";

interface ConnectionConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  type: 'postgresql' | 'mysql';
}

interface AppState {
  isConnected: boolean;
  connectionConfig: ConnectionConfig | null;
  isConnecting: boolean;
  error: string | null;
  lastConnectedAt: Date | null;
  schema: any | null;
  queryResults: QueryResult | null;
  isQuerying: boolean;
}

type AppAction =
  | { type: 'CONNECT_START' }
  | { type: 'CONNECT_SUCCESS'; payload: { config: ConnectionConfig; schema: any } }
  | { type: 'CONNECT_FAILURE'; payload: string }
  | { type: 'DISCONNECT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'QUERY_START' }
  | { type: 'QUERY_SUCCESS'; payload: QueryResult }
  | { type: 'QUERY_FAILURE'; payload: string };

const initialState: AppState = {
  isConnected: false,
  connectionConfig: null,
  isConnecting: false,
  error: null,
  lastConnectedAt: null,
  schema: null,
  queryResults: null,
  isQuerying: false
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'CONNECT_START':
      return { ...state, isConnecting: true, error: null };
    case 'CONNECT_SUCCESS':
      return {
        ...state,
        isConnected: true,
        isConnecting: false,
        connectionConfig: action.payload.config,
        schema: action.payload.schema,
        error: null,
        lastConnectedAt: new Date()
      };
    case 'CONNECT_FAILURE':
      return {
        ...state,
        isConnected: false,
        isConnecting: false,
        error: action.payload,
        connectionConfig: null,
        schema: null
      };
    case 'DISCONNECT':
      return {
        ...state,
        isConnected: false,
        connectionConfig: null,
        error: null,
        lastConnectedAt: null,
        schema: null,
        queryResults: null
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'QUERY_START':
      return { ...state, isQuerying: true, error: null };
    case 'QUERY_SUCCESS':
      return { ...state, isQuerying: false, queryResults: action.payload };
    case 'QUERY_FAILURE':
      return { ...state, isQuerying: false, error: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  connect: (config: ConnectionConfig) => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
  executeQuery: (query: string, tableName: string) => Promise<void>;
  getQueryType: (query: string) => string;
  isReadOnlyQuery: (query: string) => boolean;
  formatQuery: (query: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const connect = async (config: ConnectionConfig) => {
    dispatch({ type: 'CONNECT_START' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (!config.host || !config.database || !config.username) {
        throw new Error('Please fill in all required fields');
      }
      
      if (Math.random() < 0.1) {
        throw new Error('Connection timeout - please check your credentials');
      }
      
      dispatch({ 
        type: 'CONNECT_SUCCESS', 
        payload: { config, schema: mockSchema }
      });
    } catch (error) {
      dispatch({ 
        type: 'CONNECT_FAILURE', 
        payload: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  };

  const disconnect = () => {
    dispatch({ type: 'DISCONNECT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const executeQuery = async (query: string, tableName: string) => {
    dispatch({ type: 'QUERY_START' });
    
    try {
      const result = await queryRunner.executeQuery(query, tableName);
      dispatch({ 
        type: 'QUERY_SUCCESS', 
        payload: result
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Query execution failed';
      dispatch({ 
        type: 'QUERY_FAILURE', 
        payload: errorMessage
      });
    }
  };

  const getQueryType = (query: string) => queryRunner.getQueryType(query);
  const isReadOnlyQuery = (query: string) => queryRunner.isReadOnlyQuery(query);
  const formatQuery = (query: string) => queryRunner.formatQuery(query);

  const value: AppContextType = {
    state,
    dispatch,
    connect,
    disconnect,
    clearError,
    executeQuery,
    getQueryType,
    isReadOnlyQuery,
    formatQuery
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}