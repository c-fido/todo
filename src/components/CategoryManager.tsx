import React, { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface Category {
  id: string;
  name: string;
  color: string;
}

interface CategoryManagerProps {
  categories?: Category[];
  onAddCategory?: (category: Omit<Category, "id">) => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (id: string) => void;
}

const COLORS = [
  "#FF5733", // Red
  "#33FF57", // Green
  "#3357FF", // Blue
  "#FF33A8", // Pink
  "#33FFF6", // Cyan
  "#F6FF33", // Yellow
  "#A833FF", // Purple
  "#FF8C33", // Orange
  "#FF3366", // Bright Pink
  "#66FF33", // Lime Green
  "#33CCFF", // Sky Blue
  "#FF9933", // Amber
];

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories = [
    { id: "1", name: "Work", color: "#FF5733" },
    { id: "2", name: "Personal", color: "#33FF57" },
    { id: "3", name: "Shopping", color: "#3357FF" },
  ],
  onAddCategory = () => {},
  onEditCategory = () => {},
  onDeleteCategory = () => {},
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory({ name: newCategory.trim(), color: selectedColor });
      setNewCategory("");
      setSelectedColor(COLORS[0]);
    }
  };

  const handleEditCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      onEditCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  const confirmDeleteCategory = (id: string) => {
    setCategoryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      onDeleteCategory(categoryToDelete);
      setCategoryToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <div className="bg-background p-6 rounded-lg w-full">
      <Card>
        <CardHeader>
          <CardTitle>Category Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add new category */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Add New Category</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-grow"
                />
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full ${selectedColor === color ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
                <Button onClick={handleAddCategory}>Add</Button>
              </div>
            </div>

            {/* Category list */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    {editingCategory?.id === category.id ? (
                      <div className="flex flex-1 items-center gap-2">
                        <Input
                          value={editingCategory.name}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              name: e.target.value,
                            })
                          }
                          className="flex-grow"
                        />
                        <div className="flex gap-1">
                          {COLORS.map((color) => (
                            <button
                              key={color}
                              className={`w-6 h-6 rounded-full ${editingCategory.color === color ? "ring-2 ring-primary ring-offset-1" : ""}`}
                              style={{ backgroundColor: color }}
                              onClick={() =>
                                setEditingCategory({
                                  ...editingCategory,
                                  color,
                                })
                              }
                              aria-label={`Select color ${color}`}
                            />
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleEditCategory}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingCategory(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => confirmDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Empty state */}
            {categories.length === 0 && (
              <div className="text-center p-8 border border-dashed rounded-md">
                <p className="text-muted-foreground">No categories yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add a category to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this category. Any tasks assigned to
              this category will be unassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
