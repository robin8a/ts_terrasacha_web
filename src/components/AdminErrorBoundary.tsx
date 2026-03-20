import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AdminErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 py-8 text-center">
          <p className="text-sm font-medium text-gray-800">Error al cargar el panel de administración</p>
          <p className="max-w-md text-xs text-gray-600">{this.state.error.message}</p>
          <a href="/" className="text-sm text-primary underline hover:no-underline">
            Volver al inicio
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default AdminErrorBoundary;
