
'use client';

import type { App, WindowInstance } from '@/lib/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface TaskbarProps {
  windows: WindowInstance[];
  apps: App[];
  onTaskbarClick: (windowId: string) => void;
  activeWindowId: string | null;
}

export default function Taskbar({ windows, apps, onTaskbarClick, activeWindowId }: TaskbarProps) {
  const getAppIcon = (appId: string) => {
    const app = apps.find(a => a.id === appId);
    return app ? app.icon : null;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-card/80 backdrop-blur-sm border-t border-border flex items-center px-2 gap-2 z-50">
      {windows.map(win => (
        <Button
          key={win.id}
          variant="ghost"
          className={cn(
            'h-8 px-2 py-1 flex items-center gap-2 text-foreground text-sm',
            win.minimized && 'bg-transparent',
            !win.minimized && activeWindowId === win.id && 'bg-primary/50',
            !win.minimized && activeWindowId !== win.id && 'bg-secondary'
          )}
          onClick={() => onTaskbarClick(win.id)}
        >
          <div className="w-5 h-5">{getAppIcon(win.appId)}</div>
          <span className="truncate">{win.title}</span>
        </Button>
      ))}
    </div>
  );
}
