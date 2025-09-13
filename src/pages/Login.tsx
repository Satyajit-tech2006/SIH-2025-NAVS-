import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.login(email, password);
      
      if (result.status === 'otp_required') {
        setShowOTP(true);
        toast({
          title: "OTP Sent",
          description: "Please check your email/phone for the verification code",
        });
      } else if (result.status === 'success') {
        localStorage.setItem('navs_user', JSON.stringify(result.user));
        localStorage.setItem('navs_token', result.token);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}!`,
        });

        // Redirect based on role
        const roleRoutes = {
          verifier: '/verifier',
          institution: '/institution', 
          admin: '/admin',
          student: '/student'
        };
        navigate(roleRoutes[result.user.role as keyof typeof roleRoutes] || '/');
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.verifyOTP(email, otp);
      
      if (result.status === 'success') {
        localStorage.setItem('navs_user', JSON.stringify(result.user));
        localStorage.setItem('navs_token', result.token);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${result.user.name}!`,
        });

        const roleRoutes = {
          verifier: '/verifier',
          institution: '/institution',
          admin: '/admin', 
          student: '/student'
        };
        navigate(roleRoutes[result.user.role as keyof typeof roleRoutes] || '/');
      }
    } catch (error) {
      toast({
        title: "OTP Verification Failed",
        description: error instanceof Error ? error.message : "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 text-white">
            <div className="bg-white/10 p-2 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">NAVS</h1>
              <p className="text-sm text-white/80">National Academic Verification</p>
            </div>
          </Link>
        </div>

        <Card className="shadow-verification">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-foreground">
              {showOTP ? 'Enter Verification Code' : 'Sign In to NAVS'}
            </CardTitle>
            <p className="text-muted-foreground">
              {showOTP 
                ? `Enter the OTP sent to ${email}` 
                : 'Access your secure verification portal'
              }
            </p>
          </CardHeader>
          
          <CardContent>
            {!showOTP ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="hero"
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Use <code className="bg-muted px-1 rounded">123456</code> for demo
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  variant="verify"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setShowOTP(false)}
                >
                  Back to Login
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            {/* Demo Accounts */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-2">Demo Accounts:</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Verifier:</strong> verifier@example.com</p>
                <p><strong>Institution:</strong> registrar@vssut.ac.in</p>
                <p><strong>Admin:</strong> admin@navs.gov.in</p>
                <p><strong>Student:</strong> student@example.com</p>
                <p className="mt-2"><strong>Password:</strong> Any (demo mode)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}