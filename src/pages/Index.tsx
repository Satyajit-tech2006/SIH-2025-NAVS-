import { Link } from 'react-router-dom';
import { Shield, CheckCircle, FileSearch, Lock, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/Layout';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 p-4 rounded-2xl">
                <Shield className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Illuminating the truth
              <br />
              <span className="text-white/90">in academia</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Secure, blockchain-anchored verification system for academic credentials. 
              Trusted by institutions, relied upon by employers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="default" 
                className="bg-white text-gov-blue hover:bg-white/90 text-lg px-8 py-4"
                asChild
              >
                <Link to="/verifier/verify">
                  <FileSearch className="mr-2 h-5 w-5" />
                  Verify Certificate
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
                asChild
              >
                <Link to="/register">
                  <Users className="mr-2 h-5 w-5" />
                  Join as Institution
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose NAVS?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets government-grade security for foolproof academic verification
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-verification transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="bg-success-light p-4 rounded-2xl w-fit mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Instant Verification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload and verify academic certificates in seconds with AI-powered OCR 
                  and blockchain validation
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-verification transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="bg-warning-light p-4 rounded-2xl w-fit mx-auto mb-6">
                  <Lock className="h-8 w-8 text-warning" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Tamper Detection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced AI algorithms detect digital manipulation, forged signatures, 
                  and altered grades with 99.2% accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-verification transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="bg-gov-blue-light p-4 rounded-2xl w-fit mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-gov-blue" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">Legacy Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seamlessly integrate historical certificates with bulk upload 
                  and golden template matching
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How NAVS Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to secure, verified academic credentials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Institution Uploads</h3>
              <p className="text-muted-foreground">
                Educational institutions securely upload certificates with digital templates, 
                seals, and signatures to our blockchain-anchored database
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Blockchain Anchoring</h3>
              <p className="text-muted-foreground">
                Each certificate receives a unique cryptographic hash that's anchored 
                to the blockchain, ensuring immutable verification records
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Instant Verification</h3>
              <p className="text-muted-foreground">
                Employers and verifiers can instantly check certificate authenticity 
                with confidence scores and detailed mismatch analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Academic Verification?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of institutions and employers who trust NAVS for secure, 
            reliable academic credential verification
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="default"
              className="bg-white text-gov-blue hover:bg-white/90 text-lg px-8"
              asChild
            >
              <Link to="/register">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8"
              asChild
            >
              <Link to="/demo">
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
