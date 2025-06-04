import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Get Your Full Report</h1>
          <p className="text-slate-600">Create your account to unlock detailed AI career insights</p>
        </div>
        
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: "w-full",
              socialButtonsBlockButtonText: "font-medium",
              formButtonPrimary: "w-full bg-primary hover:bg-primary/90",
              footerActionLink: "text-primary hover:text-primary/90"
            }
          }}
          redirectUrl="/auth-callback"
          afterSignUpUrl="/auth-callback"
        />
      </div>
    </div>
  );
} 