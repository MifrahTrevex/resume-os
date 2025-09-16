
'use client';

import { useState, useEffect, useRef } from 'react';
import type { App, WindowInstance } from '@/lib/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Power, RefreshCcw, Search, Wifi, Volume2, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';


const BrokenGlassesIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="start-logo">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <g style={{ filter: 'url(#glow)' }}>
            <circle cx="7" cy="12" r="5" stroke="hsl(var(--primary))" strokeWidth="1.5"/>
            <circle cx="17" cy="12" r="5" stroke="hsl(var(--foreground))" strokeWidth="1.5"/>
            <path d="M12 12L17 12" stroke="hsl(var(--foreground))" strokeWidth="1"/>
            <path d="M17 12L15 10" stroke="hsl(var(--primary))" strokeWidth="1"/>
            <path d="M17 12L20 14" stroke="hsl(var(--primary))" strokeWidth="1"/>
            <path d="M17 12L19 9" stroke="hsl(var(--primary))" strokeWidth="1"/>
            <path d="M17 12L15.5 15" stroke="hsl(var(--primary))" strokeWidth="1"/>
            <path d="M17 12L19.5 14.5" stroke="hsl(var(--primary))" strokeWidth="1"/>
        </g>
    </svg>
);


const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-xs font-medium text-foreground text-center">
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div>{time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' })}</div>
        </div>
    );
};

interface StartMenuProps {
    apps: App[];
    onAppClick: (appId: string) => void;
    onShutdown: () => void;
    onRestart: () => void;
    onClose: () => void;
}

const StartMenu = ({ apps, onAppClick, onShutdown, onRestart, onClose }: StartMenuProps) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const desktopApps = apps.filter(app => !['game-manager'].includes(app.id) && !app.isFolderContent);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div ref={menuRef} className="absolute bottom-11 left-1 w-64 bg-card/90 backdrop-blur-md border border-border rounded-md shadow-lg p-2 z-50">
            <h3 className="text-lg font-bold px-2 mb-2">Applications</h3>
            <div className="flex flex-col gap-1">
                {desktopApps.map(app => (
                    <Button
                        key={app.id}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                            onAppClick(app.id);
                            onClose();
                        }}
                    >
                        <div className="w-6 h-6 mr-2">{app.icon}</div>
                        {app.name}
                    </Button>
                ))}
            </div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-end gap-2">
                 <Button variant="ghost" size="icon" title="Restart" onClick={onRestart}><RefreshCcw /></Button>
                 <Button variant="destructive" size="icon" title="Shut Down" onClick={onShutdown}><Power /></Button>
            </div>
        </div>
    );
};


interface TaskbarProps {
  windows: WindowInstance[];
  apps: App[];
  onTaskbarClick: (windowId: string) => void;
  onWindowClose: (windowId: string) => void;
  activeWindowId: string | null;
  onAppLaunch: (appId: string) => void;
  onShutdown: () => void;
  onRestart: () => void;
  onPowerButtonClick: () => void;
}

export default function Taskbar({ windows, apps, onTaskbarClick, onWindowClose, activeWindowId, onAppLaunch, onShutdown, onRestart, onPowerButtonClick }: TaskbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const getAppIcon = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app ? app.icon : null;
  };

  const filteredApps = apps.filter(app => 
    !app.isFolderContent && app.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (filteredApps.length > 0) {
          onAppLaunch(filteredApps[0].id);
          setSearchQuery('');
          setIsSearchOpen(false);
          (e.target as HTMLFormElement).querySelector('input')?.blur();
      }
  }
  
  const handleAppLaunch = (appId: string) => {
      onAppLaunch(appId);
      setSearchQuery('');
      setIsSearchOpen(false);
  }

  return (
    <>
      <style jsx>{`
        .start-logo {
            animation: pulse-glow 3s infinite ease-in-out;
        }

        @keyframes pulse-glow {
            0%, 100% {
                filter: url(#glow) drop-shadow(0 0 2px hsl(var(--primary)));
                transform: scale(1);
            }
            50% {
                filter: url(#glow) drop-shadow(0 0 5px hsl(var(--primary)));
                transform: scale(1.1);
            }
        }
      `}</style>
      {isMenuOpen && (
            <StartMenu
                apps={apps}
                onAppClick={onAppLaunch}
                onShutdown={onShutdown}
                onRestart={onRestart}
                onClose={() => setIsMenuOpen(false)}
            />
        )}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-card/80 backdrop-blur-sm border-t border-border flex items-center px-2 gap-2 z-50">
        <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMenuOpen(prev => !prev)}
        >
            <BrokenGlassesIcon />
        </Button>

        <Popover open={isSearchOpen && searchQuery.length > 0} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
                <form onSubmit={handleSearchSubmit} className="relative flex-shrink-0 w-48">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search..."
                        className="h-8 pl-8 bg-background/50"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearchOpen(true)}
                        onBlur={() => {
                            // Delay hiding so a click on a result can register
                            setTimeout(() => {
                                if (!document.activeElement?.closest('[data-radix-popper-content-wrapper]')) {
                                    setIsSearchOpen(false)
                                }
                            }, 150)
                        }}
                    />
                </form>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-1 mb-2" onOpenAutoFocus={(e) => e.preventDefault()}>
                {filteredApps.length > 0 ? (
                    filteredApps.map(app => (
                        <Button
                            key={app.id}
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => handleAppLaunch(app.id)}
                        >
                            <div className="w-5 h-5 mr-2">{app.icon}</div>
                            <span className="truncate">{app.name}</span>
                        </Button>
                    ))
                ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">No results</div>
                )}
            </PopoverContent>
        </Popover>
        
        <div className="flex-grow flex items-center gap-2">
            {windows.map(win => (
                <div key={win.id} className="group relative">
                    <Button
                        variant="ghost"
                        className={cn(
                            'h-8 px-2 py-1 flex items-center gap-2 text-foreground text-sm max-w-36',
                            win.minimized && 'bg-transparent',
                            !win.minimized && activeWindowId === win.id && 'bg-primary/50',
                            !win.minimized && activeWindowId !== win.id && 'bg-secondary'
                        )}
                        onClick={() => onTaskbarClick(win.id)}
                    >
                        <div className="w-5 h-5 flex-shrink-0">{getAppIcon(win.appId)}</div>
                        <span className="truncate">{win.title}</span>
                    </Button>
                     <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onWindowClose(win.id);
                        }}
                        className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label={`Close ${win.title}`}
                    >
                        <X size={10} />
                    </button>
                </div>
            ))}
        </div>
        
        <div className="flex items-center gap-3 pr-2">
            <Wifi size={16} />
            <Volume2 size={16} />
            <Clock />
        </div>
      </div>
    </>
  );
}
