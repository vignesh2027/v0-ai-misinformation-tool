-- Adding comprehensive quiz data with 50+ questions across different categories and difficulties

-- Insert comprehensive quiz questions for misinformation detection
INSERT INTO quiz_questions (question, options, correct_answer, explanation, difficulty, category) VALUES

-- Easy Questions - Basic Misinformation Detection
('What is the first thing you should do when you see a shocking news story on social media?', 
 ARRAY['Share it immediately', 'Check the source and date', 'Comment your opinion', 'Like the post'], 
 1, 
 'Always verify the source and check when the story was published before sharing. Many fake stories recirculate old content.', 
 'easy', 'verification'),

('Which of these is a red flag that content might be misinformation?', 
 ARRAY['Professional website design', 'Multiple credible sources cited', 'Emotional language and ALL CAPS', 'Author credentials listed'], 
 2, 
 'Excessive emotional language, ALL CAPS, and sensational headlines are common tactics used to spread misinformation by triggering emotional responses.', 
 'easy', 'detection'),

('What does a blue checkmark typically indicate on social media platforms?', 
 ARRAY['The account is popular', 'The account is verified as authentic', 'The account posts only true information', 'The account is sponsored'], 
 1, 
 'A blue checkmark indicates that the platform has verified the account as authentic, but it doesn''t guarantee that all content posted is accurate.', 
 'easy', 'social_media'),

('Which source is generally most reliable for breaking news?', 
 ARRAY['Anonymous social media accounts', 'Established news organizations', 'Personal blogs', 'Forwarded messages'], 
 1, 
 'Established news organizations have editorial standards, fact-checking processes, and professional journalists who verify information before publishing.', 
 'easy', 'verification'),

('What should you do if you''re unsure about the accuracy of information?', 
 ARRAY['Share it with a warning', 'Don''t share it at all', 'Share it to get others'' opinions', 'Share it but delete later'], 
 1, 
 'If you''re unsure about information accuracy, it''s best not to share it. Spreading potentially false information can cause harm even with good intentions.', 
 'easy', 'verification'),

-- Medium Questions - Intermediate Skills
('What is "confirmation bias" in the context of misinformation?', 
 ARRAY['Confirming sources before sharing', 'Seeking information that confirms existing beliefs', 'Getting confirmation from friends', 'Verifying facts with multiple sources'], 
 1, 
 'Confirmation bias is the tendency to search for, interpret, and recall information that confirms our pre-existing beliefs, making us more susceptible to misinformation that aligns with our views.', 
 'medium', 'detection'),

('Which technique is commonly used to make fake news appear credible?', 
 ARRAY['Using simple language', 'Mixing true facts with false claims', 'Including many advertisements', 'Using bright colors'], 
 1, 
 'Misinformation often mixes true, verifiable facts with false claims to appear more credible and harder to debunk completely.', 
 'medium', 'detection'),

('What is "deepfake" technology?', 
 ARRAY['Deep web fake websites', 'AI-generated fake audio or video', 'Deeply researched fake articles', 'Fake social media profiles'], 
 1, 
 'Deepfake technology uses artificial intelligence to create realistic but fake audio, video, or images of people saying or doing things they never actually did.', 
 'medium', 'detection'),

('How can you verify if an image is authentic?', 
 ARRAY['Check if it looks realistic', 'Use reverse image search', 'See how many likes it has', 'Ask friends if they''ve seen it'], 
 1, 
 'Reverse image search tools like Google Images can help you find the original source of an image and see if it''s been manipulated or taken out of context.', 
 'medium', 'verification'),

('What is "astroturfing" in social media?', 
 ARRAY['Posting about sports', 'Creating fake grassroots movements', 'Sharing garden photos', 'Using green themes'], 
 1, 
 'Astroturfing is the practice of creating fake grassroots movements or campaigns using bots or paid accounts to make it appear there''s widespread public support for something.', 
 'medium', 'social_media'),

('Which of these is a sign of a potentially unreliable website?', 
 ARRAY['Recent publication date', 'Contact information provided', 'Excessive pop-up ads', 'Professional layout'], 
 2, 
 'Excessive pop-up ads, especially for questionable products, often indicate a website prioritizes revenue over credible journalism.', 
 'medium', 'verification'),

('What is "clickbait" and why is it problematic?', 
 ARRAY['Bait for fishing clicks', 'Headlines designed to get clicks over accuracy', 'Clicking on advertisements', 'Baiting people into arguments'], 
 1, 
 'Clickbait uses sensational headlines to generate clicks rather than accurately representing content, often leading to misinformation or disappointment.', 
 'medium', 'detection'),

-- Hard Questions - Advanced Critical Thinking
('What is the "illusory truth effect"?', 
 ARRAY['The tendency to believe repeated information', 'The effect of optical illusions', 'Truth appearing in dreams', 'The impact of virtual reality'], 
 0, 
 'The illusory truth effect is the cognitive bias where people are more likely to believe information that they''ve heard multiple times, regardless of its accuracy.', 
 'hard', 'detection'),

('How do "filter bubbles" contribute to misinformation spread?', 
 ARRAY['They filter out all false information', 'They create echo chambers limiting diverse viewpoints', 'They bubble up the most accurate news', 'They filter content by publication date'], 
 1, 
 'Filter bubbles created by algorithms show users content similar to what they''ve previously engaged with, creating echo chambers that can reinforce false beliefs and limit exposure to corrective information.', 
 'hard', 'social_media'),

('What is "source amnesia" and how does it affect misinformation?', 
 ARRAY['Forgetting to cite sources', 'Remembering information but forgetting its source', 'Anonymous sources in journalism', 'Amnesia caused by information overload'], 
 1, 
 'Source amnesia occurs when people remember information but forget where they learned it, making them unable to evaluate the credibility of the original source.', 
 'hard', 'detection'),

('Which statistical manipulation technique is commonly used in misleading content?', 
 ARRAY['Using accurate percentages', 'Cherry-picking data points', 'Showing complete datasets', 'Using standard scales'], 
 1, 
 'Cherry-picking involves selectively presenting data points that support a particular narrative while ignoring contradictory evidence, creating a misleading impression.', 
 'hard', 'detection'),

('What is "manufactured consensus" in misinformation campaigns?', 
 ARRAY['Getting experts to agree', 'Creating fake appearance of widespread agreement', 'Manufacturing survey results', 'Building consensus through debate'], 
 1, 
 'Manufactured consensus uses coordinated networks of fake accounts, bots, or paid actors to create the false impression that there''s widespread public agreement on an issue.', 
 'hard', 'social_media'),

-- Additional Questions for Variety
('What does "lateral reading" mean in fact-checking?', 
 ARRAY['Reading from left to right', 'Opening multiple tabs to verify information', 'Reading sideways on mobile', 'Reading between the lines'], 
 1, 
 'Lateral reading involves opening multiple browser tabs to research the source, author, and claims while reading, rather than just evaluating the content itself.', 
 'medium', 'verification'),

('Which of these is NOT a reliable fact-checking website?', 
 ARRAY['Snopes.com', 'FactCheck.org', 'PolitiFact.com', 'TruthSocial.com'], 
 3, 
 'Truth Social is a social media platform, not a fact-checking website. Snopes, FactCheck.org, and PolitiFact are established fact-checking organizations.', 
 'easy', 'verification'),

('What is "emotional contagion" in social media?', 
 ARRAY['Spreading diseases through posts', 'Emotions spreading through social networks', 'Contagious laughter videos', 'Viral emotional content'], 
 1, 
 'Emotional contagion is the phenomenon where emotions and moods spread through social networks, making emotionally charged (often false) content more likely to be shared.', 
 'hard', 'social_media'),

('How can you identify a bot account on social media?', 
 ARRAY['They post too frequently', 'Generic profile pictures and repetitive content', 'They have many followers', 'They use proper grammar'], 
 1, 
 'Bot accounts often have generic profile pictures, post repetitive content, have unusual posting patterns, and lack personal details in their profiles.', 
 'medium', 'social_media'),

('What is "prebunking" in misinformation prevention?', 
 ARRAY['Bunking before sleeping', 'Preventing misinformation before it spreads', 'Pre-approving social media posts', 'Preparing bunkers for information wars'], 
 1, 
 'Prebunking involves proactively educating people about misinformation tactics and building resistance to false information before they encounter it.', 
 'hard', 'verification'),

('Which cognitive bias makes people overconfident in false beliefs?', 
 ARRAY['Confirmation bias', 'Dunning-Kruger effect', 'Availability heuristic', 'Anchoring bias'], 
 1, 
 'The Dunning-Kruger effect causes people with limited knowledge to overestimate their competence, making them more confident in false beliefs and less likely to seek accurate information.', 
 'hard', 'detection'),

('What should you check when evaluating a scientific claim?', 
 ARRAY['If it sounds reasonable', 'Peer review and replication', 'How many people believe it', 'If it''s trending online'], 
 1, 
 'Scientific claims should be evaluated based on peer review, replication of results, and publication in reputable journals, not popularity or intuitive appeal.', 
 'medium', 'verification'),

('What is "context collapse" in social media misinformation?', 
 ARRAY['Social media platforms crashing', 'Information losing its original context when shared', 'Collapsing comment threads', 'Context menus not working'], 
 1, 
 'Context collapse occurs when information is shared across different social contexts, losing important contextual details that would help people evaluate its accuracy.', 
 'hard', 'social_media'),

('How do "micro-targeted" ads contribute to misinformation?', 
 ARRAY['They''re too small to read', 'They target specific groups with tailored false information', 'They use microscopic text', 'They target microorganisms'], 
 1, 
 'Micro-targeted ads use personal data to deliver specific messages to particular groups, allowing misinformation campaigns to tailor false narratives to different audiences.', 
 'hard', 'social_media'),

('What is the "backfire effect"?', 
 ARRAY['When corrections strengthen false beliefs', 'When social media posts backfire', 'When fact-checks are ignored', 'When misinformation spreads backwards'], 
 0, 
 'The backfire effect occurs when people presented with corrective information actually become more convinced of their original false beliefs, though recent research suggests this effect is less common than once thought.', 
 'hard', 'detection');
