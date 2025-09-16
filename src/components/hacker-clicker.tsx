
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Cpu, Network, Shield } from 'lucide-react';

type Upgrade = {
  id: string;
  name: string;
  cost: number;
  dps: number; // Data per second
  level: number;
  icon: React.ReactNode;
};

const initialUpgrades: Upgrade[] = [
  { id: 'auto-miner', name: 'Auto-Miner', cost: 10, dps: 1, level: 0, icon: <Bot /> },
  { id: 'quantum-decryptor', name: 'Quantum Decryptor', cost: 100, dps: 10, level: 0, icon: <Cpu /> },
  { id: 'botnet-node', name: 'Botnet Node', cost: 1000, dps: 80, level: 0, icon: <Network /> },
];

const firewalls = [
    { level: 1, health: 1000, name: "Corporate Firewall" },
    { level: 2, health: 10000, name: "Govt. Agency Mainframe" },
    { level: 3, health: 100000, name: "Global Banking Network" },
    { level: 4, health: 1000000, name: "Project M.E.D.U.S.A." },
]

export default function HackerClicker() {
  const [dataFragments, setDataFragments] = useState(0);
  const [upgrades, setUpgrades] = useState<Upgrade[]>(initialUpgrades);
  const [currentFirewallLevel, setCurrentFirewallLevel] = useState(1);
  const [firewall, setFirewall] = useState(firewalls[0]);

  const dps = upgrades.reduce((acc, upg) => acc + upg.dps * upg.level, 0);

  const handleHackClick = () => {
    setDataFragments(prev => prev + 1);
  };

  const purchaseUpgrade = (upgradeId: string) => {
    const upgrade = upgrades.find(upg => upg.id === upgradeId);
    if (upgrade && dataFragments >= upgrade.cost) {
      setDataFragments(prev => prev - upgrade.cost);
      setUpgrades(prevUpgrades =>
        prevUpgrades.map(upg =>
          upg.id === upgradeId
            ? { ...upg, level: upg.level + 1, cost: Math.floor(upg.cost * 1.15) }
            : upg
        )
      );
    }
  };

  useEffect(() => {
    const gameTick = setInterval(() => {
      setDataFragments(prev => prev + dps);
    }, 1000);

    return () => clearInterval(gameTick);
  }, [dps]);

  useEffect(() => {
      if (dataFragments >= firewall.health) {
          if (currentFirewallLevel < firewalls.length) {
              setDataFragments(0); // Reset for next level
              setCurrentFirewallLevel(prev => prev + 1);
              setFirewall(firewalls[currentFirewallLevel]);
              // Reset upgrades for a fresh challenge
              setUpgrades(initialUpgrades);
          } else {
              // Game won
          }
      }
  }, [dataFragments, firewall, currentFirewallLevel]);

  const firewallProgress = (dataFragments / firewall.health) * 100;

  return (
    <div className="bg-background text-foreground font-code h-full flex flex-col p-2 text-sm">
      <div className="grid grid-cols-3 gap-4 p-4">
        {/* Main Clicker Area */}
        <div className="col-span-3 lg:col-span-2 flex flex-col gap-4">
            <Card className="text-center bg-card/50">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">{dataFragments.toLocaleString()}</CardTitle>
                    <p className="text-muted-foreground">Data Fragments</p>
                    <p className="text-sm font-semibold text-accent">{dps.toLocaleString()} DPS</p>
                </CardHeader>
                <CardContent>
                    <Button onClick={handleHackClick} size="lg" className="w-full text-lg h-24">
                        Breach Network
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-card/50">
                <CardHeader>
                     <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center gap-2"><Shield size={20} /> Current Target</CardTitle>
                        <span className="text-sm font-bold text-destructive">Level {firewall.level}</span>
                    </div>
                    <p className="text-muted-foreground pt-2">
                        {firewall.name}
                    </p>
                </CardHeader>
                <CardContent>
                    <Progress value={firewallProgress} className="w-full" />
                    <p className="text-center text-xs mt-2 text-muted-foreground">
                       {Math.floor(dataFragments).toLocaleString()} / {firewall.health.toLocaleString()}
                    </p>
                </CardContent>
            </Card>
        </div>

        {/* Upgrades Area */}
        <div className="col-span-3 lg:col-span-1">
            <Card className="h-full bg-card/50">
                <CardHeader>
                    <CardTitle>Upgrades</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[280px] pr-3">
                    <div className="space-y-2">
                        {upgrades.map(upg => (
                            <Button
                                key={upg.id}
                                variant="outline"
                                className="w-full justify-between h-16"
                                onClick={() => purchaseUpgrade(upg.id)}
                                disabled={dataFragments < upg.cost}
                            >
                                <div className="flex items-center gap-3 text-left">
                                    {upg.icon}
                                    <div>
                                        <p className="font-bold">{upg.name} <span className="text-xs text-muted-foreground"> (Lvl {upg.level})</span></p>
                                        <p className="text-xs text-primary">+{upg.dps.toLocaleString()} DPS</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-semibold">{upg.cost.toLocaleString()}</p>
                                    <p className="text-xs text-muted-foreground">Cost</p>
                                </div>
                            </Button>
                        ))}
                    </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
        {currentFirewallLevel > firewalls.length && (
             <div className="col-span-3 text-center p-8">
                <h2 className="text-3xl font-bold text-primary">PROJECT M.E.D.U.S.A. DEFEATED</h2>
                <p className="text-muted-foreground mt-2">You have reclaimed control of the network. The digital world is safe... for now.</p>
            </div>
        )}
      </div>
    </div>
  );
}
