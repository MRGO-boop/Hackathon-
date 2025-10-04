import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });
  const [signupForm, setSignupForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    
    setIsLoading(true);
    setError("");
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      alert("Login functionality will be connected to backend!");
    }, 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.first_name || !signupForm.last_name || !signupForm.email || !signupForm.password) return;
    if (signupForm.password !== signupForm.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      alert("Registration functionality will be connected to backend!");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">F</span>
            </div>
            <h1 className="text-3xl font-bold text-indigo-600">FinXpense</h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900">
              Take Control of Your Finances
            </h2>
            <p className="text-lg text-gray-600 max-w-md">
              Track expenses, analyze spending patterns, and make informed financial decisions with our intuitive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
              <h3 className="font-semibold text-gray-900">Secure</h3>
              <p className="text-sm text-gray-600">Bank-level security</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="w-8 h-8 bg-green-600 rounded mx-auto mb-2"></div>
              <h3 className="font-semibold text-gray-900">Personal</h3>
              <p className="text-sm text-gray-600">Tailored insights</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-white/50 backdrop-blur-sm">
              <div className="w-8 h-8 bg-purple-600 rounded mx-auto mb-2"></div>
              <h3 className="font-semibold text-gray-900">Connected</h3>
              <p className="text-sm text-gray-600">Multi-device sync</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md mx-auto">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle>Welcome</CardTitle>
              <CardDescription>
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup" className="space-y-4">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input
                          id="first_name"
                          type="text"
                          placeholder="John"
                          value={signupForm.first_name}
                          onChange={(e) => setSignupForm({ ...signupForm, first_name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input
                          id="last_name"
                          type="text"
                          placeholder="Doe"
                          value={signupForm.last_name}
                          onChange={(e) => setSignupForm({ ...signupForm, last_name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={signupForm.role}
                        onChange={(e) => setSignupForm({ ...signupForm, role: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      >
                        <option value="employee">Employee</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>

                  <p className="text-xs text-center text-gray-600">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-gray-600 mt-6">
            Secure authentication powered by industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}
