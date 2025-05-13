import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  PieChart,
  BarChart2,
  User,
  Calendar,
  CheckCircle,
  ListTodo,
} from "lucide-react";

interface TaskStatistics {
  totalTasks: number;
  completedTasks: number;
  categoryCounts: {
    name: string;
    count: number;
    color: string;
  }[];
}

interface UserInfo {
  username: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
}

interface ProfileViewProps {
  userInfo?: UserInfo;
  taskStats?: TaskStatistics;
}

const ProfileView = ({
  userInfo = {
    username: "John Doe",
    email: "john.doe@example.com",
    createdAt: "2023-01-15",
    avatarUrl: undefined,
  },
  taskStats = {
    totalTasks: 24,
    completedTasks: 18,
    categoryCounts: [
      { name: "Work", count: 10, color: "#7C3AED" },
      { name: "Personal", count: 8, color: "#10B981" },
      { name: "Shopping", count: 4, color: "#F59E0B" },
      { name: "Health", count: 2, color: "#EF4444" },
      { name: "Education", count: 3, color: "#3B82F6" },
      { name: "Entertainment", count: 2, color: "#EC4899" },
    ],
  },
}: ProfileViewProps) => {
  const completionPercentage =
    taskStats.totalTasks > 0
      ? Math.round((taskStats.completedTasks / taskStats.totalTasks) * 100)
      : 0;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-background">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userInfo.avatarUrl} alt={userInfo.username} />
            <AvatarFallback className="text-lg">
              {userInfo.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{userInfo.username}</CardTitle>
            <CardDescription>{userInfo.email}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>
              Account created on{" "}
              {new Date(userInfo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Task Overview
            </CardTitle>
            <CardDescription>Summary of your task progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Tasks</span>
                  <span className="text-sm font-medium">
                    {taskStats.totalTasks}
                  </span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Completed Tasks</span>
                  <span className="text-sm font-medium">
                    {taskStats.completedTasks} ({completionPercentage}%)
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-medium">Task Completion Rate</span>
                </div>
                <div className="text-3xl font-bold">
                  {completionPercentage}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Tasks by Category
            </CardTitle>
            <CardDescription>
              Distribution of tasks across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {taskStats.categoryCounts.map((category, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-sm font-medium">
                        {category.name}
                      </span>
                    </div>
                    <span className="text-sm">{category.count} tasks</span>
                  </div>
                  <Progress
                    value={(category.count / taskStats.totalTasks) * 100}
                    className="h-2"
                    style={{ backgroundColor: `${category.color}20` }} // Light version of the color
                  />
                </div>
              ))}

              <div className="pt-4 flex justify-center">
                <div className="flex flex-wrap gap-3 justify-center">
                  {taskStats.categoryCounts.map((category, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs">{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileView;
