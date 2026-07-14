import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ErrorState';

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
      const scope = this.props.scope ?? 'This part of Stadeck';
      return (
        <div className="flex min-h-[320px] w-full items-center justify-center px-gutter py-section">
          <div className="w-full max-w-md">
            <ErrorState
              message={`${scope} ran into an unexpected error. The rest of the app is unaffected — try again, or switch to another module from the sidebar.`}
              onRetry={this.handleRetry}
              title="Something went wrong"
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
