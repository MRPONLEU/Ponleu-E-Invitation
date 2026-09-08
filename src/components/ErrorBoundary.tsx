import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('e_invitation_templates_v4');
      localStorage.removeItem('e_invitation_couples_v4');
      localStorage.removeItem('e_invitation_music_v1');
    } catch {}
    window.location.hash = '';
    window.location.search = '';
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-6 font-battambang text-[#2D2D2D]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#EAE6E1] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-normal text-gray-900 font-khmer-title">
                សូមអភ័យទោស មានបញ្ហាកើតឡើង
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                កម្មវិធីបានជួបប្រទះបញ្ហាបច្ចេកទេស។ លោកអ្នកអាចចុចប៊ូតុងខាងក្រោមដើម្បីកំណត់ទិន្នន័យឡើងវិញ និងផ្ទុកទំព័រឡើងវិញ។
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-left text-[11px] text-rose-800 font-mono overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B8962D] text-white rounded-xl text-xs font-normal hover:brightness-105 shadow-sm transition-transform active:scale-95"
              >
                ផ្ទុកទំព័រឡើងវិញ (Reload Page)
              </button>
              <button
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-normal flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>កំណត់ទិន្នន័យដើមឡើងវិញ (Reset App Cache)</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
