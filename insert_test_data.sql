-- Insert test data into the health database
USE health;

-- Insert test users

-- User 1: gold with password 'smiths' (for marking)
INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES
('gold', 'Gold', 'Smiths', 'gold@example.com', '$2b$10$iKo/ZwEkPcEd8Awu2r5sn.kPrcEy4VbGI9/OzF0w/1s.Rqp79e2TO');

-- User 2: testuser with password 'Test123!'
INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES
('testuser', 'Test', 'User', 'test@example.com', '$2b$10$V2zuexTFHKNe8vrJh56XAeHWTIhplFUA/jZG8hjHrNgPJTqGVDQVO');

-- Insert sample workouts for the gold user (user_id = 1)
INSERT INTO workouts (user_id, date, exercise, duration, calories, notes) VALUES
(1, '2024-12-01', 'Running', 30, 300, 'Morning run, felt great!'),
(1, '2024-12-02', 'Bench Press', 45, 250, '3 sets of 10 reps, increasing weight'),
(1, '2024-12-03', 'Yoga', 60, 180, 'Relaxing session, focused on flexibility'),
(1, '2024-12-04', 'Cycling', 40, 350, 'Outdoor ride, hilly terrain'),
(1, '2024-12-05', 'Swimming', 30, 280, '20 laps in the pool');

-- Insert sample workouts for the test user (user_id = 2)
INSERT INTO workouts (user_id, date, exercise, duration, calories, notes) VALUES
(2, '2024-12-01', 'Walking', 20, 100, 'Light walk in the park'),
(2, '2024-12-02', 'Squats', 30, 200, '4 sets of 15 reps'),
(2, '2024-12-03', 'Jogging', 25, 220, 'Easy pace around the neighborhood');
