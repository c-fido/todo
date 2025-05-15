-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  display_name TEXT,
  avatar_url TEXT
);

-- Create RLS policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(name, user_id)
);

-- Create RLS policies for categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own categories" 
  ON public.categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  is_complete BOOLEAN DEFAULT FALSE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies for tasks table
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON public.tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON public.categories(user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, created_at)
  VALUES (NEW.id, NEW.email, NEW.created_at);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when a new user signs up
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create default categories for new users
CREATE OR REPLACE FUNCTION public.create_default_categories()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.categories (name, color, user_id)
  VALUES 
    ('Work', '#4A6FA5', NEW.id),
    ('Personal', '#FF6B6B', NEW.id),
    ('Shopping', '#4ECDC4', NEW.id),
    ('Health', '#45B69C', NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create default categories for new users
CREATE OR REPLACE TRIGGER on_user_created
  AFTER INSERT ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_categories();
