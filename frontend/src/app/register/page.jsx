"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import Image from "next/image"

const Register = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "PASSENGER",
    aadharNumber: "",
  })

  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage("")
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:5000/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      setMessage(res.data.message)
      localStorage.setItem("verifyEmail", formData.email)
      router.push("/Verify")
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "2rem 1rem",
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      >
        <Image
          src="/assets/register.jpg"
          alt="Registration background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(2px)",
          }}
        />
      </div>

      {/* Registration Form */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: "1rem",
          padding: "2.5rem",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(16px)",
          transform: "translateY(0)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: "700",
            textAlign: "center",
            color: "#1e293b",
            marginBottom: "0.5rem",
            letterSpacing: "-0.025em",
          }}
        >
          Create an Account
        </h2>

        <p
          style={{
            fontSize: "1rem",
            textAlign: "center",
            color: "#64748b",
            marginBottom: "2rem",
          }}
        >
          Join RideShare today and start your journey
        </p>

        {message && (
          <div
            style={{
              backgroundColor: "rgba(22, 163, 74, 0.1)",
              color: "#16a34a",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              borderLeft: "4px solid #16a34a",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {message}
          </div>
        )}

        {error && (
          <div
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.1)",
              color: "#dc2626",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              fontSize: "0.875rem",
              textAlign: "center",
              borderLeft: "4px solid #dc2626",
              animation: "slideIn 0.3s ease-out",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "0.5rem",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5e1",
                backgroundColor: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "0.5rem",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5e1",
                backgroundColor: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#334155",
                marginBottom: "0.5rem",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5e1",
                backgroundColor: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
              }}
              placeholder="••••••••"
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                marginTop: "0.5rem",
              }}
            >
              Password must be at least 8 characters long
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "0.5rem",
                }}
              >
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1rem",
                }}
              >
                <option value="PASSENGER">Passenger</option>
                <option value="DRIVER">Driver</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#334155",
                  marginBottom: "0.5rem",
                }}
              >
                Aadhar Number
              </label>
              <input
                type="text"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  fontSize: "1rem",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
                placeholder="XXXX-XXXX-XXXX"
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              id="terms"
              required
              style={{
                width: "1rem",
                height: "1rem",
                accentColor: "#2563eb",
              }}
            />
            <label
              htmlFor="terms"
              style={{
                fontSize: "0.875rem",
                color: "#475569",
              }}
            >
              I agree to the{" "}
              <a
                href="#"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                style={{
                  color: "#2563eb",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              border: "none",
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: loading ? "0.7" : "1",
              boxShadow: "0 4px 6px rgba(37, 99, 235, 0.25)",
            }}
          >
            {loading ? (
              <div
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "white",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }}
              ></div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p
          style={{
            marginTop: "2rem",
            fontSize: "0.875rem",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Already have an account?{" "}
          <a
            href="/Signin"
            style={{
              color: "#2563eb",
              fontWeight: "600",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
          >
            Sign in
          </a>
        </p>
      </div>

      {/* Add keyframes for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        input:focus, select:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        button:hover:not(:disabled) {
          background-color: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 6px 10px rgba(37, 99, 235, 0.3);
        }
        button:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.25);
        }
        @media (max-width: 640px) {
          form > div:nth-child(4) {
            flex-direction: column;
            gap: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}

export default Register
