import { Logo } from "@/components/logo";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          <h1>Privacy Policy</h1>
          <p className="text-slate-600 text-lg">Effective Date: January 1, 2024</p>

          <h2>1. Introduction</h2>
          <p>
            Career Guard ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website careerguard.me and use our AI career risk assessment services.
          </p>

          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Personal Information</h3>
          <p>We may collect personal information that you voluntarily provide, including:</p>
          <ul>
            <li>Name and email address</li>
            <li>Professional information (job title, industry, experience level)</li>
            <li>Resume or career profile data</li>
            <li>Assessment responses and preferences</li>
          </ul>

          <h3>2.2 Usage Information</h3>
          <p>We automatically collect information about your interaction with our services:</p>
          <ul>
            <li>IP address and device information</li>
            <li>Browser type and version</li>
            <li>Pages visited and time spent on our site</li>
            <li>Referring websites and search terms</li>
          </ul>

          <h3>2.3 Cookies and Tracking Technologies</h3>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie preferences through your browser settings.
          </p>

          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Provide AI-powered career risk assessments</li>
            <li>Generate personalized reports and recommendations</li>
            <li>Communicate with you about our services</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>We do not sell, trade, or rent your personal information. We may share information in these circumstances:</p>
          <ul>
            <li>With your explicit consent</li>
            <li>With service providers who assist in operating our platform</li>
            <li>To comply with legal requirements or court orders</li>
            <li>To protect our rights, property, or safety</li>
          </ul>

          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, or resolve disputes.
          </p>

          <h2>7. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate data</li>
            <li>Delete your information</li>
            <li>Restrict processing</li>
            <li>Data portability</li>
            <li>Object to processing</li>
          </ul>

          <h2>8. Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children under 18.
          </p>

          <h2>10. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of any material changes by posting the new policy on our website and updating the effective date.
          </p>

          <h2>12. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or our privacy practices, please contact us at:
          </p>
          <p>
            <strong>Career Guard</strong><br/>
            Email: privacy@careerguard.me<br/>
            Website: careerguard.me
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