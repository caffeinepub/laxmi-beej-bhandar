import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sprout } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { SECURITY_QUESTIONS } from "../types";

export default function SignupPage() {
  const { signup } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    storeName: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const [securityAnswers, setSecurityAnswers] = useState([
    { question: "", answer: "" },
    { question: "", answer: "" },
    { question: "", answer: "" },
  ]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSecurityChange = (
    idx: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setSecurityAnswers((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.firstName ||
      !form.lastName ||
      !form.phone ||
      !form.storeName ||
      !form.address ||
      !form.password
    ) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.phone.length < 10) {
      setError("Enter a valid 10-digit phone number.");
      return;
    }
    // Validate security questions
    for (let i = 0; i < securityAnswers.length; i++) {
      if (!securityAnswers[i].question) {
        setError(`Please select Security Question ${i + 1}.`);
        return;
      }
      if (!securityAnswers[i].answer.trim()) {
        setError(`Please answer Security Question ${i + 1}.`);
        return;
      }
    }
    const questions = securityAnswers.map((s) => s.question);
    const uniqueQuestions = new Set(questions);
    if (uniqueQuestions.size < questions.length) {
      setError("Please choose 3 different security questions.");
      return;
    }

    const success = signup({
      firstName: form.firstName,
      lastName: form.lastName,
      phone: form.phone,
      storeName: form.storeName,
      address: form.address,
      password: form.password,
      securityAnswers: securityAnswers.map((s) => ({
        question: s.question,
        answer: s.answer.trim().toLowerCase(),
      })),
    });
    if (!success) {
      setError("Phone number already registered. Please login.");
      return;
    }
    toast.success("Account created! Please login.");
    setDone(true);
  };

  if (done) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.22 0.06 148) 0%, oklch(0.32 0.07 148) 100%)",
        }}
      >
        <div className="text-center text-white">
          <p className="text-xl font-display font-bold mb-4">
            Account created!
          </p>
          <Link to="/login" className="underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative py-8"
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
      <div className="relative z-10 bg-white rounded-xl shadow-elevated w-full max-w-md mx-4 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-gold via-amber-400 to-gold" />
        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: "oklch(0.22 0.06 148)" }}
            >
              <Sprout className="w-7 h-7 text-amber-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Laxmi Beej Bhandar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  data-ocid="signup.input"
                  placeholder="Ramesh"
                  value={form.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Kumar"
                  value={form.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                placeholder="Laxmi Beej Bhandar"
                value={form.storeName}
                onChange={(e) => handleChange("storeName", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                data-ocid="signup.textarea"
                placeholder="Shop No. 5, Main Market, Krishi Nagar, Lucknow"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
            </div>

            {/* Security Questions */}
            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-semibold text-foreground mb-1">
                Security Questions
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                These will help you recover your password if you forget it.
              </p>
              {securityAnswers.map((sa, idx) => (
                <div key={sa.question || idx} className="space-y-2 mb-4">
                  <Label>Question {idx + 1}</Label>
                  <Select
                    value={sa.question}
                    onValueChange={(val) =>
                      handleSecurityChange(idx, "question", val)
                    }
                  >
                    <SelectTrigger data-ocid="signup.select">
                      <SelectValue placeholder="Choose a question..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SECURITY_QUESTIONS.map((q) => (
                        <SelectItem key={q} value={q}>
                          {q}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    data-ocid="signup.input"
                    placeholder="Your answer"
                    value={sa.answer}
                    onChange={(e) =>
                      handleSecurityChange(idx, "answer", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            {error && (
              <p
                data-ocid="signup.error_state"
                className="text-destructive text-sm"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-ocid="signup.submit_button"
              className="w-full"
              style={{ background: "oklch(0.52 0.15 33)", color: "white" }}
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium"
              style={{ color: "oklch(0.52 0.15 33)" }}
              data-ocid="signup.link"
            >
              Login here
            </Link>
          </p>
          <Link
            to="/"
            className="flex items-center gap-1 justify-center mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="signup.link"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
