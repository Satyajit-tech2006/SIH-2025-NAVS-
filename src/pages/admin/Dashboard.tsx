import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [user] = useState(() => {
    const stored = localStorage.getItem('navs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await api.getFraudAnalytics();
      setAnalytics(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout user={user}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor system health, manage institutions and verifiers, and track fraud analytics.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="hero" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/admin/verifiers">
              <Users className="mr-3 h-6 w-6" />
              Manage Verifiers
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/admin/institutions">
              <Building className="mr-3 h-6 w-6" />
              Institutions
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/admin/analytics">
              <TrendingUp className="mr-3 h-6 w-6" />
              Analytics
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/admin/security">
              <Shield className="mr-3 h-6 w-6" />
              Security
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verifications Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {analytics?.verificationsToday || 0}
              </div>
              <p className="text-sm text-success mt-1">
                +12% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Suspicious This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {analytics?.suspiciousThisMonth || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Flagged certificates
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Institutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {analytics?.topInstitutions?.length || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Verified institutions
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Blacklisted Certs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">
                {analytics?.blacklistedCertificates || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Blocked certificates
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Top Institutions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Top Institutions by Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topInstitutions?.map((institution: any, index: number) => (
                  <div key={institution.name} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium text-foreground">{institution.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {institution.verifications} verifications
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">OCR Service</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Operational</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Blockchain Network</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Connected</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span className="text-sm text-success">Healthy</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-foreground">AI Detection</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span className="text-sm text-warning">High Load</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Recent System Alerts</CardTitle>
              <Button variant="outline" asChild>
                <Link to="/admin/alerts">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-warning-light rounded border-l-4 border-warning">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">High Suspicious Activity Detected</h4>
                    <p className="text-sm text-muted-foreground">
                      Unusual spike in certificate forgery attempts from specific IP ranges
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-success-light rounded border-l-4 border-success">
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-success mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">New Institution Approved</h4>
                    <p className="text-sm text-muted-foreground">
                      IIT Delhi has been successfully onboarded to the platform
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}