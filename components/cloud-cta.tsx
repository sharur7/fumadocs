'use client';

import { Rocket, ArrowRight, Zap, Cloud } from 'lucide-react';

interface CloudCTAProps {
  variant?: 'inline' | 'banner' | 'card';
  showBenefits?: boolean;
}

export function CloudCTA({ variant = 'card', showBenefits = false }: CloudCTAProps) {
  if (variant === 'inline') {
    return (
      <div className="my-8 p-6 bg-gradient-to-r from-signalBlue/10 via-coolMint/10 to-signalBlue/10 rounded-xl border border-signalBlue/30 hover:border-signalBlue/50 transition-colors">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Cloud className="w-8 h-8 text-signalBlue" />
            <div>
              <h3 className="font-bold text-lg text-text-primary font-heading">Deploy to NitroCloud</h3>
              <p className="text-sm text-text-secondary font-sans">Skip the setup. Deploy in 60 seconds.</p>
            </div>
          </div>
          <a
            href="https://cloud.nitrostack.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-signalBlue to-coolMint text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-low hover:shadow-medium font-sans"
          >
            <Rocket className="w-4 h-4" />
            Try Free
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className="my-12 relative overflow-hidden rounded-2xl shadow-high">
        {/* Background effects */}
        <div className="absolute inset-0 bg-background-surface z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-signalBlue/5 via-coolMint/5 to-signalBlue/5 blur-3xl z-0"></div>

        <div className="relative z-10 text-center py-12 px-6 border border-border-panel rounded-2xl bg-background-surface/50 backdrop-blur-sm">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-signalBlue/10 border border-signalBlue/20 rounded-pill text-signalBlue text-sm font-bold mb-4 animate-glow">
            <Zap className="w-4 h-4" />
            Production-Ready in Minutes
          </div>
          <h3 className="text-3xl font-bold mb-3 font-heading text-text-primary">Ready to Deploy?</h3>
          <p className="text-text-secondary mb-6 max-w-xl mx-auto font-sans">
            Stop worrying about infrastructure. NitroCloud handles scaling, monitoring, and deployment automatically.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://cloud.nitrostack.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-signalBlue to-coolMint text-white font-bold rounded-xl shadow-medium hover:shadow-high transition-all hover:-translate-y-1 hover:opacity-90 font-sans"
            >
              <Rocket className="w-5 h-5" />
              Try Cloud for Free
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
          {showBenefits && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-text-muted font-sans">
              <div className="flex items-center gap-2">
                <span className="text-coolMint">✓</span>
                <span>Free tier</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-coolMint">✓</span>
                <span>Auto-scaling</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-coolMint">✓</span>
                <span>60s deployment</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="my-8 p-8 bg-background-surface rounded-2xl border border-border-panel relative overflow-hidden shadow-medium group hover:border-signalBlue/50 transition-all duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-signalBlue/5 rounded-full blur-3xl group-hover:bg-signalBlue/10 transition-colors"></div>
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-signalBlue/10 rounded-lg">
            <Cloud className="w-6 h-6 text-signalBlue" />
          </div>
          <div>
            <h3 className="font-bold text-xl font-heading text-text-primary">Deploy to NitroCloud</h3>
            <p className="text-sm text-text-secondary font-sans">Production-ready in under 60 seconds</p>
          </div>
        </div>
        <p className="text-text-muted mb-6 font-sans">
          Skip the DevOps complexity. Deploy your MCP server to the cloud with automatic scaling,
          monitoring, and zero-downtime updates.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://cloud.nitrostack.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-signalBlue to-coolMint text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-low font-sans"
          >
            <Rocket className="w-4 h-4" />
            Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="https://cloud.nitrostack.ai/pricing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-border-panel text-text-primary font-semibold rounded-lg hover:border-signalBlue hover:text-signalBlue transition-all font-sans bg-background-base/50"
          >
            View Pricing
          </a>
        </div>
        {showBenefits && (
          <div className="mt-6 pt-6 border-t border-border-soft grid grid-cols-2 gap-4 text-sm font-sans">
            <div className="flex items-start gap-2">
              <span className="text-coolMint mt-0.5">✓</span>
              <span className="text-text-muted">Free tier with generous limits</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-coolMint mt-0.5">✓</span>
              <span className="text-text-muted">Automatic SSL certificates</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-coolMint mt-0.5">✓</span>
              <span className="text-text-muted">Global CDN & edge deployment</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-coolMint mt-0.5">✓</span>
              <span className="text-text-muted">Built-in monitoring & alerts</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

