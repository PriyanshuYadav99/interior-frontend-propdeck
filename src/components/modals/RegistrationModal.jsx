import React, { useState, useEffect } from "react";
import {
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "../../config/env";

const RegistrationModal = ({
  isOpen,
  onClose,
  onSuccess,
  generatedCount = 0,
  sessionId,
  selectedFlatType,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("US");

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setCountryCode("US");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleClose = () => {
    // ✅ BLOCK CLOSING - User must complete registration
    setError("Please complete registration to continue generating images");
    setTimeout(() => setError(""), 3000);
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    // ✅ VALIDATION
    if (!fullName.trim() || fullName.length < 2) {
      setError("Please enter your full name (minimum 2 characters)");
      setLoading(false);
      return;
    }

    // ✅ EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // ✅ PHONE VALIDATION
    if (!phoneNumber || phoneNumber.length < 10) {
      setError("Please enter a valid phone number (10 digits minimum)");
      setLoading(false);
      return;
    }

    try {
      console.log("[MODAL] Submitting registration...");
      console.log(
        "[MODAL] Using API URL:",
        `${API_BASE_URL}/api/simple-register`,
      );

      // ✅ FIXED: Use Railway URL
      const response = await fetch(`${API_BASE_URL}/api/simple-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim().toLowerCase(),
          phone_number: phoneNumber.trim(),
          country_code: countryCode,
          session_id: sessionId,
          generated_count: generatedCount,
          property_section: selectedFlatType || null,
        }),
      });

      console.log("[MODAL] Response status:", response.status);

      const data = await response.json();
      console.log("[MODAL] Response data:", data);

      if (response.ok && data.success) {
        console.log("[MODAL] Registration successful!", data);

        setSuccess("Registration complete! Redirecting...");

        // ✅ WAIT 1.5 SECONDS TO SHOW SUCCESS MESSAGE
        setTimeout(() => {
          onSuccess({
            user_id: data.user_id,
            name: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phoneNumber.trim(),
            registered: true,
          });
        }, 1500);
      } else {
        console.error("[MODAL] Registration failed:", data);
        setError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("[MODAL] Registration error:", error);
      setError(
        "Failed to register. Please check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: "100%",
    padding: "0.9rem 1rem",
    border: "1.5px solid #E2E5EA",
    borderRadius: "0.85rem",
    fontSize: "0.95rem",
    outline: "none",
    background: "#FFFFFF",
    color: "#111827",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "#F5F7FA",
          borderRadius: "1.5rem",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "440px",
          maxHeight: "95vh",
          overflowY: "auto",
          position: "relative",
          animation: "slideIn 0.3s ease-out",
          margin: "auto",
          padding: "1.75rem",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
              lineHeight: "1.3",
            }}
          >
            🎉 Unlock Your Imagination
          </h2>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              color: "#111827",
              flexShrink: 0,
            }}
            title="Complete registration to close"
          >
            <X size={22} />
          </button>
        </div>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#6B7280",
            lineHeight: "1.5",
            marginBottom: "1.5rem",
          }}
        >
          You've reached your 2 free generations. Enter your details to keep
          creating unlimited, stunning designs.
        </p>

        {/* Full Name */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter fullname"
            disabled={loading || success}
            style={{ ...inputStyle, opacity: loading || success ? 0.6 : 1 }}
            onFocus={(e) => (e.target.style.borderColor = "#101C34")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E5EA")}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: "1.25rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            disabled={loading || success}
            style={{ ...inputStyle, opacity: loading || success ? 0.6 : 1 }}
            onFocus={(e) => (e.target.style.borderColor = "#101C34")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E5EA")}
          />
        </div>

        {/* Phone Number - combined pill */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              fontSize: "0.9rem",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Phone Number
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1.5px solid #E2E5EA",
              borderRadius: "0.85rem",
              background: "#FFFFFF",
              opacity: loading || success ? 0.6 : 1,
            }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                disabled={loading || success}
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  border: "none",
                  background: "transparent",
                  padding: "0.9rem 1.75rem 0.9rem 1rem",
                  fontSize: "0.95rem",
                  color: "#374151",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="US">US</option>
                <option value="IN">IN</option>
                <option value="GB">GB</option>
                <option value="CA">CA</option>
                <option value="AU">AU</option>
              </select>
              <ChevronDown
                size={16}
                style={{
                  position: "absolute",
                  right: "0.5rem",
                  pointerEvents: "none",
                  color: "#6B7280",
                }}
              />
            </div>
            <div
              style={{
                width: "1.5px",
                height: "1.5rem",
                background: "#E2E5EA",
              }}
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter phone number"
              maxLength={15}
              disabled={loading || success}
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                padding: "0.9rem 1rem",
                fontSize: "0.95rem",
                outline: "none",
                color: "#111827",
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.7rem 0.9rem",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.6rem",
              color: "#dc2626",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <AlertCircle size={15} />
            <span style={{ lineHeight: "1.3" }}>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "0.7rem 0.9rem",
              background: "#ecfdf5",
              border: "1px solid #6ee7b7",
              borderRadius: "0.6rem",
              color: "#047857",
              fontSize: "0.8rem",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
            }}
          >
            <CheckCircle size={15} />
            <span style={{ lineHeight: "1.3" }}>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            success ||
            !fullName.trim() ||
            !email.trim() ||
            !phoneNumber
          }
          style={{
            width: "100%",
            background:
              loading ||
              success ||
              !fullName.trim() ||
              !email.trim() ||
              !phoneNumber
                ? "#9CA3AF"
                : "#101C34",
            color: "white",
            padding: "0.9rem",
            borderRadius: "0.85rem",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            cursor:
              loading ||
              success ||
              !fullName.trim() ||
              !email.trim() ||
              !phoneNumber
                ? "not-allowed"
                : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {loading ? (
            <>
              <Loader2
                size={18}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Registering...
            </>
          ) : success ? (
            <>
              <CheckCircle size={18} />
              Success!
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Submit & Continue
            </>
          )}
        </button>

        <p
          style={{
            marginTop: "1.25rem",
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#9CA3AF",
            lineHeight: "1.4",
          }}
        >
          We respect your privacy. Your information is secure and will never be
          shared.
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RegistrationModal;
