import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import userContext from "../Utility/UserContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from '../assets/Loader.gif';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useContext(userContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const loginRequest = async (url) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      return res.ok ? res.json() : null;
    };

    let data = await loginRequest('/api/Login') || await loginRequest('/API/login');

    if (!data || data.isSuccess === false) {
      alert(data?.errorMessages?.join(', ') || 'Login failed');
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setIsLoading(false);
      return;
    }

    setUser(data.result);
    localStorage.setItem('user', JSON.stringify(data.result));
    if (rememberMe) {
      localStorage.setItem('username', username);
      localStorage.setItem('token', data.result.token);
    }
    localStorage.setItem('isLoggedIn', true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/main/home");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card className="w-full max-w-md border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked)}
              />
              <Label htmlFor="remember" className="text-sm">Remember me</Label>
            </div>
            <a href="#" className="text-sm text-primary underline">Forgot password?</a>
          </div>
        </CardContent>

        <CardFooter>
          {isLoading ? (
            <div className="flex justify-center">
              <img width="30px" alt="Loading" src={Loader} />
            </div>
          ) : (
            <Button className="w-full" onClick={handleLogin}>Sign In</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
