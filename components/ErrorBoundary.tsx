import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#cbd5e1', fontFamily: 'monospace', backgroundColor: '#020617', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '2rem', color: '#f87171' }}>Something went wrong.</h1>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>An unexpected error occurred, which is causing the blank screen.</p>
          <p style={{ marginTop: '0.5rem' }}>Please check the browser's developer console (F12) for more details.</p>
          
          {this.state.error && (
            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#1e293b', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', color: '#facc15' }}>Error Details:</h2>
              <pre style={{ marginTop: '0.5rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {this.state.error.toString()}
              </pre>
              {this.state.errorInfo && (
                <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all', opacity: 0.7 }}>
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>
          )}
           <button 
             onClick={() => window.location.reload()}
             style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#0e7490', color: 'white', cursor: 'pointer', fontSize: '1rem' }}
           >
             Reload Page
           </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
