import { Component } from "react";

/**
 * Catches render-time UI failures and shows a stable fallback instead of a blank screen.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("React error boundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 text-center">
            <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-2">
              Something went wrong
            </p>
            <h1 className="text-2xl font-semibold text-gray-900 mb-3">
              The page could not be rendered
            </h1>
            <p className="text-gray-600 mb-6">
              Please reload the page. If the problem continues, try again later.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex justify-center rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
