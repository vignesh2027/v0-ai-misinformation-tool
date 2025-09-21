-- Insert comprehensive quiz questions
INSERT INTO quiz_questions (question, options, correct_answer, explanation, category, difficulty) VALUES

-- Verification Techniques (Easy)
('What is the first step when encountering suspicious information online?', 
 '["Share it immediately", "Check the source", "Ignore it completely", "Comment your opinion"]', 
 1, 
 'Always check the source first. Look for author credentials, publication date, and website reputation before taking any other action.',
 'verification', 'easy'),

('Which of these is a reliable fact-checking website?', 
 '["Facebook", "Snopes.com", "Random blog", "WhatsApp forward"]', 
 1, 
 'Snopes.com is a well-established fact-checking website. Other reliable sources include PolitiFact, FactCheck.org, and Reuters Fact Check.',
 'verification', 'easy'),

('What should you look for in a credible news source?', 
 '["Clickbait headlines", "Author bylines and credentials", "Lots of ads", "Emotional language only"]', 
 1, 
 'Credible sources have clear author bylines, credentials, publication dates, and editorial standards. They avoid sensationalism and provide balanced reporting.',
 'verification', 'easy'),

-- Detection Skills (Medium)
('Which headline is most likely to be clickbait?', 
 '["Study Shows Climate Change Effects", "You Won\'t BELIEVE What Happened Next!", "Local Election Results Announced", "New Medical Research Published"]', 
 1, 
 'Clickbait headlines use emotional triggers, excessive capitalization, and vague promises. They prioritize clicks over informative content.',
 'detection', 'medium'),

('What is a red flag for fake news?', 
 '["Multiple credible sources", "Emotional manipulation", "Clear publication date", "Author contact information"]', 
 1, 
 'Fake news often uses emotional manipulation to bypass critical thinking. Look for sensational language designed to provoke strong reactions.',
 'detection', 'medium'),

('How can you verify an image hasn\'t been manipulated?', 
 '["Trust the caption", "Use reverse image search", "Check if it looks real", "Share it to get opinions"]', 
 1, 
 'Reverse image search tools like Google Images or TinEye can help verify if an image is original, manipulated, or taken out of context.',
 'detection', 'medium'),

-- Social Media Literacy (Medium)
('What makes information spread faster on social media?', 
 '["Accuracy", "Emotional content", "Length", "Complexity"]', 
 1, 
 'Emotional content spreads faster than factual content on social media. This is why misinformation often contains strong emotional triggers.',
 'social_media', 'medium'),

('What is an "echo chamber" in social media?', 
 '["A place with good acoustics", "Seeing only information that confirms your beliefs", "A type of microphone", "A video chat room"]', 
 1, 
 'Echo chambers occur when algorithms show you content similar to what you already engage with, limiting exposure to diverse perspectives.',
 'social_media', 'medium'),

('How do social media algorithms affect what you see?', 
 '["They show everything equally", "They prioritize engaging content", "They show only news", "They are completely random"]', 
 1, 
 'Algorithms prioritize content that generates engagement (likes, shares, comments), which can amplify sensational or controversial content.',
 'social_media', 'medium'),

-- Advanced Analysis (Hard)
('What is "confirmation bias" in information consumption?', 
 '["Confirming sources are real", "Seeking information that supports existing beliefs", "Double-checking facts", "Confirming with friends"]', 
 1, 
 'Confirmation bias leads people to seek, interpret, and remember information that confirms their pre-existing beliefs while ignoring contradictory evidence.',
 'psychology', 'hard'),

('What technique do deepfakes primarily use?', 
 '["Photoshop", "Artificial Intelligence", "Green screen", "Voice modulation"]', 
 1, 
 'Deepfakes use AI and machine learning to create realistic but fake audio and video content by training on existing media.',
 'technology', 'hard'),

('What is "astroturfing" in digital manipulation?', 
 '["Fake grass installation", "Artificial grassroots movements", "Website design", "Social media advertising"]', 
 1, 
 'Astroturfing creates fake grassroots movements or public opinion through coordinated inauthentic behavior, often using bots or paid actors.',
 'manipulation', 'hard'),

-- Current Events & Trends (Medium-Hard)
('What is the main purpose of fact-checking labels on social media?', 
 '["Censorship", "Providing context and warnings", "Increasing engagement", "Advertising"]', 
 1, 
 'Fact-checking labels aim to provide users with additional context and warn about potentially false information without removing content.',
 'platforms', 'medium'),

('What is "prebunking" in misinformation prevention?', 
 '["Removing false content", "Preventing misinformation before it spreads", "Fact-checking after sharing", "Blocking users"]', 
 1, 
 'Prebunking involves educating people about misinformation techniques before they encounter false information, building resistance to manipulation.',
 'prevention', 'hard'),

-- Media Literacy Fundamentals (Easy-Medium)
('What does "lateral reading" mean?', 
 '["Reading from left to right", "Opening multiple tabs to verify information", "Reading slowly", "Reading headlines only"]', 
 1, 
 'Lateral reading involves opening multiple browser tabs to research the source, author, and claims while reading, rather than just reading vertically down a page.',
 'literacy', 'medium'),

('Which is NOT a reliable way to check if a website is trustworthy?', 
 '["Checking the About page", "Looking at the URL", "Seeing if it has many ads", "Verifying contact information"]', 
 2, 
 'The number of ads doesn\'t determine trustworthiness. Many legitimate news sites have advertising, while some fake sites may have few or no ads.',
 'verification', 'easy'),

-- Psychological Manipulation (Hard)
('What is "emotional contagion" in social media?', 
 '["Spreading diseases", "Emotions spreading through networks", "Viral videos", "Emotional support groups"]', 
 1, 
 'Emotional contagion is the phenomenon where emotions spread through social networks, making people more likely to share emotionally charged content.',
 'psychology', 'hard'),

('What makes people more susceptible to misinformation?', 
 '["High education", "Cognitive overload and time pressure", "Skeptical nature", "Technical knowledge"]', 
 1, 
 'When people are overwhelmed with information or under time pressure, they rely more on mental shortcuts and are more susceptible to misinformation.',
 'psychology', 'hard'),

-- Technology & Tools (Medium-Hard)
('What is the purpose of blockchain in combating misinformation?', 
 '["Faster internet", "Creating immutable records", "Better graphics", "Cheaper storage"]', 
 1, 
 'Blockchain can create tamper-proof records of information provenance, helping verify the authenticity and origin of digital content.',
 'technology', 'hard'),

('What is "synthetic media"?', 
 '["Natural photography", "AI-generated content", "Social media posts", "Traditional media"]', 
 1, 
 'Synthetic media refers to content generated or manipulated using artificial intelligence, including deepfakes, AI-generated images, and synthetic text.',
 'technology', 'hard'),

-- Information Warfare (Hard)
('What is a "bot network" or "botnet" in information warfare?', 
 '["Computer viruses", "Coordinated fake accounts", "Network cables", "Robot factories"]', 
 1, 
 'Bot networks are coordinated groups of fake social media accounts used to amplify certain messages, create false impressions of public opinion, or spread misinformation.',
 'warfare', 'hard'),

-- Practical Skills (Easy-Medium)
('Before sharing news on social media, you should:', 
 '["Add your opinion", "Verify the information first", "Make it more exciting", "Tag all your friends"]', 
 1, 
 'Always verify information before sharing. Even well-intentioned sharing of false information contributes to its spread and can harm others.',
 'practice', 'easy'),

('What is the "SIFT" method for evaluating information?', 
 '["Sort, Identify, Filter, Test", "Stop, Investigate, Find, Trace", "Search, Inspect, Follow, Trust", "Scan, Interpret, Focus, Think"]', 
 1, 
 'SIFT stands for Stop, Investigate the source, Find better coverage, and Trace claims to their origin. It\'s a systematic approach to information verification.',
 'literacy', 'medium'),

('When you see breaking news, what should you do first?', 
 '["Share it immediately", "Wait for confirmation from multiple sources", "Add your commentary", "Call local news"]', 
 1, 
 'Breaking news is often incomplete or inaccurate. Wait for confirmation from multiple reliable sources before sharing or acting on the information.',
 'practice', 'medium'),

-- Advanced Detection (Hard)
('What is "manufactured consensus" in information manipulation?', 
 '["Factory-made products", "Creating false appearance of widespread agreement", "Democratic voting", "Survey research"]', 
 1, 
 'Manufactured consensus uses coordinated campaigns to create the false impression that there is widespread public agreement on an issue when there isn\'t.',
 'manipulation', 'hard'),

('What role do "useful idiots" play in misinformation spread?', 
 '["They are computer programmers", "They unknowingly spread false information", "They create fake news", "They fact-check information"]', 
 1, 
 'Useful idiots are people who unknowingly help spread misinformation by sharing false content they believe to be true, amplifying its reach.',
 'psychology', 'hard');
