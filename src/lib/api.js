// Mock API client for NAVS system
// Replace with real backend endpoints in production

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';
const OTP_MODE = process.env.REACT_APP_OTPMODE === 'true';

// Simulate network delay
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
const mockUsers = {
  'verifier@example.com': { 
    id: 'ver_001', 
    name: 'John Verifier', 
    role: 'verifier', 
    company: 'TechCorp Solutions',
    status: 'approved'
  },
  'registrar@vssut.ac.in': { 
    id: 'inst_001', 
    name: 'Dr. Sarah Registrar', 
    role: 'institution', 
    institution: 'VSSUT',
    status: 'approved'
  },
  'admin@navs.gov.in': { 
    id: 'admin_001', 
    name: 'Admin User', 
    role: 'admin',
    status: 'approved'
  },
  'student@example.com': { 
    id: 'std_001', 
    name: 'Amit Verma', 
    role: 'student',
    status: 'active'
  }
};

const mockCertificates = [
  {
    _id: "cert_60a7f2c8f3b2f9001a2b3c4d",
    institutionId: "inst_001",
    certId: "VSSUT/2020/BTECH/12345",
    studentName: "Amit Verma",
    rollNumber: "2402081067",
    course: "B.Tech Computer Science",
    yearOfPassing: 2024,
    marks: "8.2/10",
    issueDate: "2024-06-15",
    certHash: "SHA256:abcd1234efgh5678ijkl9012mnop3456",
    templateId: "tmpl_2020_cs",
    status: "VERIFIED",
    createdAt: "2024-07-01T10:00:00Z"
  },
  {
    _id: "cert_60a7f2c8f3b2f9001a2b3c4e",
    institutionId: "inst_001",
    certId: "VSSUT/2020/BTECH/12346",
    studentName: "Priya Sharma",
    rollNumber: "2402081068",
    course: "B.Tech Electrical Engineering",
    yearOfPassing: 2024,
    marks: "9.1/10",
    issueDate: "2024-06-15",
    certHash: "SHA256:wxyz7890abcd1234efgh5678ijkl9012",
    templateId: "tmpl_2020_ee",
    status: "VERIFIED",
    createdAt: "2024-07-01T10:00:00Z"
  }
];

const mockVerificationHistory = [
  {
    id: "ver_001_001",
    date: "2024-01-15",
    candidateName: "Amit Verma",
    certId: "VSSUT/2020/BTECH/12345",
    institution: "VSSUT",
    status: "VERIFIED",
    confidenceScore: 95,
    verifierId: "ver_001"
  },
  {
    id: "ver_001_002",
    date: "2024-01-14",
    candidateName: "Rajesh Kumar",
    certId: "FAKE/2020/BTECH/99999",
    institution: "Unknown",
    status: "SUSPECT",
    confidenceScore: 23,
    verifierId: "ver_001"
  }
];

const mockVerifiers = [
  {
    id: "ver_002",
    name: "Alice Johnson",
    email: "alice@corporatehr.com",
    company: "Corporate HR Solutions",
    status: "pending",
    applicationDate: "2024-01-10"
  },
  {
    id: "ver_003",
    name: "Bob Smith", 
    email: "bob@recruitco.com",
    company: "RecruitCo",
    status: "approved",
    applicationDate: "2024-01-05"
  }
];

// API functions
export const api = {
  // Authentication
  async login(email, password) {
    await delay(800);
    const user = mockUsers[email];
    if (user) {
      if (OTP_MODE) {
        return { status: 'otp_required', email };
      }
      return { status: 'success', user, token: 'mock_jwt_token' };
    }
    throw new Error('Invalid credentials');
  },

  async verifyOTP(email, otp) {
    await delay(500);
    if (otp === '123456') {
      const user = mockUsers[email];
      return { status: 'success', user, token: 'mock_jwt_token' };
    }
    throw new Error('Invalid OTP');
  },

  async register(userData) {
    await delay(1000);
    const newUser = {
      id: `${userData.role}_${Date.now()}`,
      ...userData,
      status: 'pending'
    };
    return { status: 'success', user: newUser };
  },

  // Verification
  async uploadForVerification(file, verifierId) {
    await delay(2000);
    const jobId = `job_${Date.now()}`;
    
    // Simulate different outcomes based on filename
    if (file.name.includes('fake') || file.name.includes('tampered')) {
      return {
        jobId,
        status: 'processing',
        result: {
          result: "SUSPECT",
          confidenceScore: 46,
          matchedRecord: null,
          aiFlags: [
            { 
              type: "signature_mismatch", 
              detail: "Signature does not match golden template (SIFT similarity 0.34)" 
            },
            { 
              type: "grade_altered", 
              detail: "Detected pixel manipulation in marks table (edge artifacts)" 
            }
          ],
          blockchain: { exists: false },
          ocrData: {
            pages: 1,
            text: "VSSUT\nThis is to certify that Rajesh Kumar ... Roll: 9999999 ...",
            fields: {
              name: { value: "Rajesh Kumar", confidence: 0.98 },
              roll: { value: "9999999", confidence: 0.99 },
              course: { value: "B.Tech Computer Science", confidence: 0.96 },
              year: { value: "2020", confidence: 0.95 }
            }
          }
        }
      };
    }

    // Default to verified
    return {
      jobId,
      status: 'processing',
      result: {
        result: "VERIFIED",
        confidenceScore: 92,
        matchedRecord: mockCertificates[0],
        aiFlags: [],
        blockchain: { exists: true, txHash: "0xabc123def456..." },
        ocrData: {
          pages: 1,
          text: "VSSUT\nThis is to certify that Amit Verma ... Roll: 2402081067 ...",
          fields: {
            name: { value: "Amit Verma", confidence: 0.98 },
            roll: { value: "2402081067", confidence: 0.99 },
            course: { value: "B.Tech Computer Science", confidence: 0.96 },
            year: { value: "2024", confidence: 0.95 }
          }
        }
      }
    };
  },

  async getVerificationJob(jobId) {
    await delay(500);
    return { status: 'completed', jobId };
  },

  async getVerificationHistory(verifierId) {
    await delay(500);
    return mockVerificationHistory.filter(v => v.verifierId === verifierId);
  },

  // Institution
  async bulkUpload(csvFile, zipFile, institutionId) {
    await delay(3000);
    const jobId = `bulk_${Date.now()}`;
    return {
      jobId,
      status: 'queued',
      totalRecords: 150,
      processedRecords: 0
    };
  },

  async uploadTemplate(templateData, institutionId) {
    await delay(1000);
    return {
      templateId: `tmpl_${Date.now()}`,
      status: 'success',
      ...templateData
    };
  },

  async getInstitutionDashboard(institutionId) {
    await delay(500);
    return {
      totalCertificates: 1247,
      verifiedCertificates: 1201,
      suspiciousCertificates: 12,
      lastUploadDate: "2024-01-15",
      alerts: [
        {
          id: "alert_001",
          type: "suspicious",
          message: "Certificate with your institution name flagged as suspicious",
          date: "2024-01-14",
          certId: "FAKE/VSSUT/2020/12345"
        }
      ]
    };
  },

  // Admin
  async getVerifiers() {
    await delay(500);
    return mockVerifiers;
  },

  async approveVerifier(verifierId) {
    await delay(800);
    return { status: 'success', verifierId };
  },

  async rejectVerifier(verifierId) {
    await delay(800);
    return { status: 'success', verifierId };
  },

  async getInstitutions() {
    await delay(500);
    return [
      {
        id: "inst_002",
        name: "IIT Delhi",
        status: "pending",
        applicationDate: "2024-01-12",
        contactEmail: "registrar@iitd.ac.in"
      }
    ];
  },

  async getFraudAnalytics() {
    await delay(500);
    return {
      verificationsToday: 47,
      suspiciousThisMonth: 23,
      topInstitutions: [
        { name: "VSSUT", verifications: 156 },
        { name: "NIT Rourkela", verifications: 89 },
        { name: "IIT Bhubaneswar", verifications: 67 }
      ],
      blacklistedCertificates: 15
    };
  },

  // Student
  async getStudentVault(studentId) {
    await delay(500);
    return [
      {
        id: "vault_001",
        certId: "VSSUT/2020/BTECH/12345",
        name: "B.Tech Computer Science Degree",
        institution: "VSSUT",
        issueDate: "2024-06-15",
        verified: true,
        thumbnail: "/api/placeholder/200/150"
      }
    ];
  },

  async generateShareLink(certId, expiryDays) {
    await delay(500);
    return {
      shareLink: `https://navs.gov.in/verify/shared/${certId}?token=abc123def456`,
      expiryDate: new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()
    };
  }
};

export default api;