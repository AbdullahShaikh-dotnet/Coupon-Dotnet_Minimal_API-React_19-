import { useState, useContext, useCallback, useMemo } from "react";
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
import Loader from "../assets/Loader.gif";
import { AlertCircleIcon, CheckCircle2Icon, PopcornIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(userContext);
  const [alertState, setAlertState] = useState({
    show: false,
    message: "",
    type: "error",
  });
  const navigate = useNavigate();

  // Memoized form handlers for better performance
  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleRememberMeChange = useCallback((checked) => {
    setRememberMe(checked);
  }, []);

  // Memoized login request function
  const loginRequest = useCallback(async (url) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      return await res.json();
    } catch (error) {
      console.error("Login request failed:", error);
      return null;
    }
  }, [username, password]);

  // Optimized alert display function
  const showAlert = useCallback((message, type = "error") => {
    setAlertState({
      show: true,
      message,
      type,
    });

    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      setAlertState(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!username.trim() || !password.trim()) {
      showAlert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Try both API endpoints
      let data = await loginRequest("/api/Login") || await loginRequest("/API/login");

      if (!data || data.isSuccess === false) {
        const errorMessage = data?.errorMessages?.join(", ") || "Login failed. Please check your credentials.";
        showAlert(errorMessage);
        
        // Clear user data on failed login
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        return;
      }

      // Successful login
      setUser(data.result);
      localStorage.setItem("user", JSON.stringify(data.result));
      
      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.result.token);
      }
      
      localStorage.setItem("isLoggedIn", "true");

      // Show success message briefly before navigation
      showAlert("Login successful! Redirecting...", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        navigate("/main/home");
      }, 1000);

    } catch (error) {
      console.error("Login error:", error);
      showAlert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [username, password, rememberMe, loginRequest, showAlert, setUser, navigate]);

  // Memoized alert component to prevent unnecessary re-renders
  const AlertComponent = useMemo(() => {
    if (!alertState.show) return null;

    const isSuccess = alertState.type === "success";
    const IconComponent = isSuccess ? CheckCircle2Icon : AlertCircleIcon;

    return (
      <Alert 
        variant={isSuccess ? "default" : "destructive"}
        className={`
          fixed top-10 right-8 w-1/5 z-50
          transform transition-all duration-500 ease-in-out
          ${alertState.show 
            ? "translate-x-0 opacity-100 scale-100" 
            : "translate-x-full opacity-0 scale-95"
          }
        `}
      >
        <IconComponent className="h-4 w-4" />
        <AlertTitle>{isSuccess ? 'Success' : 'Login Failed'}</AlertTitle>
        <AlertDescription>
          <p>{alertState.message}</p>
        </AlertDescription>
      </Alert>
    );
  }, [alertState]);

  return (
    <>
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
                  onChange={handleUsernameChange}
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
                  onChange={handlePasswordChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-between items-center pb-5">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={handleRememberMeChange}
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
                <div className="flex justify-center">
                  <img width="30px" alt="Loading" src={Loader} />
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

      {AlertComponent}
    </>
  );
};

export default Login;
