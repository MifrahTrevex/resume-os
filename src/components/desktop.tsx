"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import type { WindowInstance, CvContent } from '@/lib/types';
import { APPS, initialCvContent } from '@/lib/content';
import Window from './window';
import DesktopIcon from './desktop-icon';
import { handleCommand } from '@/lib/actions';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Terminal as TerminalIcon } from 'lucide-react';
import type { InterpretTerminalCommandOutput } from '@/ai/flows/terminal-command-interpretation';

type TerminalLine = {
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
};

function Terminal({ openApp }: { openApp: (appId: 'about' | 'resume' | 'projects' | 'contact') => void }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: `Dickens Okoth Otieno's Desktop v1.0` },
    { type: 'system', content: `Welcome. Type 'help' for a list of commands.` },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [lines]);

  const processAICommand = useCallback(async (command: string) => {
    const result: InterpretTerminalCommandOutput = await handleCommand(command);
    
    let outputLines: TerminalLine[] = [{ type: 'output', content: result.reason }];

    switch (result.action) {
      case 'OPEN_RESUME':
        openApp('resume');
        break;
      case 'SHOW_PROJECTS':
        openApp('projects');
        break;
      case 'OPEN_LINK':
        if (result.link) {
          window.open(result.link, '_blank');
          outputLines.push({ type: 'system', content: `Opening ${result.link}...` });
        } else {
          outputLines.push({ type: 'error', content: 'AI suggested a link, but none was provided.' });
        }
        break;
      case 'INVALID':
      default:
        // The reason is already pushed
        break;
    }
    setLines(prev => [...prev, ...outputLines]);
  }, [openApp]);
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    const newLines: TerminalLine[] = [{ type: 'input', content: command }];
    setLines(prev => [...prev, ...newLines]);
    setInput('');
    setIsProcessing(true);

    if (command.toLowerCase() === 'help') {
        setLines(prev => [...prev, { type: 'output', content: `Available commands:
- 'open resume' or 'show cv'
- 'show projects' or 'portfolio'
- 'open github' or 'linkedin'
- 'clear' - to clear the terminal` }]);
    } else if (command.toLowerCase() === 'clear') {
        setLines([]);
    } else {
        await processAICommand(command);
    }
    setIsProcessing(false);
  };

  return (
    <div className="bg-black text-foreground font-code h-full flex flex-col p-2 text-sm">
      <div className="flex-grow overflow-y-auto">
        {lines.map((line, index) => (
          <div key={index} className="flex gap-2">
            {line.type === 'input' && <span className="text-accent">$</span>}
            <p className={line.type === 'error' ? 'text-destructive' : ''}>{line.content}</p>
          </div>
        ))}
        <div ref={endOfTerminalRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
        <span className="text-accent">$</span>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground font-code flex-grow"
          placeholder="Type a command..."
          autoFocus
          disabled={isProcessing}
        />
      </form>
    </div>
  );
}


export default function Desktop() {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [cvContent, setCvContent] = useState<CvContent>(initialCvContent);
  const zIndexCounter = useRef(10);

  const handleContentUpdate = (newContent: Partial<CvContent>) => {
    setCvContent(prev => ({ ...prev, ...newContent }));
  }

  const openApp = useCallback((appId: 'about' | 'resume' | 'projects' | 'terminal' | 'contact') => {
    // Check if a window for this app is already open
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    const newZIndex = zIndexCounter.current + 1;
    zIndexCounter.current = newZIndex;
    const newWindow: WindowInstance = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: app.name,
      position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
      size: { width: 640, height: 480 },
      zIndex: newZIndex,
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
  }, [windows]);

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };

  const focusWindow = (id: string) => {
    if (id === activeWindow) return;

    const newZIndex = zIndexCounter.current + 1;
    zIndexCounter.current = newZIndex;
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: newZIndex } : w))
    );
    setActiveWindow(id);
  };
  
  const renderWindowContent = (appId: WindowInstance['appId']) => {
    const app = APPS.find(a => a.id === appId);
    if (!app) return null;

    if (appId === 'terminal') {
      return <Terminal openApp={openApp} />;
    }

    if (appId === 'about') {
        return <app.component content={cvContent} onSave={(newAbout: string) => handleContentUpdate({ about: newAbout })} />;
    }
    
    if (appId === 'resume') {
        return <app.component content={cvContent} onSave={(newResume: CvContent['resume']) => handleContentUpdate({ resume: newResume })} />;
    }
    
    return <app.component content={cvContent} />;
  };

  return (
    <div className="relative w-full h-full p-4">
      <div className="grid grid-cols-1 justify-start gap-4">
        {APPS.map(app => (
          <DesktopIcon
            key={app.id}
            name={app.name}
            icon={app.icon}
            onClick={() => openApp(app.id)}
          />
        ))}
      </div>

      {windows.map(win => (
        <Window
          key={win.id}
          title={win.title}
          zIndex={win.zIndex}
          initialSize={win.size}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
        >
          {renderWindowContent(win.appId)}
        </Window>
      ))}
    </div>
  );
}
