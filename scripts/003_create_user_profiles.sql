-- Create user profiles table with RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  quiz_score INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  articles_analyzed INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  achievements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'New User')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create user quiz attempts table
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for quiz attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for quiz attempts
CREATE POLICY "quiz_attempts_select_own"
  ON public.quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_insert_own"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create analysis history table
CREATE TABLE IF NOT EXISTS public.analysis_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  credibility_score INTEGER NOT NULL,
  analysis_result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for analysis history
ALTER TABLE public.analysis_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analysis history
CREATE POLICY "analysis_history_select_own"
  ON public.analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "analysis_history_insert_own"
  ON public.analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
