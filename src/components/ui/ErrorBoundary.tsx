import { Component, type ErrorInfo, type ReactNode } from 'react';
import { BoundaryFallback } from './BoundaryFallback';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Human name for the guarded area (e.g. a module label), read out in the recovery card. */
  scope?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches render errors and swaps in a friendly recovery card, so a crash in
 * one module never blanks the app. Mounted globally in App.tsx and once per
 * module route (via ModuleGate); "Try again" re-mounts the crashed subtree.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Stadeck: unhandled render error', error, info.componentStack);
  }

  private readonly handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return <BoundaryFallback onRetry={this.handleRetry} scope={this.props.scope} />;
    }

    return this.props.children;
  }
}
