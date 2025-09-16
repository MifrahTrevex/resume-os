
'use client';

import type { WindowInstance } from '@/lib/types';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ScrollArea } from './ui/scroll-area';

interface TaskManagerProps {
  windows: WindowInstance[];
  onClose: (windowId: string) => void;
  onFocus: (windowId: string) => void;
}

export default function TaskManager({ windows, onClose, onFocus }: TaskManagerProps) {
  const handleEndProcess = (e: React.MouseEvent, windowId: string) => {
    e.stopPropagation();
    onClose(windowId);
  };

  const handleRowClick = (windowId: string) => {
    onFocus(windowId);
  }

  return (
    <div className="h-full bg-background text-foreground font-code flex flex-col">
        <CardHeader>
            <CardTitle>Task Manager</CardTitle>
            <CardDescription>Currently running processes.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-0">
             <ScrollArea className="flex-grow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Process Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {windows.map(win => (
                            <TableRow key={win.id} onClick={() => handleRowClick(win.id)} className="cursor-pointer">
                                <TableCell>{win.title}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={(e) => handleEndProcess(e, win.id)}
                                    >
                                        End Process
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                         {windows.length === 0 && (
                             <TableRow>
                                <TableCell colSpan={2} className="text-center text-muted-foreground">
                                    No active processes.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </ScrollArea>
        </CardContent>
    </div>
  );
}

    