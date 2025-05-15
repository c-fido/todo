import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface AuthFormProps {
  onSignIn?: (email: string, password: string) => void;
  onSignUp?: (email: string, password: string, username: string) => void;
  isOpen?: boolean;
  error?: string;
  isLoading?: boolean;
}

const AuthForm = ({
  onSignIn = () => {},
  onSignUp = () => {},
  isOpen = true,
  error = "",
  isLoading = false,
}: AuthFormProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { session } = await signIn(email, password);
      if (session) {
        onSignIn(email, password);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError(
        error.message || "Failed to sign in. Please check your credentials.",
      );
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      // After signup, we show a success message but don't automatically sign in
      // as Supabase may require email confirmation depending on settings
      setError("Account created! Please check your email for confirmation.");
    } catch (error) {
      console.error("Sign up error:", error);
      setError(error.message || "Failed to create account. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center w-full h-full bg-background">
      <Card className="w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome</CardTitle>
          <CardDescription className="text-center">
            {activeTab === "signin"
              ? "Sign in to your account"
              : "Create a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="signin"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "signin" | "signup")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          {activeTab === "signin" ? (
            <p>Don't have an account? Click Sign Up above.</p>
          ) : (
            <p>Already have an account? Click Sign In above.</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
