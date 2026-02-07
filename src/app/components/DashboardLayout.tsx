import { ReactNode } from 'react';
import { Moon, Sun, Download, Play, RotateCcw, Shield,  User } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  rightPanel?: ReactNode;
  onRun?: () => void;
  onReset?: () => void;
  onExport?: () => void;
  isRunning?: boolean;
  title?: string;
}

export function DashboardLayout({
  children,
  sidebar,
  rightPanel,
  onRun,
  onReset,
  onExport,
  isRunning = false,
  title = 'National Climate Policy Command Center',
}: DashboardLayoutProps) {
  const { theme, setTheme } = useTheme();

  import Clock from '../components/Clock';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* STATIC HEADER */}
      <header className="flex justify-between items-center p-4">
        <h1>Climate Policy Simulator</h1>
        <Clock /> {/* 👈 PERFECT */}
      </header>

      {/* DYNAMIC CONTENT */}
      <main className="flex-1">
        {children}
      </main>

    </div>
  );
}

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar - Government Style */}
      <header className="sticky top-0 z-50 bg-primary border-b-2 border-warning shadow-md">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Left: Official Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 rounded border border-white/20">
              <Shield className="size-8 text-warning" strokeWidth={2} />
              <div className="border-l border-white/30 pl-3">
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Official Use</div>
                <div className="text-sm text-white font-bold">{title}</div>
              </div>
            </div>
          </div>

          {/* Right: Timestamp & User Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded border border-white/20">
              <Clock className="size-4 text-white/70" />
              <span className="text-xs text-white font-mono">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-warning/90 text-primary rounded border border-warning">
              <User className="size-4" />
              <span className="text-xs font-semibold">Department Official</span>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    {theme === 'dark' ? (
                      <Sun className="size-4" />
                    ) : (
                      <Moon className="size-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle theme</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      {/* Secondary Action Bar */}
      <div className="sticky top-[73px] z-40 bg-card border-b border-border shadow-sm">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-semibold text-foreground">SYSTEM OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onReset}
                    disabled={isRunning}
                    className="gap-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    <RotateCcw className="size-4" />
                    Reset Parameters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset all parameters to defaults</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onRun}
                    disabled={isRunning}
                    className="gap-2 bg-primary hover:bg-primary/90 text-white font-semibold"
                    size="sm"
                  >
                    <Play className="size-4" />
                    {isRunning ? 'EXECUTING...' : 'RUN SIMULATION'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Execute simulation with current parameters</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    className="gap-2 border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    <Download className="size-4" />
                    Export Report
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download simulation results</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        {sidebar && (
          <aside className="w-80 border-r-2 border-border bg-card overflow-y-auto">
            <div className="p-6">{sidebar}</div>
          </aside>
        )}

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">{children}</div>
        </main>

        {/* Right Panel */}
        {rightPanel && (
          <aside className="w-80 border-l-2 border-border bg-card overflow-y-auto">
            <div className="p-6">{rightPanel}</div>
          </aside>
        )}
      </div>
    </div>
  );
}
