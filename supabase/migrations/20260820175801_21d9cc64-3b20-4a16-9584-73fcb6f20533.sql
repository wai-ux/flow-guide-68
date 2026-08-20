-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  display_name text,
  avatar_url text,
  learning_goal text,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- LEARNING MODULES (public catalog)
CREATE TABLE public.learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'general',
  level text NOT NULL DEFAULT 'foundation',
  estimated_minutes integer NOT NULL DEFAULT 30,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.learning_modules TO anon;
GRANT SELECT ON public.learning_modules TO authenticated;
GRANT ALL ON public.learning_modules TO service_role;

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Modules are viewable by everyone" ON public.learning_modules
  FOR SELECT USING (true);

CREATE TRIGGER update_learning_modules_updated_at
  BEFORE UPDATE ON public.learning_modules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- USER PROGRESS
CREATE TABLE public.user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  module_slug text NOT NULL,
  status text NOT NULL DEFAULT 'not_started',
  percent integer NOT NULL DEFAULT 0,
  notes text,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, module_slug)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_progress TO authenticated;
GRANT ALL ON public.user_progress TO service_role;

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own progress" ON public.user_progress
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX user_progress_user_id_idx ON public.user_progress (user_id);

-- LEARNING STATE (saved plan)
CREATE TABLE public.learning_state (
  user_id uuid PRIMARY KEY,
  goal text NOT NULL DEFAULT '',
  deadline text NOT NULL DEFAULT '',
  hours numeric NOT NULL DEFAULT 2,
  planned boolean NOT NULL DEFAULT false,
  resources jsonb NOT NULL DEFAULT '[]'::jsonb,
  concepts jsonb NOT NULL DEFAULT '{}'::jsonb,
  gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_state TO authenticated;
GRANT ALL ON public.learning_state TO service_role;

ALTER TABLE public.learning_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own learning state" ON public.learning_state
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_learning_state_updated_at
  BEFORE UPDATE ON public.learning_state
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Demo catalog content
INSERT INTO public.learning_modules (slug, title, description, category, level, estimated_minutes, sort_order) VALUES
  ('linear-algebra-basics', 'Linear Algebra Basics', 'Vectors, matrices and the operations behind every model.', 'math', 'foundation', 45, 1),
  ('probability-essentials', 'Probability Essentials', 'Distributions, expectation and uncertainty for ML.', 'math', 'foundation', 40, 2),
  ('gradient-descent', 'Gradient Descent', 'How models actually learn, step by step.', 'ml-core', 'urgent', 35, 3),
  ('neural-networks-intro', 'Neural Networks Intro', 'Layers, activations and forward/backward passes.', 'ml-core', 'priority', 50, 4),
  ('model-evaluation', 'Model Evaluation', 'Train/test splits, overfitting and useful metrics.', 'practice', 'priority', 30, 5),
  ('transformers-overview', 'Transformers Overview', 'Attention and why modern models scale.', 'advanced', 'later', 60, 6);