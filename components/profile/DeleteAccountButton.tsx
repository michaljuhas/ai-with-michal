"use client";

import { useState, useRef, useEffect } from "react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type Phase = "idle" | "confirming" | "deleting" | "error";

export default function DeleteAccountButton() {
  const { signOut } = useClerk();
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Open/close the native dialog when phase changes
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (phase === "confirming" || phase === "deleting" || phase === "error") {
      if (!el.open) el.showModal();
    } else {
      if (el.open) el.close();
    }
  }, [phase]);

  // Close on backdrop click (native <dialog> fires "cancel" on Escape too)
  function handleDialogCancel(e: React.SyntheticEvent) {
    e.preventDefault();
    if (phase !== "deleting") setPhase("idle");
  }

  async function handleConfirm() {
    setPhase("deleting");
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error ?? "Unknown error");

      // Sign out (session is already invalidated server-side) then go home
      await signOut({ redirectUrl: "/" });
      router.push("/");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setPhase("error");
    }
  }

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setPhase("confirming")}
        className="text-xs font-medium text-red-500 hover:text-red-700 underline underline-offset-2 transition-colors"
      >
        Delete account
      </button>

      {/* Modal — native <dialog> for accessibility & backdrop */}
      <dialog
        ref={dialogRef}
        onCancel={handleDialogCancel}
        onClick={(e) => {
          // Click on backdrop (outside the inner box) closes the dialog
          if (e.target === dialogRef.current && phase !== "deleting") setPhase("idle");
        }}
        className="backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm rounded-2xl border-0 p-0 shadow-2xl w-full max-w-sm mx-auto"
      >
        <div className="p-6">
          {phase === "error" ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Something went wrong</p>
                  <p className="text-xs text-slate-500 mt-0.5">{errorMsg}</p>
                </div>
              </div>
              <button
                onClick={() => setPhase("idle")}
                className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </>
          ) : (
            <>
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </div>
              </div>

              {/* Copy */}
              <h2 className="text-base font-semibold text-slate-900 text-center mb-1">
                Delete your account?
              </h2>
              <p className="text-sm text-slate-500 text-center mb-5">
                Are you sure? You&apos;ll lose access to all your past workshops and community access. This cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirm}
                  disabled={phase === "deleting"}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {phase === "deleting" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Deleting…
                    </>
                  ) : (
                    "Yes, delete my account"
                  )}
                </button>
                <button
                  onClick={() => setPhase("idle")}
                  disabled={phase === "deleting"}
                  className="w-full rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
