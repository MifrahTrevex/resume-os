
'use client';

import { useState, useEffect, useRef } from 'react';
import type { App, WindowInstance } from '@/lib/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Power, RefreshCcw, Search } from 'lucide-react';

const BrokenLensIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="8" stroke="hsl(var(--foreground))" strokeWidth="2"/>
        <path d="M12 4V12L17.6 14" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round"/>
        <path d="M19 9L5 15" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-sm font-medium text-foreground">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
    const desktopApps = apps.filter(app => !['game-manager'].includes(app.id));

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
  activeWindowId: string | null;
  onAppLaunch: (appId: string) => void;
  onShutdown: () => void;
  onRestart: () => void;
}

export default function Taskbar({ windows, apps, onTaskbarClick, activeWindowId, onAppLaunch, onShutdown, onRestart }: TaskbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const getAppIcon = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app ? app.icon : null;
  };

  return (
    <>
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
            <BrokenLensIcon />
        </Button>
        <div className="relative flex-shrink-0 w-48">
             <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search..."
                className="h-8 pl-8 bg-background/50"
            />
        </div>
        
        <div className="flex-grow flex items-center gap-2">
            {windows.map(win => (
                <Button
                    key={win.id}
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
            ))}
        </div>
        
        <div className="pr-2">
            <Clock />
        </div>
      </div>
    </>
  );
}
