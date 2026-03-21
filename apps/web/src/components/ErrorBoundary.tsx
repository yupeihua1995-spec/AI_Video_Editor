import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
    if (this.props.onError) {
        this.props.onError(error, errorInfo);
    }
  }

  // Reset the error boundary state if the children prop changes (meaning new code was injected)
  public componentDidUpdate(prevProps: Props) {
    if (prevProps.children !== this.props.children) {
      this.setState({ hasError: false });
    }
  }

  // Adding a method to forcefully clear the error state
  public resetError = () => {
     this.setState({ hasError: false });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
