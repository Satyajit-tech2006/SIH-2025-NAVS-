import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSearch, QrCode, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout } from '@/components/Layout';
import { FileUpload } from '@/components/FileUpload';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

export default function Verify() {
  const [user] = useState(() => {
    const stored = localStorage.getItem('navs_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    
    try {
      const result = await api.uploadForVerification(file, user?.id);
      
      toast({
        title: "Upload Successful",
        description: "Certificate uploaded and verification started",
      });

      // Navigate to results page with job data
      navigate('/verifier/result', { 
        state: { 
          jobId: result.jobId, 
          result: result.result,
          file: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        } 
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCertIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certId.trim()) {
      toast({
        title: "Certificate ID Required",
        description: "Please enter a certificate ID to verify",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for cert ID verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock result based on cert ID
      const mockResult = {
        result: certId.includes('FAKE') ? 'SUSPECT' : 'VERIFIED',
        confidenceScore: certId.includes('FAKE') ? 25 : 94,
        matchedRecord: certId.includes('FAKE') ? null : {
          certId: certId,
          studentName: "John Doe",
          rollNumber: "2020123456",
          course: "B.Tech Computer Science",
          yearOfPassing: 2024,
          certHash: "SHA256:abc123..."
        },
        aiFlags: certId.includes('FAKE') ? [
          { type: "invalid_format", detail: "Certificate ID format doesn't match institution standards" }
        ] : [],
        blockchain: { exists: !certId.includes('FAKE') }
      };

      navigate('/verifier/result', { 
        state: { 
          jobId: `cert_${Date.now()}`, 
          result: mockResult,
          searchType: 'certId',
          certId: certId
        } 
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Please check the certificate ID and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = () => {
    toast({
      title: "QR Scanner",
      description: "QR code scanning feature coming soon",
    });
  };

  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verify Certificate
          </h1>
          <p className="text-muted-foreground">
            Upload a certificate image/PDF, enter a certificate ID, or scan a QR code to verify authenticity
          </p>
        </div>

        <Card className="shadow-verification">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Choose Verification Method
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <FileSearch className="h-4 w-4" />
                  <span>Upload Document</span>
                </TabsTrigger>
                <TabsTrigger value="certid" className="flex items-center space-x-2">
                  <Hash className="h-4 w-4" />
                  <span>Certificate ID</span>
                </TabsTrigger>
                <TabsTrigger value="qr" className="flex items-center space-x-2">
                  <QrCode className="h-4 w-4" />
                  <span>QR Code</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Upload Certificate Document
                  </h3>
                  <p className="text-muted-foreground">
                    Our AI will analyze the document for authenticity using OCR, 
                    template matching, and blockchain verification
                  </p>
                </div>
                
                <FileUpload 
                  onUpload={handleFileUpload}
                  accepted=".pdf,.jpg,.jpeg,.png"
                  maxSizeMB={20}
                  className={loading ? "pointer-events-none opacity-50" : ""}
                >
                  {loading && (
                    <div className="text-center">
                      <div className="animate-spin mx-auto h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
                      <p className="text-foreground font-medium">Processing upload...</p>
                      <p className="text-sm text-muted-foreground">This may take a few moments</p>
                    </div>
                  )}
                </FileUpload>
              </TabsContent>

              <TabsContent value="certid" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Enter Certificate ID
                  </h3>
                  <p className="text-muted-foreground">
                    If you have the certificate ID, enter it below for instant verification
                  </p>
                </div>

                <form onSubmit={handleCertIdSubmit} className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="certId">Certificate ID</Label>
                    <Input
                      id="certId"
                      type="text"
                      placeholder="e.g., VSSUT/2020/BTECH/12345"
                      value={certId}
                      onChange={(e) => setCertId(e.target.value)}
                      className="font-mono"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the unique certificate identifier from the document
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="verify"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify Certificate'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg max-w-md mx-auto">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Demo Certificate IDs:</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p><code className="bg-success-light px-1 rounded">VSSUT/2020/BTECH/12345</code> - Verified</p>
                    <p><code className="bg-warning-light px-1 rounded">FAKE/2020/BTECH/99999</code> - Suspicious</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qr" className="space-y-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Scan QR Code
                  </h3>
                  <p className="text-muted-foreground">
                    Use your device camera to scan the QR code on the certificate
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-muted/30 border-2 border-dashed border-border-light rounded-lg p-12 mb-6">
                    <QrCode className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      QR code scanner will appear here
                    </p>
                    <Button variant="outline" onClick={handleQRScan}>
                      Launch QR Scanner
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Position the QR code within the camera frame for automatic scanning
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}