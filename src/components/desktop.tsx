
"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import type { WindowInstance, CvContent, Project } from '@/lib/types';
import { APPS, initialCvContent } from '@/lib/content';
import Window from './window';
import DesktopIcon from './desktop-icon';
import { handleInterview } from '@/lib/actions';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { InterviewOutput } from '@/ai/flows/interview-flow';

type TerminalLine = {
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
};

type Message = {
    role: 'user' | 'model';
    content: string;
};

function Terminal({ openApp, cvContent }: { openApp: (appId: 'about' | 'resume' | 'projects' | 'contact') => void; cvContent: CvContent }) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'system', content: `Dickens Okoth Otieno's Desktop v1.0` },
    { type: 'system', content: `Type 'start' to begin your interview.` },
  ]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [lines]);

  const startInterview = useCallback(async () => {
    setIsProcessing(true);
    const result: InterviewOutput = await handleInterview({
        cvContent: JSON.stringify(cvContent),
        history: [],
    });
    const assistantMessage: Message = { role: 'model', content: result.response };
    setHistory([assistantMessage]);
    setLines(prev => {
        const newLines = [...prev];
        const typingIndex = newLines.findLastIndex(line => line.content === "AI is typing...");
        if (typingIndex !== -1) {
            newLines[typingIndex] = { type: 'output', content: result.response };
        } else {
            newLines.push({ type: 'output', content: result.response });
        }
        return newLines;
    });
    setIsProcessing(false);
  }, [cvContent]);
  

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const command = input.trim();
    
    if (command.toLowerCase() === 'start' && history.length === 0) {
      setLines(prev => [...prev, { type: 'input', content: command }, { type: 'output', content: "AI is typing..." }]);
      setInput('');
      await startInterview();
      return;
    }

    if (history.length === 0) return;

    const userMessage: Message = { role: 'user', content: command };
    
    setLines(prev => [...prev, { type: 'input', content: command }, { type: 'output', content: "AI is typing..." }]);
    setInput('');
    setIsProcessing(true);

    const newHistory = [...history, userMessage];
    setHistory(newHistory);
    
    const result = await handleInterview({
        cvContent: JSON.stringify(cvContent),
        history: newHistory,
    });
    
    const assistantMessage: Message = { role: 'model', content: result.response };
    setHistory(prev => [...prev, assistantMessage]);

    setLines(prev => {
        const newLines = [...prev];
        const typingIndex = newLines.findLastIndex(line => line.content === "AI is typing...");
        if (typingIndex !== -1) {
            newLines[typingIndex] = { type: 'output', content: result.response };
        } else {
             newLines.push({ type: 'output', content: result.response });
        }
        return newLines;
    });

    setIsProcessing(false);
  };

  return (
    <div className="bg-black text-foreground font-code h-full flex flex-col p-2 text-sm">
      <div className="flex-grow overflow-y-auto">
        {lines.map((line, index) => (
          <div key={index} className="flex gap-2">
            {line.type === 'input' && <span className="text-primary">$</span>}
            <p className={`${line.type === 'error' ? 'text-destructive' : ''} ${line.content === 'AI is typing...' ? 'italic text-muted-foreground' : ''}`}>
              {line.content}
            </p>
          </div>
        ))}
        <div ref={endOfTerminalRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
        <span className="text-primary">$</span>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground font-code flex-grow"
          placeholder="Type your response..."
          autoFocus
          disabled={isProcessing}
        />
      </form>
    </div>
  );
}


export default function Desktop() {
  const { isAuthenticated, logout } = useAuth();
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
      return <Terminal openApp={openApp} cvContent={cvContent} />;
    }

    if (appId === 'about') {
        return <app.component content={cvContent} onSave={(newAbout: string) => handleContentUpdate({ about: newAbout })} />;
    }
    
    if (appId === 'resume') {
        return <app.component content={cvContent} onSave={(newResume: CvContent['resume']) => handleContentUpdate({ resume: newResume })} />;
    }

    if (appId === 'projects') {
        return <app.component content={cvContent} onSave={(newProjects: Project[]) => handleContentUpdate({ projects: newProjects })} />;
    }
    
    return <app.component content={cvContent} />;
  };

  return (
    <div className="relative w-full h-full p-4">
       {isAuthenticated && (
         <div className="absolute top-4 right-4 z-[100] flex items-center gap-4">
           <div className="flex items-center gap-2 text-sm bg-card/70 p-2 rounded-md">
                <User />
                <span>Admin</span>
           </div>
           <Button variant="destructive" onClick={logout}>
             <LogOut className="mr-2 h-4 w-4" /> Logout
           </Button>
         </div>
       )}
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
