import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, Sprout } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";

type ForgotStep = "phone" | "questions" | "reset" | "done";

export default function LoginPage() {
  const {
    login,
    getSecurityQuestions,
    verifySecurityAnswers,
    resetPasswordWithAnswers,
  } = useAuth();
  const router = useRouter();

  // Login state
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Forgot password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState<ForgotStep>("phone");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [securityQuestions, setSecurityQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (phone.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    const success = login(phone, password);
    if (!success) {
      setError("Incorrect phone number or password.");
      return;
    }
    toast.success("Welcome back!");
    router.navigate({ to: "/dashboard" });
  };

  // Step 1: enter phone number
  const handleForgotPhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (forgotPhone.length < 10) {
      setForgotError("Enter a valid 10-digit phone number.");
      return;
    }
    const questions = getSecurityQuestions(forgotPhone);
    if (!questions || questions.length === 0) {
      setForgotError(
        "No account found with this phone number, or security questions were not set up.",
      );
      return;
    }
    setSecurityQuestions(questions);
    setAnswers(questions.map(() => ""));
    setForgotStep("questions");
  };

  // Step 2: answer security questions
  const handleAnswersSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    for (let i = 0; i < answers.length; i++) {
      if (!answers[i].trim()) {
        setForgotError(`Please answer question ${i + 1}.`);
        return;
      }
    }
    const answerPairs = securityQuestions.map((q, i) => ({
      question: q,
      answer: answers[i],
    }));
    const ok = verifySecurityAnswers(forgotPhone, answerPairs);
    if (!ok) {
      setForgotError("One or more answers are incorrect. Please try again.");
      return;
    }
    setForgotStep("reset");
  };

  // Step 3: set new password
  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    if (!newPassword) {
      setForgotError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setForgotError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.");
      return;
    }
    const answerPairs = securityQuestions.map((q, i) => ({
      question: q,
      answer: answers[i],
    }));
    const success = resetPasswordWithAnswers(
      forgotPhone,
      answerPairs,
      newPassword,
    );
    if (!success) {
      setForgotError("Password reset failed. Please try again.");
      return;
    }
    toast.success("Password reset successfully! Please login.");
    setForgotStep("done");
  };

  const resetForgotFlow = () => {
    setShowForgot(false);
    setForgotStep("phone");
    setForgotPhone("");
    setForgotError("");
    setSecurityQuestions([]);
    setAnswers([]);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.22 0.06 148) 0%, oklch(0.32 0.07 148) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url('/assets/generated/mandala-corner-transparent.dim_400x400.png')",
          backgroundSize: "300px",
          backgroundRepeat: "repeat",
        }}
      />
      <div className="relative z-10 bg-white rounded-xl shadow-elevated w-full max-w-sm mx-4 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-gold via-amber-400 to-gold" />
        <div className="p-8">
          {!showForgot ? (
            // LOGIN FORM
            <>
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "oklch(0.22 0.06 148)" }}
                >
                  <Sprout className="w-7 h-7 text-amber-400" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Welcome Back
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Laxmi Beej Bhandar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    data-ocid="login.input"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    autoFocus
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs font-medium hover:underline"
                      style={{ color: "oklch(0.52 0.15 33)" }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    data-ocid="login.input"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                  />
                </div>
                {error && (
                  <p
                    data-ocid="login.error_state"
                    className="text-destructive text-sm"
                  >
                    {error}
                  </p>
                )}
                <Button
                  type="submit"
                  data-ocid="login.primary_button"
                  className="w-full"
                  style={{ background: "oklch(0.52 0.15 33)", color: "white" }}
                >
                  Login
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-5">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  data-ocid="login.link"
                  className="font-medium"
                  style={{ color: "oklch(0.52 0.15 33)" }}
                >
                  Sign up
                </Link>
              </p>
              <Link
                to="/"
                data-ocid="login.link"
                className="flex items-center gap-1 justify-center mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Back to Home
              </Link>
            </>
          ) : (
            // FORGOT PASSWORD FLOW
            <>
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
                  style={{ background: "oklch(0.22 0.06 148)" }}
                >
                  <KeyRound className="w-7 h-7 text-amber-400" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Forgot Password
                </h1>
                <p className="text-muted-foreground text-sm mt-1 text-center">
                  {forgotStep === "phone" &&
                    "Enter your registered phone number"}
                  {forgotStep === "questions" &&
                    "Answer your security questions"}
                  {forgotStep === "reset" && "Set your new password"}
                  {forgotStep === "done" && "Password reset complete"}
                </p>
              </div>

              {/* Step indicator */}
              {forgotStep !== "done" && (
                <div className="flex gap-1 mb-5">
                  {(["phone", "questions", "reset"] as ForgotStep[]).map(
                    (step, i) => (
                      <div
                        key={step}
                        className="flex-1 h-1 rounded-full"
                        style={{
                          background:
                            ["phone", "questions", "reset", "done"].indexOf(
                              forgotStep,
                            ) >= i
                              ? "oklch(0.52 0.15 33)"
                              : "oklch(0.9 0 0)",
                        }}
                      />
                    ),
                  )}
                </div>
              )}

              {forgotStep === "phone" && (
                <form onSubmit={handleForgotPhoneSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="forgotPhone">Phone Number</Label>
                    <Input
                      id="forgotPhone"
                      data-ocid="forgot.input"
                      type="tel"
                      placeholder="9876543210"
                      value={forgotPhone}
                      autoFocus
                      onChange={(e) => {
                        setForgotPhone(e.target.value);
                        setForgotError("");
                      }}
                    />
                  </div>
                  {forgotError && (
                    <p className="text-destructive text-sm">{forgotError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    style={{
                      background: "oklch(0.52 0.15 33)",
                      color: "white",
                    }}
                  >
                    Continue
                  </Button>
                </form>
              )}

              {forgotStep === "questions" && (
                <form onSubmit={handleAnswersSubmit} className="space-y-4">
                  {securityQuestions.map((q, idx) => (
                    <div key={q} className="space-y-1">
                      <Label className="text-sm leading-snug">{q}</Label>
                      <Input
                        data-ocid="forgot.input"
                        placeholder="Your answer"
                        value={answers[idx] ?? ""}
                        onChange={(e) => {
                          const next = [...answers];
                          next[idx] = e.target.value;
                          setAnswers(next);
                          setForgotError("");
                        }}
                      />
                    </div>
                  ))}
                  {forgotError && (
                    <p className="text-destructive text-sm">{forgotError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    style={{
                      background: "oklch(0.52 0.15 33)",
                      color: "white",
                    }}
                  >
                    Verify Answers
                  </Button>
                </form>
              )}

              {forgotStep === "reset" && (
                <form onSubmit={handleResetSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      data-ocid="forgot.input"
                      type="password"
                      placeholder="At least 6 characters"
                      value={newPassword}
                      autoFocus
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setForgotError("");
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirmNewPassword">Confirm Password</Label>
                    <Input
                      id="confirmNewPassword"
                      data-ocid="forgot.input"
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmNewPassword}
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                        setForgotError("");
                      }}
                    />
                  </div>
                  {forgotError && (
                    <p className="text-destructive text-sm">{forgotError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    style={{
                      background: "oklch(0.52 0.15 33)",
                      color: "white",
                    }}
                  >
                    Reset Password
                  </Button>
                </form>
              )}

              {forgotStep === "done" && (
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your password has been reset successfully. You can now login
                    with your new password.
                  </p>
                  <Button
                    className="w-full"
                    style={{
                      background: "oklch(0.52 0.15 33)",
                      color: "white",
                    }}
                    onClick={resetForgotFlow}
                  >
                    Go to Login
                  </Button>
                </div>
              )}

              {forgotStep !== "done" && (
                <button
                  type="button"
                  onClick={resetForgotFlow}
                  className="flex items-center gap-1 justify-center w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" /> Back to Login
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
