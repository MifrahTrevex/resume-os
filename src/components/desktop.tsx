
"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import type { WindowInstance, CvContent, Project, App } from '@/lib/types';
import { initialGameApps, initialCvContent, ALL_APPS } from '@/lib/content';
import Window from './window';
import DesktopIcon from './desktop-icon';
import Taskbar from './taskbar';
import { handleInterview, handleCommand } from '@/lib/actions';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { LogOut, User, Power, RefreshCcw, XCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import type { InterviewOutput } from '@/ai/flows/interview-flow';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type TerminalLine = {
  type: 'input' | 'output' | 'system' | 'error';
  content: string;
};

type Message = {
    role: 'user' | 'model';
    content: string;
};

type GameMode = 'interview' | 'firewall-defender' | 'tic-tac-toe' | 'css-invaders' | 'guess-the-number' | 'netrun' | 'mainframe-breach';
type PowerState = 'running' | 'confirming' | 'shutting_down' | 'restarting' | 'off';

const firewallRules = [
    "Rule 1: Deny all traffic from IP 192.168.1.100 (Known malicious actor).",
    "Rule 2: Deny all traffic on Port 23 (Telnet - insecure).",
    "Rule 3: Allow all other traffic.",
];

const packetTypes = {
    SAFE: 'SAFE',
    MALICIOUS_IP: 'MALICIOUS_IP',
    MALICIOUS_PORT: 'MALICIOUS_PORT',
} as const;

type PacketType = typeof packetTypes[keyof typeof packetTypes];

type Packet = {
    sourceIp: string;
    port: number;
    type: PacketType;
    isMalicious: boolean;
};

function generatePacket(): Packet {
    const packetTypeKeys = Object.keys(packetTypes) as (keyof typeof packetTypes)[];
    const randomType = packetTypeKeys[Math.floor(Math.random() * packetTypeKeys.length)];

    let sourceIp = `192.168.1.${Math.floor(Math.random() * 254) + 1}`;
    let port = Math.floor(Math.random() * 1000) + 1;
    let isMalicious = false;

    switch(randomType) {
        case 'MALICIOUS_IP':
            sourceIp = '192.168.1.100';
            isMalicious = true;
            break;
        case 'MALICIOUS_PORT':
            port = 23;
            isMalicious = true;
            break;
        case 'SAFE':
             // Ensure safe packets don't accidentally match malicious rules
            if (sourceIp === '192.168.1.100') sourceIp = '192.168.1.101';
            if (port === 23) port = 24;
            break;
    }

    return { sourceIp, port, type: randomType, isMalicious };
}

// --- NetRun Game Types and Logic ---
const NODE_TYPES = ['─', '│', '┌', '┐', '└', '┘'] as const;
type NodeType = typeof NODE_TYPES[number];
type Node = { type: NodeType, fixed: boolean };
type Grid = (Node | null)[][];
const GRID_SIZE = 6;
// --- End NetRun Game Types ---

// --- Mainframe Breach Game State ---
type MainframeGameState = {
    stage: 'find_ip' | 'find_vulnerability' | 'brute_force' | 'ssh_login' | 'get_flag' | 'won';
    ip?: string;
    vulnerability?: string;
    password?: string;
    loggedIn: boolean;
};
// --- End Mainframe Breach Game State ---

function Terminal({ openApp, cvContent, initialCommand }: { openApp: (appId: string) => void; cvContent: CvContent, initialCommand?: string }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const [initialMessageDisplayed, setInitialMessageDisplayed] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('interview');
  
  // Firewall Defender State
  const [score, setScore] = useState(0);
  const [currentPacket, setCurrentPacket] = useState<Packet | null>(null);

  // Tic-Tac-Toe State
  const [board, setBoard] = useState<( 'X' | 'O' | null)[]>(Array(9).fill(null));

  // Guess the Number State
  const [secretNumber, setSecretNumber] = useState(0);
  const [guesses, setGuesses] = useState(0);

  // NetRun State
  const [netRunGrid, setNetRunGrid] = useState<Grid | null>(null);
  const [startPos, setStartPos] = useState({ r: 0, c: 0 });
  const [endPos, setEndPos] = useState({ r: 0, c: 0 });

  // Mainframe Breach State
  const [mainframeState, setMainframeState] = useState<MainframeGameState | null>(null);
  
  const scrollToBottom = () => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const processCommand = useCallback(async (command: string) => {
    const lowerCaseCommand = command.trim().toLowerCase();
    if (!lowerCaseCommand) return;

    setLines(prev => [...prev, { type: 'input', content: lowerCaseCommand }]);
    setInput('');
    setIsProcessing(true);
    
    // Game logic takes precedence
    if (gameMode !== 'interview') {
        if (lowerCaseCommand === 'exit') {
            exitGame();
            setIsProcessing(false);
            return;
        }

        if (gameMode === 'firewall-defender') {
            if (lowerCaseCommand === 'allow' || lowerCaseCommand === 'deny') {
                handleFirewallGuess(lowerCaseCommand);
            } else {
                setLines(prev => [...prev, { type: 'error', content: `Unknown command in game mode. Type 'allow', 'deny', or 'exit'.` }]);
            }
        } else if (gameMode === 'tic-tac-toe') {
            const move = parseInt(lowerCaseCommand, 10);
            if (!isNaN(move)) {
                handleTicTacToeMove(move);
            } else {
                setLines(prev => [...prev, { type: 'error', content: `Unknown command. Enter a number (1-9) or 'exit'.` }]);
            }
        } else if (gameMode === 'guess-the-number') {
            handleGuess(lowerCaseCommand);
        } else if (gameMode === 'netrun') {
            handleNetRunMove(lowerCaseCommand);
        } else if (gameMode === 'mainframe-breach') {
            handleMainframeCommand(lowerCaseCommand);
        }
        
        setIsProcessing(false);
        return;
    }
    
    // Command parsing for starting games or AI interpretation
    if (lowerCaseCommand.startsWith('play ')) {
        const game = lowerCaseCommand.split(' ')[1];
        if (initialGameApps.some(g => g.id.startsWith(game) && g.isTerminal)) {
             if (game === 'firewall-defender') startFirewallGame();
             else if (game === 'tic-tac-toe') startTicTacToe();
             else if (game === 'guess-the-number') startGuessTheNumber();
             else if (game === 'netrun') startNetRun();
             else if (game === 'mainframe-breach') startMainframeBreach();
        } else {
             setLines(prev => [...prev, { type: 'error', content: `Unknown or inactive game: ${game}` }]);
        }
    } else {
      // AI Command Interpretation for non-game commands
      const result = await handleCommand(lowerCaseCommand);
      setLines(prev => [...prev, { type: 'system', content: `AI > ${result.reason}` }]);
      
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
              }
              break;
          case 'SHOW_HELP':
                setLines(prev => [
                    ...prev,
                    { type: 'output', content: 'Available Commands:' },
                    { type: 'output', content: '  - "open resume"      => Opens the resume file.' },
                    { type: 'output', content: '  - "show projects"      => Opens the projects folder.' },
                    { type: 'output', content: '  - "open github"        => Opens GitHub profile in a new tab.' },
                    { type: 'output', content: '  - "open linkedin"      => Opens LinkedIn profile in a new tab.' },
                    { type: 'output', content: '  - "play [game_name]" => Starts a game.' },
                    { type: 'output', content: '      Games: firewall-defender, tic-tac-toe, guess-the-number, netrun, mainframe-breach' },
                    { type: 'output', content: '  - "help"               => Shows this help message.' },
                ]);
                break;
          case 'INVALID':
              // The reason is already displayed
              break;
          default:
              setLines(prev => [...prev, { type: 'error', content: `Unknown action: ${result.action}` }]);
      }
    }
    
    setIsProcessing(false);
  }, [gameMode, openApp, currentPacket, score, board, secretNumber, guesses, netRunGrid, startPos, endPos, mainframeState]);
  
  useEffect(() => {
    if (!initialMessageDisplayed) {
      setLines([
        { type: 'system', content: `Dickens Okoth Otieno's Desktop v1.0` },
        { type: 'system', content: `Type 'help' to see available commands.` },
      ]);
      setInitialMessageDisplayed(true);
      if (initialCommand) {
          processCommand(initialCommand);
      }
    }
  }, [initialMessageDisplayed, initialCommand, processCommand]);


  useEffect(scrollToBottom, [lines]);
  
  const exitGame = () => {
      setGameMode('interview');
      setCurrentPacket(null);
      setBoard(Array(9).fill(null));
      setNetRunGrid(null);
      setMainframeState(null);
      setHistory([]);
      setLines(prev => [
          ...prev,
          { type: 'system', content: 'Exited game. Returning to command mode.' },
          { type: 'system', content: `Type 'help' to see available commands.` }
      ]);
  }

  // --- Firewall Defender Logic ---
  const startFirewallGame = () => {
      setGameMode('firewall-defender');
      setScore(0);
      setLines(prev => [
          ...prev,
          { type: 'system', content: 'Starting Firewall Defender...' },
          { type: 'system', content: 'Objective: Analyze incoming packets and decide whether to `allow` or `deny` them based on the rules.' },
          { type: 'system', content: '--- FIREWALL RULES ---' },
          ...firewallRules.map(rule => ({ type: 'system', content: rule })),
          { type: 'system', content: '---' },
          { type: 'system', content: `Type 'allow' or 'deny'. Type 'exit' to quit.` },
      ]);
      askNextPacket();
  }

  const askNextPacket = () => {
      const newPacket = generatePacket();
      setCurrentPacket(newPacket);
      setLines(prev => [
          ...prev,
          { type: 'system', content: '--- New Incoming Packet ---' },
          { type: 'output', content: `Source IP: ${newPacket.sourceIp}` },
          { type: 'output', content: `Port: ${newPacket.port}` }
      ]);
  }

  const handleFirewallGuess = (guess: 'allow' | 'deny') => {
      if (!currentPacket) return;

      const isCorrect = (guess === 'allow' && !currentPacket.isMalicious) || (guess === 'deny' && currentPacket.isMalicious);
      
      if (isCorrect) {
          const newScore = score + 1;
          setScore(newScore);
          setLines(prev => [
              ...prev,
              { type: 'system', content: `Correct! Packet handled. Your score is now ${newScore}.` }
          ]);
          askNextPacket();
      } else {
          setLines(prev => [
              ...prev,
              { type: 'error', content: `Incorrect! Malicious packet breached the firewall!` },
              { type: 'error', content: `--- GAME OVER ---` },
              { type: 'error', content: `Final Score: ${score}` },
          ]);
          setTimeout(exitGame, 1000);
      }
  }

  // --- Tic-Tac-Toe Logic ---
  const startTicTacToe = () => {
    setGameMode('tic-tac-toe');
    setBoard(Array(9).fill(null));
    setLines(prev => [
      ...prev,
      { type: 'system', content: 'Starting Tic-Tac-Toe...' },
      { type: 'system', content: 'You are X. The computer is O.' },
      { type: 'system', content: 'Enter a number from 1 to 9 to make your move.' },
      { type: 'system', content: "Type 'exit' to quit." },
    ]);
    displayTicTacToeBoard(Array(9).fill(null));
  };

  const displayTicTacToeBoard = (currentBoard: ( 'X' | 'O' | null)[]) => {
    const boardStr = [0, 1, 2].map(row => 
        [0, 1, 2].map(col => {
            const i = row * 3 + col;
            return currentBoard[i] || (i + 1);
        }).join(' | ')
    ).join('\n--+---+--\n');

    setLines(prev => [...prev, { type: 'output', content: `\n${boardStr}\n` }]);
  };

  const checkTicTacToeWinner = (currentBoard: ( 'X' | 'O' | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    return currentBoard.every(cell => cell) ? 'draw' : null;
  };

  const handleTicTacToeMove = (move: number) => {
    if (move < 1 || move > 9 || board[move - 1]) {
      setLines(prev => [...prev, { type: 'error', content: 'Invalid move. Pick an empty square from 1 to 9.' }]);
      return;
    }
    
    let newBoard = [...board];
    newBoard[move - 1] = 'X';

    let winner = checkTicTacToeWinner(newBoard);
    if (winner) {
      endTicTacToe(winner, newBoard);
      return;
    }

    // Computer's turn
    const emptySquares = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (emptySquares.length > 0) {
        const computerMove = emptySquares[Math.floor(Math.random() * emptySquares.length)]!;
        newBoard[computerMove] = 'O';
    }
    
    setBoard(newBoard);
    displayTicTacToeBoard(newBoard);

    winner = checkTicTacToeWinner(newBoard);
    if (winner) {
      endTicTacToe(winner, newBoard);
    }
  };

  const endTicTacToe = (winner: string, finalBoard: ( 'X' | 'O' | null)[]) => {
    displayTicTacToeBoard(finalBoard);
    let message = '';
    if (winner === 'draw') {
      message = "It's a draw!";
    } else {
      message = `${winner} wins!`;
    }
    setLines(prev => [
      ...prev,
      { type: 'system', content: `--- GAME OVER ---` },
      { type: 'system', content: message },
    ]);
    setTimeout(exitGame, 1000);
  }

   // --- Guess the Number Logic ---
  const startGuessTheNumber = () => {
    setGameMode('guess-the-number');
    const newSecretNumber = Math.floor(Math.random() * 100) + 1;
    setSecretNumber(newSecretNumber);
    setGuesses(0);
    setLines(prev => [
      ...prev,
      { type: 'system', content: 'Starting Guess the Number...' },
      { type: 'system', content: "I'm thinking of a number between 1 and 100." },
      { type: 'system', content: 'Enter your guess. Type `exit` to quit.' },
    ]);
  };

  const handleGuess = (guessStr: string) => {
    const guess = parseInt(guessStr, 10);
    if (isNaN(guess)) {
      setLines(prev => [...prev, { type: 'error', content: 'Please enter a valid number.' }]);
      return;
    }

    const newGuesses = guesses + 1;
    setGuesses(newGuesses);

    if (guess === secretNumber) {
      setLines(prev => [
        ...prev,
        { type: 'system', content: `You got it! The number was ${secretNumber}.` },
        { type: 'system', content: `It took you ${newGuesses} guesses.` },
        { type: 'system', content: `--- GAME OVER ---` },
      ]);
      setTimeout(exitGame, 1000);
    } else if (guess < secretNumber) {
      setLines(prev => [...prev, { type: 'output', content: 'Higher...' }]);
    } else {
      setLines(prev => [...prev, { type: 'output', content: 'Lower...' }]);
    }
  };

  // --- NetRun Logic ---
  const startNetRun = () => {
    setGameMode('netrun');
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => ({
            type: NODE_TYPES[Math.floor(Math.random() * NODE_TYPES.length)],
            fixed: false
        }))
    );
    const start = { r: Math.floor(Math.random() * GRID_SIZE), c: 0 };
    const end = { r: Math.floor(Math.random() * GRID_SIZE), c: GRID_SIZE - 1 };
    newGrid[start.r][start.c] = { type: '─', fixed: true };
    newGrid[end.r][end.c] = { type: '─', fixed: true };
    setStartPos(start);
    setEndPos(end);
    setNetRunGrid(newGrid);

    setLines(prev => [
      ...prev,
      { type: 'system', content: 'Initializing NetRun...' },
      { type: 'system', content: 'Connect the Server [S] to the Terminal [T] by rotating nodes.' },
      { type: 'system', content: 'Command: `rotate [row] [col]`, e.g., `rotate 2 3`' },
      { type: 'system', content: "Type 'exit' to quit." },
    ]);
    displayNetRunGrid(newGrid, start, end);
  };

  const displayNetRunGrid = (grid: Grid, start: { r: number, c: number }, end: { r: number, c: number }) => {
    const gridStr = grid.map((row, r) =>
        '  ' + row.map((node, c) => {
            if (r === start.r && c === start.c) return 'S';
            if (r === end.r && c === end.c) return 'T';
            return node ? node.type : ' ';
        }).join(' ')
    ).join('\n');
    const colHeaders = '    ' + Array.from({ length: GRID_SIZE }, (_, i) => i).join(' ');
    const finalStr = `${colHeaders}\n${gridStr.split('\n').map((row, i) => `${i} ${row.substring(1)}`).join('\n')}`;
    setLines(prev => [...prev, { type: 'output', content: `\n${finalStr}\n` }]);
  };

  const checkNetRunWin = (grid: Grid, start: { r: number, c: number }, end: { r: number, c: number }) => {
    const q: { r: number, c: number }[] = [start];
    const visited = new Set<string>([`${start.r},${start.c}`]);
    const connections: Record<NodeType, { n?: boolean, s?: boolean, e?: boolean, w?: boolean }> = {
        '─': { w: true, e: true },
        '│': { n: true, s: true },
        '┌': { s: true, e: true },
        '┐': { s: true, w: true },
        '└': { n: true, e: true },
        '┘': { n: true, w: true },
    };
    
    while (q.length > 0) {
        const { r, c } = q.shift()!;
        if (r === end.r && c === end.c) return true;

        const node = grid[r][c];
        if (!node) continue;
        const nodeConnections = connections[node.type];
        
        // North
        if (nodeConnections.n && r > 0 && grid[r - 1][c] && connections[grid[r-1][c]!.type].s && !visited.has(`${r - 1},${c}`)) {
            visited.add(`${r-1},${c}`); q.push({r: r-1, c});
        }
        // South
        if (nodeConnections.s && r < GRID_SIZE - 1 && grid[r + 1][c] && connections[grid[r+1][c]!.type].n && !visited.has(`${r + 1},${c}`)) {
            visited.add(`${r+1},${c}`); q.push({r: r+1, c});
        }
        // West
        if (nodeConnections.w && c > 0 && grid[r][c-1] && connections[grid[r][c-1]!.type].e && !visited.has(`${r},${c-1}`)) {
            visited.add(`${r},${c-1}`); q.push({r, c: c-1});
        }
        // East
        if (nodeConnections.e && c < GRID_SIZE - 1 && grid[r][c+1] && connections[grid[r][c+1]!.type].w && !visited.has(`${r},${c+1}`)) {
            visited.add(`${r},${c+1}`); q.push({r, c: c+1});
        }
    }
    return false;
  };

  const handleNetRunMove = (move: string) => {
    if (!netRunGrid) return;

    const parts = move.split(' ');
    if (parts.length !== 3 || parts[0] !== 'rotate') {
      setLines(prev => [...prev, { type: 'error', content: 'Invalid command. Use `rotate [row] [col]`.' }]);
      return;
    }
    const r = parseInt(parts[1], 10);
    const c = parseInt(parts[2], 10);

    if (isNaN(r) || isNaN(c) || r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) {
        setLines(prev => [...prev, { type: 'error', content: 'Coordinates out of bounds.' }]);
        return;
    }

    const node = netRunGrid[r][c];
    if (!node || node.fixed) {
        setLines(prev => [...prev, { type: 'error', content: 'Cannot rotate this node.' }]);
        return;
    }

    const newGrid = netRunGrid.map(row => row.map(cell => ({...cell})));
    const currentNodeType = newGrid[r][c]!.type;
    const currentIndex = NODE_TYPES.indexOf(currentNodeType);
    const nextIndex = (currentIndex + 1) % NODE_TYPES.length;
    newGrid[r][c]!.type = NODE_TYPES[nextIndex];
    
    setNetRunGrid(newGrid);
    displayNetRunGrid(newGrid, startPos, endPos);
    
    if (checkNetRunWin(newGrid, startPos, endPos)) {
        setLines(prev => [
            ...prev,
            { type: 'system', content: `--- CONNECTION ESTABLISHED! ---` },
            { type: 'system', content: `--- YOU WIN! ---` },
        ]);
        setTimeout(exitGame, 1000);
    }
  };

  // --- Mainframe Breach Logic ---
    const startMainframeBreach = () => {
        setGameMode('mainframe-breach');
        setMainframeState({
            stage: 'find_ip',
            loggedIn: false,
        });
        setLines(prev => [
            ...prev,
            { type: 'system', content: '--- Mainframe Breach ---' },
            { type: 'system', content: 'Your objective is to gain access to the system and retrieve the flag.' },
            { type: 'system', content: 'Start by enumerating the network. Type `help` for game commands.' },
        ]);
    };

    const handleMainframeCommand = (command: string) => {
        if (!mainframeState) return;

        const parts = command.split(' ');
        const baseCommand = parts[0];

        if (mainframeState.loggedIn) {
            if (baseCommand === 'ls') {
                 setLines(prev => [...prev, { type: 'output', content: 'flag.txt   user.dat' }]);
            } else if (baseCommand === 'cat' && parts[1] === 'flag.txt') {
                 setLines(prev => [
                     ...prev,
                     { type: 'system', content: 'SUCCESS! Flag retrieved: {THM_FLAG_A3B7C9D2E1F0}' },
                     { type: 'system', content: '--- YOU WIN! ---' },
                 ]);
                 setTimeout(exitGame, 1000);
            } else {
                 setLines(prev => [...prev, { type: 'error', content: 'Command not found. Available commands: ls, cat' }]);
            }
            return;
        }

        switch (mainframeState.stage) {
            case 'find_ip':
                if (command === 'help') {
                     setLines(prev => [...prev, { type: 'output', content: 'Commands: scan network, read doc-24b' }]);
                } else if (command === 'scan network') {
                     setLines(prev => [...prev, { type: 'output', content: 'Scan complete. Found 1 host. No open ports detected. Found 1 leaked document: doc-24b' }]);
                } else if (command === 'read doc-24b') {
                     setLines(prev => [
                         ...prev,
                         { type: 'output', content: 'Document content: "Meeting notes - Finalized server setup on 10.10.121.217. All secure."' },
                         { type: 'system', content: 'IP address found! Next step: find vulnerabilities.' },
                     ]);
                     setMainframeState({ ...mainframeState, stage: 'find_vulnerability', ip: '10.10.121.217' });
                } else {
                     setLines(prev => [...prev, { type: 'error', content: 'Unknown command. Try `help`.' }]);
                }
                break;
            
            case 'find_vulnerability':
                if (command === `scan vulnerabilities ${mainframeState.ip}`) {
                    setLines(prev => [
                         ...prev,
                         { type: 'output', content: `Scanning ${mainframeState.ip}...` },
                         { type: 'output', content: 'Result: Port 22 (SSH) is open. Service appears to be using default credentials.' },
                         { type: 'system', content: 'Vulnerability found! Next step: gain access.' },
                     ]);
                     setMainframeState({ ...mainframeState, stage: 'brute_force', vulnerability: 'SSH' });
                } else {
                     setLines(prev => [...prev, { type: 'error', content: `Unknown command. Try 'scan vulnerabilities ${mainframeState.ip}'` }]);
                }
                break;

            case 'brute_force':
                if (command === `brute_force ssh ${mainframeState.ip}`) {
                    setLines(prev => [
                         ...prev,
                         { type: 'output', content: 'Initiating brute-force attack on SSH... credentials found!' },
                         { type: 'output', content: 'user: admin, pass: admin123' },
                         { type: 'system', content: 'Password found! Next step: log in.' },
                     ]);
                     setMainframeState({ ...mainframeState, stage: 'ssh_login', password: 'admin123' });
                } else {
                     setLines(prev => [...prev, { type: 'error', content: `Unknown command. Try 'brute_force ssh ${mainframeState.ip}'` }]);
                }
                break;
            
             case 'ssh_login':
                if (command === `ssh admin@${mainframeState.ip}`) {
                    setLines(prev => [
                         ...prev,
                         { type: 'output', content: 'Login successful! Welcome to the mainframe.' },
                     ]);
                     setMainframeState({ ...mainframeState, stage: 'get_flag', loggedIn: true });
                } else {
                     setLines(prev => [...prev, { type: 'error', content: `Unknown command. Try 'ssh admin@${mainframeState.ip}'` }]);
                }
                break;
        }
    };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    processCommand(input);
  };

  return (
    <div className="bg-black text-foreground font-code h-full flex flex-col p-2 text-sm">
      <div className="flex-grow overflow-y-auto">
        {lines.map((line, index) => (
          <div key={index} className="flex gap-2">
            {line.type === 'input' && <span className="text-primary">{mainframeState?.loggedIn ? `admin@${mainframeState.ip}:~$` : '$'}</span>}
            <p className={`${line.type === 'error' ? 'text-destructive' : ''} ${line.content === 'AI is typing...' ? 'italic text-muted-foreground' : ''} whitespace-pre-wrap`}>
              {line.content}
            </p>
          </div>
        ))}
        <div ref={endOfTerminalRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
        <span className="text-primary">{mainframeState?.loggedIn ? `admin@${mainframeState.ip}:~$` : '$'}</span>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground font-code flex-grow"
          placeholder={
            gameMode === 'firewall-defender' ? `Type 'allow' or 'deny'...` :
            gameMode === 'tic-tac-toe' ? `Enter your move (1-9)...` :
            gameMode === 'guess-the-number' ? `Enter your guess...` :
            gameMode === 'netrun' ? `rotate r c...` :
            gameMode === 'mainframe-breach' ? `Enter hacking command...` :
            `Type a command...`
          }
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
  const [terminalInitialCommand, setTerminalInitialCommand] = useState<string | undefined>(undefined);
  const [gameApps, setGameApps] = useState<App[]>(initialGameApps);
  const [powerState, setPowerState] = useState<PowerState>('running');
  const [powerMessage, setPowerMessage] = useState('');

  const handleGameToggle = (gameId: string) => {
    setGameApps(prev => prev.map(game => 
        game.id === gameId ? { ...game, active: !game.active } : game
    ));
  };
  
  const APPS = ALL_APPS(cvContent, gameApps, handleGameToggle);

  const handleContentUpdate = (newContent: Partial<CvContent>) => {
    setCvContent(prev => ({ ...prev, ...newContent }));
  }
  
    const handleShutdown = () => {
        setPowerState('shutting_down');
        setPowerMessage('Shutting Down...');
        setTimeout(() => {
            setPowerState('off');
            setPowerMessage('System Halted.');
        }, 2000);
    };

    const handleRestart = () => {
        setPowerState('restarting');
        setPowerMessage('Restarting...');
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    };


  const openApp = useCallback((appId: string, options?: { parentId: string }) => {
    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    // Handle opening an item within a folder
    if (options?.parentId) {
        const parentWindow = windows.find(w => w.id === options.parentId);
        if (parentWindow) {
            setWindows(prev => prev.map(w => w.id === options.parentId ? {
                ...w,
                appId: appId, // Change the content of the existing window
                history: [...(w.history || [w.appId]), appId],
            } : w));
            focusWindow(options.parentId);
            return;
        }
    }


    const gameApp = gameApps.find(g => g.id === appId);
    const isTerminalGame = gameApp && gameApp.isTerminal;

    if (isTerminalGame) {
        setTerminalInitialCommand(`play ${appId.replace('-game', '')}`);
        
        const terminalWindow = windows.find(w => w.appId === 'terminal');
        if (terminalWindow) {
            focusWindow(terminalWindow.id);
        } else {
            const terminalApp = APPS.find(a => a.id === 'terminal');
             if (!terminalApp) return;

            const newZIndex = zIndexCounter.current + 1;
            zIndexCounter.current = newZIndex;
            const newWindow: WindowInstance = {
              id: `terminal-${Date.now()}`,
              appId: 'terminal',
              title: terminalApp.name,
              position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
              size: { width: 640, height: 480 },
              zIndex: newZIndex,
              minimized: false,
              history: ['terminal'],
            };
            setWindows(prev => [...prev, newWindow]);
            setActiveWindow(newWindow.id);
        }
        return;
    }
      
    const existingWindow = windows.find(w => w.appId === appId && !w.history.includes(app.parentId || ''));
    if (existingWindow) {
      focusWindow(existingWindow.id);
      return;
    }

    const newZIndex = zIndexCounter.current + 1;
    zIndexCounter.current = newZIndex;
    const newWindow: WindowInstance = {
      id: `${appId}-${Date.now()}`,
      appId,
      title: app.name,
      position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 },
      size: { width: 640, height: 480 },
      zIndex: newZIndex,
      minimized: false,
      history: [appId],
    };
    setWindows(prev => [...prev, newWindow]);
    setActiveWindow(newWindow.id);
  }, [windows, gameApps, APPS]);

  useEffect(() => {
      if (terminalInitialCommand && windows.some(w => w.appId === 'terminal')) {
          const timer = setTimeout(() => setTerminalInitialCommand(undefined), 100);
          return () => clearTimeout(timer);
      }
  }, [windows, terminalInitialCommand])

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) {
      setActiveWindow(null);
    }
  };
  
   const goBackInWindow = (windowId: string) => {
    setWindows(prev => prev.map(w => {
        if (w.id === windowId && w.history && w.history.length > 1) {
            const newHistory = [...w.history];
            newHistory.pop();
            const newAppId = newHistory[newHistory.length - 1];
            return { ...w, appId: newAppId, history: newHistory };
        }
        return w;
    }));
  };

  const focusWindow = (id: string) => {
    if (id === activeWindow) return;

    const newZIndex = zIndexCounter.current + 1;
    zIndexCounter.current = newZIndex;
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, zIndex: newZIndex, minimized: false } : w))
    );
    setActiveWindow(id);
  };
  
  const minimizeWindow = (id: string) => {
    setWindows(prev =>
      prev.map(w => (w.id === id ? { ...w, minimized: true } : w))
    );
    if (activeWindow === id) {
        setActiveWindow(null);
    }
  };

  const handleTaskbarClick = (id: string) => {
    const window = windows.find(w => w.id === id);
    if (!window) return;

    if (window.minimized) {
        focusWindow(id); // This will also un-minimize
    } else {
        if (activeWindow === id) {
            minimizeWindow(id);
        } else {
            focusWindow(id);
        }
    }
  };


  const renderWindowContent = (win: WindowInstance) => {
    const app = APPS.find(a => a.id === win.appId);
    if (!app) return null;

    if (win.appId === 'terminal') {
        return <Terminal openApp={openApp} cvContent={cvContent} initialCommand={terminalInitialCommand} />;
    }
    
    if (['about', 'resume', 'projects', 'interests', 'details'].includes(app.id)) {
        return <app.component onSave={handleContentUpdate} />;
    }
    
    return <app.component openApp={(appId: string) => openApp(appId, { parentId: win.id })} />;
  };
  
  const getWindowTitle = (win: WindowInstance) => {
    if (!win.history || win.history.length <= 1) {
        return APPS.find(a => a.id === win.appId)?.name || 'Window';
    }
    return win.history
        .map(appId => APPS.find(a => a.id === appId)?.name)
        .filter(Boolean)
        .join(' > ');
  };


  const desktopApps = APPS.filter(app => !app.isFolderContent);

   if (powerState === 'shutting_down' || powerState === 'restarting' || powerState === 'off') {
        return (
            <div className="w-full h-full bg-black flex items-center justify-center">
                <p className="text-foreground font-code text-2xl animate-pulse">{powerMessage}</p>
            </div>
        );
    }

  return (
    <div className="desktop-background relative w-full h-full bg-background">
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
        
        <AlertDialog open={powerState === 'confirming'} onOpenChange={(open) => !open && setPowerState('running')}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to proceed?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Any unsaved changes will be lost.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setPowerState('running')}>Cancel</AlertDialogCancel>
                    <Button variant="secondary" onClick={handleRestart}><RefreshCcw /> Restart</Button>
                    <AlertDialogAction asChild>
                         <Button variant="destructive" onClick={handleShutdown}><Power /> Shut Down</Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>


      <div className="relative w-full h-[calc(100%-40px)] p-4 overflow-hidden">
        {desktopApps.map((app, index) => (
          <DesktopIcon
            key={app.id}
            name={app.name}
            icon={app.icon}
            onClick={() => openApp(app.id)}
            initialPosition={{ x: 20, y: 20 + index * 110 }}
          />
        ))}
      </div>

      {windows.filter(w => !w.minimized).map(win => (
        <Window
          key={win.id}
          title={getWindowTitle(win)}
          zIndex={win.zIndex}
          initialSize={win.size}
          onClose={() => closeWindow(win.id)}
          onFocus={() => focusWindow(win.id)}
          onMinimize={() => minimizeWindow(win.id)}
          onGoBack={win.history && win.history.length > 1 ? () => goBackInWindow(win.id) : undefined}
          isActive={activeWindow === win.id}
        >
          {renderWindowContent(win)}
        </Window>
      ))}
      <Taskbar
        windows={windows}
        apps={APPS}
        onTaskbarClick={handleTaskbarClick}
        onWindowClose={closeWindow}
        activeWindowId={activeWindow}
        onAppLaunch={openApp}
        onShutdown={() => setPowerState('confirming')}
        onRestart={() => setPowerState('confirming')}
      />
    </div>
  );
}
