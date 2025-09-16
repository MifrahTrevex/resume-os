'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function AdminLoginForm({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login to Edit'}
      </Button>
    </form>
  );
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
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to edit your CV.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminLoginForm onLoginSuccess={handleLoginSuccess} />
        </CardContent>
      </Card>
    </div>
  );
}
