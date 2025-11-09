import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Home as HomeIcon,
  Shield,
  Users,
  Zap,
  LogOut,
  User,
} from "lucide-react";

export default function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out successfully!", {
      icon: "👋",
      duration: 3000,
      style: {
        background: "#22c55e",
        color: "#fff",
        fontWeight: 500,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Toaster position="top-center" />
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HomeIcon className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">UserAuth</span>
          </div>

          {/* Show different navigation based on login status */}
          {user ? (
            // Logged in - Show user info and logout
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm">
                <User className="w-5 h-5 text-indigo-600" />
                <span className="text-gray-700 font-medium">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            // Not logged in - Show login/signup buttons
            <div className="flex gap-4">
              <Link
                to="/login"
                className="px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        {user ? (
          // Logged in - Welcome message
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-100 rounded-full mb-6">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Welcome Back!
            </h1>
            <p className="text-2xl text-gray-700 mb-4">
              Hello,{" "}
              <span className="text-indigo-600 font-semibold">
                {user.email}
              </span>
            </p>
            <p className="text-xl text-gray-600 mb-8">
              You're successfully logged in to your account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="px-8 py-4 bg-white rounded-xl shadow-lg border-2 border-indigo-200">
                <p className="text-sm text-gray-600 mb-1">Account Created</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="px-8 py-4 bg-white rounded-xl shadow-lg border-2 border-indigo-200">
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="text-lg font-semibold text-gray-900 font-mono">
                  {user.id.substring(0, 8)}...
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Not logged in - Default hero
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-6">
              Secure User Authentication
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              A modern, secure, and user-friendly authentication system built
              with React and Express
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border-2 border-indigo-600"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Features - Always show */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Secure
            </h3>
            <p className="text-gray-600">
              Industry-standard encryption and security practices to protect
              your data
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Easy to Use
            </h3>
            <p className="text-gray-600">
              Intuitive interface designed for the best user experience
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Fast</h3>
            <p className="text-gray-600">
              Lightning-fast performance with modern technologies
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600">
        <p>© 2024 UserAuth. Built with React, Express, and MongoDB.</p>
      </footer>
    </div>
  );
}
