import { SignUp } from "@clerk/nextjs";

export const metadata = {
  title: "Register Free | AI with Michal",
  description: "Create your free account to reserve your workshop seat.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-slate-50">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-100/60 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-blue-600 text-xs font-semibold tracking-widest uppercase">
            Step 1 of 3
          </span>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
            Create Your Free Account
          </h1>
          <p className="mt-2 text-slate-500">
            Register to choose your workshop ticket.
          </p>
        </div>

        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-white border border-slate-200 shadow-md rounded-2xl",
              headerTitle: "text-slate-900",
              headerSubtitle: "text-slate-500",
              formFieldLabel: "text-slate-700",
              formFieldInput:
                "bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-white font-semibold",
              footerActionLink: "text-blue-600 hover:text-blue-700",
              identityPreviewText: "text-slate-700",
              identityPreviewEditButton: "text-blue-600",
              socialButtonsBlockButton:
                "bg-white border-slate-300 text-slate-700 hover:bg-slate-50",
              socialButtonsBlockButtonText: "text-slate-700 font-medium",
              dividerLine: "bg-slate-200",
              dividerText: "text-slate-400",
            },
          }}
          fallbackRedirectUrl="/tickets"
        />
      </div>
    </div>
  );
}
