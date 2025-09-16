'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function AdminLoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      onLoginSuccess();
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid username or password.',
        variant: 'destructive',
      });
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          placeholder="admin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Login
      </Button>
    </form>
  );
}

function GuestLoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const { guestLogin } = useAuth();
  
  const handleGuestLogin = () => {
    if (guestLogin()) {
      onLoginSuccess();
    } else {
       toast({
        title: 'Login Failed',
        description: 'Could not log in as guest.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
            Try out the editing features. Your changes will not be saved.
        </p>
        <Button onClick={handleGuestLogin} className="w-full">
            Continue as Guest
        </Button>
    </div>
  )
}


export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-background">
      <div className="crt-overlay"></div>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>Select a login method to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="guest">Guest</TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Admin Access</CardTitle>
                        <CardDescription>Enter your credentials to edit your CV.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="guest">
                <Card className="border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-lg">Guest Access</CardTitle>
                        <CardDescription>Try the interactive features.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GuestLoginForm onLoginSuccess={handleLoginSuccess} />
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
