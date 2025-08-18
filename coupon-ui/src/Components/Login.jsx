import { useState, useContext, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import userContext from "../Utility/UserContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setUser } = useContext(userContext);
  const navigate = useNavigate();

  // Check existing login state
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
        navigate("/main/home");
      }
    } else {
      const savedUsername = localStorage.getItem("username");
      if (savedUsername) setUsername(savedUsername);
    }
  }, [setUser, navigate]);

  // Animate progress while loading
  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const timer = setInterval(() => {
        setProgress((prev) => {
          // slowly increment until ~90%
          if (prev >= 90) return prev;
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(timer);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const loginRequest = useCallback(async (url) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error("Login request failed:", err);
      toast.error("Login request failed. Please try again.");
      return null;
    }
  }, [username, password]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      let data =
        (await loginRequest("/api/Login")) ||
        (await loginRequest("/API/login"));

      if (!data || data.isSuccess === false) {
        const errorMessage =
          data?.errorMessages?.join(", ") ||
          "Login failed. Please check your credentials.";
        toast.error(errorMessage);

        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        return;
      }

      setUser(data.result);
      localStorage.setItem("user", JSON.stringify(data.result));

      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.result.token);
      }
      localStorage.setItem("isLoggedIn", "true");

      toast.success("Login successful! Redirecting...");
      setProgress(100);

      setTimeout(() => {
        setIsLoading(false);
        navigate("/main/home");
      }, 800);

    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      // If login fails quickly, allow animation to finish gracefully
      setTimeout(() => setIsLoading(false), 500);
    }
  }, [username, password, rememberMe, loginRequest, setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-md border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-between items-center pb-5">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>
              <a href="#" className="text-sm text-primary underline">
                Forgot password?
              </a>
            </div>
          </CardContent>

          <CardFooter>
            {isLoading ? (
              <div className="flex flex-col items-center w-full">
                <Progress value={progress} className="w-full" />
                <p className="text-sm mt-2 text-gray-500">Signing in...</p>
              </div>
            ) : (
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
