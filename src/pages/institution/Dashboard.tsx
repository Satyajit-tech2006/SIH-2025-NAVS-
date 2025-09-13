import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Upload, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function InstitutionDashboard() {
  const [user] = useState(() => {
    const stored = localStorage.getItem('navs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await api.getInstitutionDashboard(user?.id);
      setDashboardData(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
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
            Institution Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Manage your institution's certificates and templates.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Button 
            variant="hero" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/institution/upload">
              <Upload className="mr-3 h-6 w-6" />
              Bulk Upload
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/institution/templates">
              <FileText className="mr-3 h-6 w-6" />
              Manage Templates
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/institution/analytics">
              <TrendingUp className="mr-3 h-6 w-6" />
              View Analytics
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {dashboardData?.totalCertificates?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                In database
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {dashboardData?.verifiedCertificates?.toLocaleString() || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Successfully verified
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Suspicious Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">
                {dashboardData?.suspiciousCertificates || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Flagged certificates
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">
                {dashboardData?.lastUploadDate ? 
                  new Date(dashboardData.lastUploadDate).toLocaleDateString() : 
                  'No uploads'
                }
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Latest batch
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        {dashboardData?.alerts && dashboardData.alerts.length > 0 && (
          <Card className="shadow-card border-warning mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-warning">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.alerts.map((alert: any) => (
                  <div key={alert.id} className="p-4 bg-warning-light rounded border-l-4 border-warning">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-foreground">Suspicious Certificate Detected</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {alert.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Certificate ID: <code className="bg-muted px-1 rounded">{alert.certId}</code>
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status="SUSPECT" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Getting Started</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Upload Certificates</h3>
                <p className="text-sm text-muted-foreground">
                  Bulk upload your institution's certificates using CSV and ZIP files
                </p>
                <Button variant="outline" asChild>
                  <Link to="/institution/upload">Start Upload</Link>
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Create Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Set up golden templates for verification and seal/signature matching
                </p>
                <Button variant="outline" asChild>
                  <Link to="/institution/templates">Manage Templates</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}