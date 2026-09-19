import { Component, type ErrorInfo, type ReactNode } from 'react';

interface BlockBoundaryProps {
  /** Names the block in the console warning. */
  label: string;
  /** Rendered instead of the block when it fails. */
  fallback: ReactNode;
  children: ReactNode;
}

// One block failing — a chunk that would not download after a deploy, an
// interactive piece that threw — must not unmount the whole article.
export default class BlockBoundary extends Component<BlockBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(`[journal] ${this.props.label} failed`, error, info.componentStack);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
