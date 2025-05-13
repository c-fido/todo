import React, { useState } from "react";
import { PlusCircle, Trash2, Edit, CheckCircle, Circle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface TaskListProps {
  tasks?: Task[];
  categories?: Category[];
  onAddTask?: (task: Omit<Task, "id">) => void;
  onUpdateTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onToggleComplete?: (taskId: string, completed: boolean) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks = [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the draft and send for review",
      completed: false,
      categoryId: "1",
    },
    {
      id: "2",
      title: "Buy groceries",
      description: "Milk, eggs, bread, and vegetables",
      completed: true,
      categoryId: "2",
    },
    {
      id: "3",
      title: "Schedule dentist appointment",
      description: "Call Dr. Smith for a checkup",
      completed: false,
      categoryId: "3",
    },
  ],
  categories = [
    { id: "1", name: "Work", color: "bg-violet-600" },
    { id: "2", name: "Personal", color: "bg-emerald-500" },
    { id: "3", name: "Health", color: "bg-red-500" },
    { id: "4", name: "Shopping", color: "bg-amber-500" },
    { id: "5", name: "Education", color: "bg-blue-500" },
    { id: "6", name: "Entertainment", color: "bg-pink-500" },
  ],
  onAddTask = () => {},
  onUpdateTask = () => {},
  onDeleteTask = () => {},
  onToggleComplete = () => {},
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, "id">>({
    title: "",
    description: "",
    completed: false,
    categoryId: "",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = () => {
    onAddTask(newTask);
    setNewTask({
      title: "",
      description: "",
      completed: false,
      categoryId: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditTask = () => {
    if (editingTask) {
      onUpdateTask(editingTask);
      setEditingTask(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleToggleComplete = (taskId: string, completed: boolean) => {
    onToggleComplete(taskId, !completed);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const getCategoryById = (categoryId: string) => {
    return (
      categories.find((category) => category.id === categoryId) || {
        id: "",
        name: "No Category",
        color: "bg-gray-300",
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No tasks yet. Add your first task to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const category = getCategoryById(task.categoryId);
            return (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <button
                        onClick={() =>
                          handleToggleComplete(task.id, task.completed)
                        }
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300" />
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3
                            className={`font-medium ${task.completed ? "line-through text-gray-400" : ""}`}
                          >
                            {task.title}
                          </h3>
                          <Badge className={`${category.color} text-white`}>
                            {category.name}
                          </Badge>
                        </div>
                        <p
                          className={`text-sm text-gray-500 mt-1 ${task.completed ? "line-through" : ""}`}
                        >
                          {task.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Task description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newTask.categoryId}
                onValueChange={(value) =>
                  setNewTask({ ...newTask, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full ${category.color} mr-2`}
                        ></div>
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddTask}
              disabled={!newTask.title || !newTask.categoryId}
            >
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Task title"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  placeholder="Task description"
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editingTask.categoryId}
                  onValueChange={(value) =>
                    setEditingTask({ ...editingTask, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full ${category.color} mr-2`}
                          ></div>
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditTask}
              disabled={!editingTask?.title || !editingTask?.categoryId}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
