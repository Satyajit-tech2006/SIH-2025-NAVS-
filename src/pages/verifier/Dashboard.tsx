import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileSearch, Upload, Clock, CheckCircle, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

interface VerificationRecord {
  id: string;
  date: string;
  candidateName: string;
  certId: string;
  institution: string;
  status: 'VERIFIED' | 'SUSPECT' | 'NOT_FOUND';
  confidenceScore: number;
}

export default function VerifierDashboard() {
  const [user] = useState(() => {
    const stored = localStorage.getItem('navs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadVerificationHistory();
  }, []);

  const loadVerificationHistory = async () => {
    try {
      const history = await api.getVerificationHistory(user?.id);
      setVerifications(history);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load verification history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalVerifications: verifications.length,
    verified: verifications.filter(v => v.status === 'VERIFIED').length,
    suspicious: verifications.filter(v => v.status === 'SUSPECT').length,
    avgConfidence: verifications.length > 0 
      ? Math.round(verifications.reduce((sum, v) => sum + v.confidenceScore, 0) / verifications.length)
      : 0
  };

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verifier Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Verify academic credentials with confidence.
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
            <Link to="/verifier/verify">
              <FileSearch className="mr-3 h-6 w-6" />
              Quick Verify
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/verifier/bulk">
              <Upload className="mr-3 h-6 w-6" />
              Bulk Verify
            </Link>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="h-20 text-lg"
            asChild
          >
            <Link to="/verifier/history">
              <Clock className="mr-3 h-6 w-6" />
              View History
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.totalVerifications}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Verified Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">
                {stats.verified}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Authentic documents
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
                {stats.suspicious}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Require review
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {stats.avgConfidence}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Verification accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Verifications */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Recent Verifications</CardTitle>
              <Button variant="outline" asChild>
                <Link to="/verifier/history">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-12 bg-muted rounded"></div>
                  </div>
                ))}
              </div>
            ) : verifications.length === 0 ? (
              <div className="text-center py-12">
                <FileSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No verifications yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start verifying academic credentials to see your history here
                </p>
                <Button variant="hero" asChild>
                  <Link to="/verifier/verify">
                    Start Verifying
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifications.slice(0, 5).map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-medium">
                        {new Date(verification.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{verification.candidateName}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {verification.certId}
                      </TableCell>
                      <TableCell>{verification.institution}</TableCell>
                      <TableCell>
                        <StatusBadge status={verification.status} />
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {verification.confidenceScore}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/verifier/result/${verification.id}`}>
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Download Report</DropdownMenuItem>
                            <DropdownMenuItem>Share Result</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}