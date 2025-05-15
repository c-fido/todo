import { supabase } from "./supabaseClient";
import type { Database } from "../types/database.types";

// Ensure supabase is available before making any database calls
const ensureSupabase = () => {
  if (!supabase) {
    throw new Error(
      "Supabase client is not initialized. Check your environment variables.",
    );
  }
  return supabase;
};

// Types for our database entities
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];

// User functions
export async function getCurrentUser() {
  const client = ensureSupabase();
  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const { data } = await client
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return data;
}

export async function updateUserProfile(
  userId: string,
  displayName: string,
  avatarUrl?: string,
) {
  const client = ensureSupabase();
  return client
    .from("users")
    .update({
      display_name: displayName,
      avatar_url: avatarUrl,
    })
    .eq("id", userId);
}

// Category functions
export async function getCategories(userId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name");

  if (error) throw error;
  return data;
}

export async function createCategory(
  name: string,
  color: string,
  userId: string,
) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .insert({
      name,
      color,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, name: string, color: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("categories")
    .update({ name, color })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const client = ensureSupabase();
  const { error } = await client.from("categories").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Task functions
export async function getTasks(userId: string) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("tasks")
    .select(
      `
      *,
      categories (*)
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createTask(
  title: string,
  description: string | null,
  categoryId: string | null,
  userId: string,
  dueDate: string | null = null,
) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("tasks")
    .insert({
      title,
      description,
      category_id: categoryId,
      user_id: userId,
      is_complete: false,
      due_date: dueDate,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTask(
  id: string,
  updates: Partial<Omit<Task, "id" | "created_at" | "user_id">>,
) {
  const client = ensureSupabase();
  const { data, error } = await client
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleTaskCompletion(id: string, isComplete: boolean) {
  return updateTask(id, { is_complete: isComplete });
}

export async function deleteTask(id: string) {
  const client = ensureSupabase();
  const { error } = await client.from("tasks").delete().eq("id", id);

  if (error) throw error;
  return true;
}

// Statistics functions
export async function getUserTaskStats(userId: string) {
  const client = ensureSupabase();
  const { data: tasks, error } = await client
    .from("tasks")
    .select("is_complete, category_id, categories(name, color)")
    .eq("user_id", userId);

  if (error) throw error;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.is_complete).length;
  const incompleteTasks = totalTasks - completedTasks;

  // Group tasks by category
  const categoryCounts: Record<
    string,
    { total: number; completed: number; name: string; color: string }
  > = {};

  tasks.forEach((task) => {
    if (task.category_id && task.categories) {
      const categoryId = task.category_id;
      const categoryName = task.categories.name;
      const categoryColor = task.categories.color;

      if (!categoryCounts[categoryId]) {
        categoryCounts[categoryId] = {
          total: 0,
          completed: 0,
          name: categoryName,
          color: categoryColor,
        };
      }

      categoryCounts[categoryId].total += 1;
      if (task.is_complete) {
        categoryCounts[categoryId].completed += 1;
      }
    }
  });

  return {
    totalTasks,
    completedTasks,
    incompleteTasks,
    completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
    categoryCounts,
  };
}
