import { Logo } from "@/components/logo";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="hover:opacity-75 transition-opacity">
                <Logo size="md" variant="light" showText={true} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          <h1>Terms of Service</h1>
          <p className="text-slate-600 text-lg">Effective Date: January 1, 2024</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Career Guard (&quot;Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Career Guard provides AI-powered career risk assessment tools and related services to help users understand the potential impact of artificial intelligence on their careers. Our services include:
          </p>
          <ul>
            <li>AI career replacement risk analysis</li>
            <li>Personalized career assessment reports</li>
            <li>Industry and capability tracking tools</li>
            <li>Career guidance and recommendations</li>
          </ul>

          <h2>3. User Accounts</h2>
          
          <h3>3.1 Account Registration</h3>
          <p>
            To access certain features of our Service, you may be required to create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
          </p>

          <h3>3.2 Account Security</h3>
          <p>
            You are responsible for safeguarding the password and for maintaining the confidentiality of your account. You agree not to disclose your password to any third party and to take sole responsibility for activities that occur under your account.
          </p>

          <h2>4. Acceptable Use</h2>
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Infringe upon the rights of others</li>
            <li>Distribute spam, malware, or other harmful content</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use automated scripts or bots without permission</li>
            <li>Reverse engineer or attempt to extract source code</li>
          </ul>

          <h2>5. Intellectual Property</h2>
          
          <h3>5.1 Our Content</h3>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Career Guard and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>

          <h3>5.2 User Content</h3>
          <p>
            You retain ownership of any content you submit to our Service. However, by submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, modify, and display such content solely for the purpose of providing our services.
          </p>

          <h2>6. Privacy</h2>
          <p>
            Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
          </p>

          <h2>7. Disclaimers</h2>
          
          <h3>7.1 Service Availability</h3>
          <p>
            We strive to maintain the Service, but we cannot guarantee 100% uptime. The Service is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind.
          </p>

          <h3>7.2 Assessment Accuracy</h3>
          <p>
            Our AI assessments are based on current data and algorithms and are provided for informational purposes only. We do not guarantee the accuracy of predictions or recommendations. Users should use their own judgment when making career decisions.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            In no event shall Career Guard, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses, resulting from your use of the Service.
          </p>

          <h2>9. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
          </p>

          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which Career Guard operates, without regard to its conflict of law provisions.
          </p>

          <h2>12. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p>
            <strong>Career Guard</strong><br/>
            Email: legal@careerguard.me<br/>
            Website: careerguard.me
          </p>

          <h2>13. Severability</h2>
          <p>
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law.
          </p>

          <h2>14. Entire Agreement</h2>
          <p>
            These Terms constitute the entire agreement between you and Career Guard regarding the use of the Service, superseding any prior agreements between you and Career Guard relating to your use of the Service.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" variant="dark" showText={true} />
            </div>
            <p className="text-slate-300 mb-4">
              Protecting careers in the age of artificial intelligence
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 