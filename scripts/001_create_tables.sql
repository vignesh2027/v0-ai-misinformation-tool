-- Create tables for AI misinformation detection tool

-- Table for storing misinformation checks
CREATE TABLE IF NOT EXISTS public.misinformation_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text_content TEXT NOT NULL,
  credibility_score INTEGER NOT NULL CHECK (credibility_score >= 0 AND credibility_score <= 100),
  analysis TEXT NOT NULL,
  references TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT -- For anonymous users
);

-- Table for storing quiz results
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  time_taken INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT -- For anonymous users
);

-- Table for storing quiz questions (for dynamic quiz generation)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of answer options
  correct_answer INTEGER NOT NULL, -- Index of correct answer
  explanation TEXT,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.misinformation_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for misinformation_checks
CREATE POLICY "Allow users to view their own checks" ON public.misinformation_checks 
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Allow users to insert their own checks" ON public.misinformation_checks 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- RLS Policies for quiz_results
CREATE POLICY "Allow users to view their own quiz results" ON public.quiz_results 
  FOR SELECT USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

CREATE POLICY "Allow users to insert their own quiz results" ON public.quiz_results 
  FOR INSERT WITH CHECK (
    auth.uid() = user_id OR 
    (auth.uid() IS NULL AND session_id IS NOT NULL)
  );

-- RLS Policies for quiz_questions (public read access)
CREATE POLICY "Allow everyone to view quiz questions" ON public.quiz_questions 
  FOR SELECT USING (true);

-- Insert some sample quiz questions
INSERT INTO public.quiz_questions (question, options, correct_answer, explanation, difficulty, category) VALUES
(
  'What is the most reliable way to verify a news story?',
  '["Share it immediately on social media", "Check multiple reputable news sources", "Trust it if it has many likes", "Believe it if a friend shared it"]',
  1,
  'Cross-referencing information across multiple reputable news sources is the most reliable way to verify a story.',
  'easy',
  'verification'
),
(
  'Which of these is a red flag for misinformation?',
  '["Emotional language and sensational headlines", "Multiple credible sources cited", "Recent publication date", "Author credentials provided"]',
  0,
  'Emotional language and sensational headlines are often used to manipulate readers and spread misinformation.',
  'medium',
  'detection'
),
(
  'What should you do before sharing news on social media?',
  '["Share it immediately to inform others", "Add your own opinion to make it more engaging", "Verify the information from reliable sources", "Change the headline to make it more interesting"]',
  2,
  'Always verify information from reliable sources before sharing to prevent the spread of misinformation.',
  'easy',
  'social_media'
),
(
  'Which source is generally most reliable for health information?',
  '["Social media influencers", "Peer-reviewed medical journals", "Anonymous blog posts", "Viral videos"]',
  1,
  'Peer-reviewed medical journals undergo rigorous scientific review and are the most reliable source for health information.',
  'medium',
  'health'
),
(
  'What is "confirmation bias" in the context of news consumption?',
  '["Reading news from multiple perspectives", "Fact-checking every article", "Seeking information that confirms existing beliefs", "Avoiding news altogether"]',
  2,
  'Confirmation bias is the tendency to seek out information that confirms our existing beliefs while ignoring contradictory evidence.',
  'hard',
  'psychology'
);
