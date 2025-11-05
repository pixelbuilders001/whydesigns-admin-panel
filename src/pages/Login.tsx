"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import logo from "../assets/logo.png"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const { login, isLoading } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success) navigate("/");
    else setError(result.message);
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return toast.error("Please enter your registered email");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to your email");
        setIsForgotModalOpen(false);
        setIsOtpModalOpen(true);
      } else toast.error(data.message || "Failed to send OTP");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter the OTP");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP verified successfully!");
        setShowResetForm(true);
      } else toast.error(data.message || "Invalid OTP");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword)
      return toast.error("Please fill all fields");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successfully!");
        setIsOtpModalOpen(false);
        setShowResetForm(false);
        setOtp("");
        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else toast.error(data.message || "Failed to reset password");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="flex w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Section - Illustration / Branding */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 text-white flex-col justify-center items-center p-10">
        <img
            src={logo}
            alt="login illustration"
            className="w-1/4 mt-8 animate-float"
          />
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-center text-lg opacity-90">
            Manage your platform securely and efficiently.
          </p>
        
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12">
          <Card className="shadow-none border-none">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold text-gray-800">
                Admin Login
              </CardTitle>
              <CardDescription className="text-gray-500">
                Enter your credentials to access the dashboard.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 rounded-xl border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center text-sm">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-xl w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition-all duration-200"
                  >
                    {isLoading ? "Signing in..." : "Login"}
                  </Button>
                </div>
{/* 
                <p className="text-sm text-center mt-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </p> */}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Dialog open={isForgotModalOpen} onOpenChange={setIsForgotModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Label htmlFor="forgotEmail">Enter your registered email</Label>
            <Input
              id="forgotEmail"
              type="email"
              placeholder="you@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button onClick={handleForgotPassword} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* OTP & Reset Password Modal */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showResetForm ? "Reset Password" : "Verify OTP"}
            </DialogTitle>
          </DialogHeader>

          {!showResetForm ? (
            <div className="space-y-4">
              <Label htmlFor="otp">Enter 6-digit OTP</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <DialogFooter>
                <Button onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <DialogFooter>
                <Button onClick={handleResetPassword} disabled={loading}>
                  {loading ? "Submitting..." : "Reset Password"}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
