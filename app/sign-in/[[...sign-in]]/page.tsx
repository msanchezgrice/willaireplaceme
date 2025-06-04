import { SignIn } from '@clerk/nextjs';

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
          <p className="text-slate-600">Sign in to access your AI career assessment</p>
        </div>
        
        <SignIn
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
          afterSignInUrl="/auth-callback"
        />
      </div>
    </div>
  );
} 