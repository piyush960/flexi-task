import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import { useLoginMutation } from '@/app/services/authAPI';
import { selectIsAuthenticated } from '@/app/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, ListTodo } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, { isLoading, error }] = useLoginMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await login({ username, password }).unwrap();
      
      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.data?.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary-light to-background p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-md">
            <ListTodo className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">FlexiTask</h1>
          <p className="text-muted-foreground mt-2">Manage your tasks efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="test"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11"
            />
            <p className="text-xs text-muted-foreground">
              Demo: username: <strong>test</strong>, password: <strong>test123</strong>
            </p>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
