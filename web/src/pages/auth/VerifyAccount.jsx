import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, LogoVertical } from "../../components/ui";
import { useAuth } from "../../stateManagement/contexts/AuthContext";

const CODE_LENGTH = 6;

const VerifyAccount = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const { verifyAccount, resendVerification } = useAuth();
  // Handle input change for each code box
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const newCode = [...code];
    newCode[idx] = val[0];
    setCode(newCode);
    // Move to next input
    if (idx < CODE_LENGTH - 1 && val) {
      document.getElementById(`code-input-${idx + 1}`).focus();
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      document.getElementById(`code-input-${idx - 1}`).focus();
    }
  };

  // Submit code
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const codeStr = code.join("");
      const res = await verifyAccount(email, codeStr);
      if (res.success) {
        // Redirect to login or dashboard
        navigate("/login");
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend code
  const handleResend = async () => {
    setResendMsg("");
    setError("");
    try {
      const res = await resendVerification(email);
      if (res.success) {
        setResendMsg("A new code has been sent to your email.");
      } else {
        setError("Failed to resend code. Please try again later.");
      }
    } catch {
      setError("Failed to resend code. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="max-w-md w-full p-8 flex flex-col items-center">
        {/* Bus icon */}
        <div className="mb-4">
          {/* Replace with your SVG or logo */}
          <LogoVertical />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-2">
          Verify Your Account
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Enter the code sent to{" "}
          <span className="font-medium">
            {email.replace(/(.{2}).+(@.+)/, "$1*****$2")}
          </span>
        </p>
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="flex gap-3 mb-4">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`code-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 text-2xl text-center border-2 border-green-300 rounded-lg bg-green-50 focus:outline-none focus:border-accent transition"
                value={digit}
                onChange={(e) => handleChange(e, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                autoFocus={idx === 0}
              />
            ))}
          </div>
          {error && <p className="text-error text-sm mb-2">{error}</p>}
          {resendMsg && (
            <p className="text-green-600 text-sm mb-2">{resendMsg}</p>
          )}
          <div className="mb-6 text-center text-gray-500 text-sm">
            Didn't receive the email?{" "}
            <button
              type="button"
              className="text-accent font-medium hover:underline"
              onClick={handleResend}
              disabled={loading}
            >
              Click to resend
            </button>
          </div>
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="button"
              additionalClasses="w-32 bg-white border border-gray-300 text-gray-700"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back
            </Button>
            <Button type="submit" additionalClasses="w-32" isLoading={loading}>
              Continue
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
