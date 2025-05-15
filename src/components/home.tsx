import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { User, LogOut, PieChart, CheckCircle, ListTodo } from "lucide-react";
import TaskList from "./TaskList";
import CategoryManager from "./CategoryManager";
import AuthForm from "./AuthForm";
import ProfileView from "./ProfileView";

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Mock user data - in a real app this would come from authentication
  const user = isAuthenticated
    ? {
        name: "Jane Doe",
        email: "jane@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
      }
    : null;

  // Mock statistics - in a real app this would come from the database
  const stats = {
    totalTasks: 12,
    completedTasks: 5,
    categories: 4,
  };

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setShowProfile(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Task Manager</h1>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setShowProfile(true)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user?.name}</span>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <AuthForm onSignIn={handleSignIn} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 flex gap-4">
        {/* Sidebar with stats */}
        <aside className="w-64 hidden md:block">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Your task statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-muted-foreground" />
                  <span>Total Tasks: {stats.totalTasks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <span>Completed: {stats.completedTasks}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-violet-600" />
                  <span>Categories: {stats.categories}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main content area */}
        <div className="flex-1">
          {isAuthenticated ? (
            <Tabs defaultValue="tasks" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>
              <TabsContent value="tasks">
                <TaskList />
              </TabsContent>
              <TabsContent value="categories">
                <CategoryManager />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to Task Manager</CardTitle>
                <CardDescription>
                  Please sign in to manage your tasks and categories.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <User className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="mb-4">
                    Sign in to access your personalized task dashboard.
                  </p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg">Sign In to Get Started</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <AuthForm onSignIn={handleSignIn} />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Profile Dialog */}
      {isAuthenticated && (
        <Dialog open={showProfile} onOpenChange={setShowProfile}>
          <DialogContent className="sm:max-w-xl">
            <ProfileView
              userInfo={{
                username: userData?.name,
                email: userData?.email,
                createdAt: profile?.created_at || new Date().toISOString(),
                avatarUrl: userData?.avatar,
              }}
              taskStats={{
                totalTasks: stats.totalTasks,
                completedTasks: stats.completedTasks,
                categoryCounts: categories.map((cat) => ({
                  name: cat.name,
                  count: tasks.filter((task) => task.category_id === cat.id)
                    .length,
                  color: cat.color,
                })),
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Home;
