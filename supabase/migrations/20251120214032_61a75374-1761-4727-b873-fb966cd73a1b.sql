-- Insert all Kids English rooms into kids_rooms table
-- Level 1: Ages 4-7 (English for Little Explorers)
INSERT INTO kids_rooms (id, level_id, title_en, title_vi, description_en, description_vi, display_order, icon) VALUES
('colors-shapes-level1', 'level1', 'Colors & Shapes', 'Màu Sắc & Hình Dạng', 'Learn basic colors and shapes', 'Học màu sắc và hình dạng cơ bản', 1, '🎨'),
('animals-sounds-level1', 'level1', 'Animals & Sounds', 'Động Vật & Âm Thanh', 'Discover animals and their sounds', 'Khám phá động vật và tiếng kêu', 2, '🐶'),
('my-family-level1', 'level1', 'My Family', 'Gia Đình Tôi', 'Learn about family members', 'Học về các thành viên trong gia đình', 3, '👨‍👩‍👧‍👦'),
('food-snacks-level1', 'level1', 'Food & Snacks', 'Đồ Ăn & Đồ Ăn Vặt', 'Explore foods and snacks', 'Khám phá đồ ăn và đồ ăn vặt', 4, '🍎'),
('toys-games-level1', 'level1', 'Toys & Games', 'Đồ Chơi & Trò Chơi', 'Learn about toys and games', 'Học về đồ chơi và trò chơi', 5, '🧸'),
('weather-seasons-level1', 'level1', 'Weather & Seasons', 'Thời Tiết & Mùa', 'Discover weather and seasons', 'Khám phá thời tiết và các mùa', 6, '☀️'),
('my-body-level1', 'level1', 'My Body', 'Cơ Thể Tôi', 'Learn body parts', 'Học các bộ phận cơ thể', 7, '👦'),
('at-home-level1', 'level1', 'At Home', 'Ở Nhà', 'Explore things at home', 'Khám phá đồ vật trong nhà', 8, '🏠'),
('feelings-emotions-level1', 'level1', 'Feelings & Emotions', 'Cảm Xúc', 'Learn about feelings', 'Học về cảm xúc', 9, '😊'),
('nature-outdoors-level1', 'level1', 'Nature & Outdoors', 'Thiên Nhiên & Ngoài Trời', 'Discover nature', 'Khám phá thiên nhiên', 10, '🌳'),
('numbers-counting-level1', 'level1', 'Numbers & Counting', 'Số Đếm', 'Learn to count', 'Học đếm số', 11, '🔢'),
('simple-actions-level1', 'level1', 'Simple Actions', 'Hành Động Đơn Giản', 'Learn basic actions', 'Học các hành động cơ bản', 12, '🏃');

-- Level 2: Ages 7-10 (English for Young Adventurers)
INSERT INTO kids_rooms (id, level_id, title_en, title_vi, description_en, description_vi, display_order, icon) VALUES
('daily-routines-level2', 'level2', 'Daily Routines', 'Thói Quen Hàng Ngày', 'Learn about daily activities', 'Học về hoạt động hàng ngày', 1, '⏰'),
('at-school-level2', 'level2', 'At School', 'Ở Trường', 'Explore school life', 'Khám phá cuộc sống ở trường', 2, '🏫'),
('my-hobbies-level2', 'level2', 'My Hobbies', 'Sở Thích Của Tôi', 'Talk about hobbies', 'Nói về sở thích', 3, '⚽'),
('describing-people-level2', 'level2', 'Describing People', 'Mô Tả Con Người', 'Learn to describe people', 'Học cách mô tả người', 4, '👥'),
('describing-places-level2', 'level2', 'Describing Places', 'Mô Tả Địa Điểm', 'Describe different places', 'Mô tả các địa điểm khác nhau', 5, '🗺️'),
('animals-habitats-level2', 'level2', 'Animals & Habitats', 'Động Vật & Môi Trường Sống', 'Learn about animal homes', 'Học về môi trường sống của động vật', 6, '🦁'),
('healthy-habits-level2', 'level2', 'Healthy Habits', 'Thói Quen Lành Mạnh', 'Learn about health', 'Học về sức khỏe', 7, '💪'),
('around-city-level2', 'level2', 'Around the City', 'Quanh Thành Phố', 'Explore the city', 'Khám phá thành phố', 8, '🏙️'),
('short-stories-level2', 'level2', 'Short Stories', 'Truyện Ngắn', 'Read simple stories', 'Đọc truyện đơn giản', 9, '📖'),
('travel-transportation-level2', 'level2', 'Travel & Transportation', 'Du Lịch & Giao Thông', 'Learn about transportation', 'Học về phương tiện giao thông', 10, '🚗'),
('basic-grammar-level2', 'level2', 'Basic Grammar & Patterns', 'Ngữ Pháp Cơ Bản', 'Learn grammar patterns', 'Học các mẫu ngữ pháp', 11, '📝'),
('asking-answering-level2', 'level2', 'Asking & Answering Questions', 'Hỏi & Trả Lời', 'Practice questions', 'Thực hành câu hỏi', 12, '❓');

-- Level 3: Ages 10-13 (English for Growing Thinkers)
INSERT INTO kids_rooms (id, level_id, title_en, title_vi, description_en, description_vi, display_order, icon) VALUES
('expressing-opinions-level3', 'level3', 'Expressing Opinions', 'Bày Tỏ Ý Kiến', 'Share your thoughts', 'Chia sẻ suy nghĩ của bạn', 1, '💭'),
('creative-writing-level3', 'level3', 'Creative Writing', 'Viết Sáng Tạo', 'Write creatively', 'Viết sáng tạo', 2, '✍️'),
('science-curiosity-level3', 'level3', 'Science & Curiosity', 'Khoa Học & Tò Mò', 'Explore science', 'Khám phá khoa học', 3, '🔬'),
('friendship-teamwork-level3', 'level3', 'Friendship & Teamwork', 'Tình Bạn & Làm Việc Nhóm', 'Learn about friendship', 'Học về tình bạn', 4, '🤝'),
('problem-solving-level3', 'level3', 'Problem-Solving', 'Giải Quyết Vấn Đề', 'Develop problem-solving skills', 'Phát triển kỹ năng giải quyết vấn đề', 5, '🧩'),
('technology-future-level3', 'level3', 'Technology & the Future', 'Công Nghệ & Tương Lai', 'Explore technology', 'Khám phá công nghệ', 6, '💻'),
('nature-planet-level3', 'level3', 'Nature & the Planet', 'Thiên Nhiên & Hành Tinh', 'Learn about our planet', 'Học về hành tinh của chúng ta', 7, '🌍'),
('storytelling-narrative-level3', 'level3', 'Storytelling & Narrative Skills', 'Kể Chuyện', 'Master storytelling', 'Thành thạo kể chuyện', 8, '📚'),
('emotions-self-expression-level3', 'level3', 'Emotions & Self-Expression', 'Cảm Xúc & Thể Hiện Bản Thân', 'Express yourself', 'Thể hiện bản thân', 9, '🎭'),
('study-skills-level3', 'level3', 'Study Skills', 'Kỹ Năng Học Tập', 'Improve study habits', 'Cải thiện thói quen học tập', 10, '📚'),
('world-cultures-level3', 'level3', 'World Cultures', 'Văn Hóa Thế Giới', 'Discover world cultures', 'Khám phá văn hóa thế giới', 11, '🌏'),
('conversation-skills-level3', 'level3', 'Conversation Skills for Teens', 'Kỹ Năng Hội Thoại', 'Practice conversations', 'Thực hành hội thoại', 12, '💬');