import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Sanitize and log diagnostic details without leaking sensitive credentials
    console.error('ForeFight ErrorBoundary caught an unhandled component error:', {
      name: error.name,
      message: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 1000),
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  handleNavigateHome = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#070a11] text-gray-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0c121e]/90 border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold">
              ForeFight Era Platform Recovery
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
              Application Encountered an Issue
            </h1>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              An isolated component failure occurred. The system has contained the fault to prevent data loss. You can reload the view or return to the main dashboard.
            </p>

            {this.state.error && (
              <div className="bg-[#070a11] border border-white/[0.08] rounded-xl p-3.5 mb-6 text-left">
                <p className="text-[11px] font-mono text-gray-500 uppercase tracking-wider mb-1">Diagnostic Details</p>
                <p className="text-xs font-mono text-amber-300/90 break-words line-clamp-2">
                  {this.state.error.message || 'Unknown runtime error'}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reload Application
              </button>
              <button
                onClick={this.handleNavigateHome}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-gray-200 hover:text-white font-medium text-sm transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
