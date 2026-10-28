import { AlertTriangle } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./Button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Erro não tratado na interface:", error, info);
  }

  override render() {
    if (this.state.error) {
      return (
        <div className="flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <AlertTriangle size={22} />
          </div>
          <p className="text-sm font-medium text-ink">Algo deu errado ao carregar esta tela.</p>
          <p className="max-w-sm text-sm text-ink-subtle">{this.state.error.message}</p>
          <Button onClick={() => this.setState({ error: null })}>Tentar novamente</Button>
        </div>
      );
    }
    return this.props.children;
  }
}
