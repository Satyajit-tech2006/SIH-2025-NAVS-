import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Download, Share2, Flag, CheckCircle, AlertTriangle, XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/Layout';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfidenceMeter } from '@/components/ConfidenceMeter';
import { useToast } from '@/hooks/use-toast';

export default function VerificationResult() {
  const location = useLocation();
  const { toast } = useToast();
  const { jobId, result, file, searchType, certId } = location.state || {};

  const [user] = useState(() => {
    const stored = localStorage.getItem('navs_user');
    return stored ? JSON.parse(stored) : null;
  });

  if (!result) {
    return (
      <Layout user={user}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <XCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">No Results Found</h2>
              <p className="text-muted-foreground mb-4">
                No verification data available. Please try again.
              </p>
              <Button asChild>
                <Link to="/verifier/verify">Start New Verification</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const handleDownloadReport = () => {
    toast({
      title: "Generating Report",
      description: "PDF report is being generated and will download shortly",
    });
    
    // Simulate PDF generation
    setTimeout(() => {
      const element = document.createElement('a');
      element.href = 'data:text/plain;charset=utf-8,Verification Report for ' + (certId || file?.name || 'Certificate');
      element.download = `verification-report-${jobId}.txt`;
      element.click();
    }, 1000);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/shared/${jobId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share Link Copied",
      description: "Verification result link copied to clipboard",
    });
  };

  const handleFlag = () => {
    toast({
      title: "Flagged for Review",
      description: "This verification has been flagged for manual review",
    });
  };

  const getResultIcon = () => {
    switch (result.result) {
      case 'VERIFIED':
        return <CheckCircle className="h-8 w-8 text-success" />;
      case 'SUSPECT':
        return <AlertTriangle className="h-8 w-8 text-warning" />;
      default:
        return <XCircle className="h-8 w-8 text-destructive" />;
    }
  };

  const getResultColor = () => {
    switch (result.result) {
      case 'VERIFIED':
        return 'bg-success-light border-success';
      case 'SUSPECT':
        return 'bg-warning-light border-warning';
      default:
        return 'bg-destructive-light border-destructive';
    }
  };

  return (
    <Layout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/verifier">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-foreground">
              Verification Result
            </h1>
            <p className="text-muted-foreground">
              Job ID: {jobId}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button variant="outline" onClick={handleFlag}>
              <Flag className="mr-2 h-4 w-4" />
              Flag for Review
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Uploaded Document */}
          <div className="space-y-6">
            {/* Document Preview */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>
                  {searchType === 'certId' ? 'Certificate Search' : 'Uploaded Document'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {searchType === 'certId' ? (
                  <div className="text-center py-8">
                    <div className="bg-muted rounded-lg p-8 mb-4">
                      <div className="text-2xl font-mono text-foreground mb-2">
                        {certId}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Certificate ID Verification
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    {file?.type?.startsWith('image/') ? (
                      <div className="bg-muted rounded-lg p-4 mb-4">
                        <img 
                          src="/api/placeholder/400/300" 
                          alt="Certificate preview"
                          className="max-w-full h-auto rounded border"
                        />
                      </div>
                    ) : (
                      <div className="bg-muted rounded-lg p-8 mb-4">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="font-medium">{file?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file?.size && `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* OCR Results */}
            {result.ocrData && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Extracted Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(result.ocrData.fields).map(([key, field]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="font-medium capitalize">{key.replace('_', ' ')}:</span>
                        <div className="text-right">
                          <span className="text-foreground">{field.value}</span>
                          <div className="text-xs text-muted-foreground">
                            {Math.round(field.confidence * 100)}% confidence
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Verification Results */}
          <div className="space-y-6">
            {/* Main Result */}
            <Card className={`shadow-verification border-2 ${getResultColor()}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {getResultIcon()}
                </div>
                <CardTitle className="text-2xl">
                  <StatusBadge status={result.result} className="text-lg px-6 py-2" />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <ConfidenceMeter score={result.confidenceScore} className="mb-6" />
                
                <div className="text-sm text-muted-foreground">
                  {result.result === 'VERIFIED' && 
                    "This certificate has been successfully verified against our blockchain-anchored database."
                  }
                  {result.result === 'SUSPECT' && 
                    "This certificate shows signs of tampering or forgery. Manual review recommended."
                  }
                  {result.result === 'NOT_FOUND' && 
                    "This certificate could not be found in our database or verified against any institution."
                  }
                </div>
              </CardContent>
            </Card>

            {/* Matched Record */}
            {result.matchedRecord && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-success" />
                    Matched Database Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-muted-foreground">Student Name:</span>
                        <p className="text-foreground">{result.matchedRecord.studentName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Roll Number:</span>
                        <p className="text-foreground font-mono">{result.matchedRecord.rollNumber}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Course:</span>
                        <p className="text-foreground">{result.matchedRecord.course}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Year:</span>
                        <p className="text-foreground">{result.matchedRecord.yearOfPassing}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Marks:</span>
                        <p className="text-foreground">{result.matchedRecord.marks}</p>
                      </div>
                      <div>
                        <span className="font-medium text-muted-foreground">Issue Date:</span>
                        <p className="text-foreground">
                          {new Date(result.matchedRecord.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t">
                      <span className="font-medium text-muted-foreground">Certificate Hash:</span>
                      <p className="text-xs font-mono text-foreground mt-1 break-all">
                        {result.matchedRecord.certHash}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Flags */}
            {result.aiFlags && result.aiFlags.length > 0 && (
              <Card className="shadow-card border-warning">
                <CardHeader>
                  <CardTitle className="flex items-center text-warning">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    AI Detection Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.aiFlags.map((flag, index) => (
                      <div key={index} className="p-3 bg-warning-light rounded border-l-4 border-warning">
                        <div className="flex items-start space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {flag.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mt-2">{flag.detail}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Blockchain Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    result.blockchain?.exists ? 'bg-success' : 'bg-destructive'
                  }`}></div>
                  Blockchain Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {result.blockchain?.exists ? (
                    <div className="space-y-2">
                      <p className="text-success font-medium">✓ Certificate hash found on blockchain</p>
                      {result.blockchain.txHash && (
                        <div>
                          <span className="text-muted-foreground">Transaction Hash:</span>
                          <p className="font-mono text-xs text-foreground mt-1 break-all">
                            {result.blockchain.txHash}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-destructive font-medium">✗ Certificate hash not found on blockchain</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}