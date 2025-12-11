# Fittessness - Fitness Tracking Application

Fittessness is a web-based fitness tracking application designed to help you monitor and improve your workout routine. Whether you're a beginner starting your fitness journey or an experienced athlete looking to optimize your training, Fittessness provides the tools you need to track your progress.

## About Fittessness

Fittessness makes it easy to log workouts, monitor calories burned, and review your exercise history - all in one simple platform. The application provides a clean, intuitive interface for managing your fitness data and visualizing your progress over time.

## Key Features

### Personal Account & Security
- Create a secure personal account with encrypted password storage
- Session-based authentication keeps your data private
- Each user has their own isolated workout history

### Workout Logging
- Log unlimited workout sessions with detailed information
- Record exercise name, duration, and calories burned
- Add personal notes to remember how you felt or what worked well
- Date-stamped entries help you track progress over time

### Dashboard & Statistics
- View your fitness overview at a glance
- Track total workouts completed
- Monitor total calories burned
- See cumulative exercise duration
- Quick access to all major features

### Workout History
- Browse all your logged workouts in an organized table
- See exercise details, dates, and personal notes
- Workouts displayed in reverse chronological order
- Easy navigation between viewing and adding workouts

### Search Functionality
- Find specific workouts quickly by exercise name
- Search works across all your historical data
- Helps you track progress on specific exercises
- View detailed results matching your search

### User Profile
- View your account information
- See when you joined Fittessness
- Track your overall fitness statistics
- Monitor your long-term progress

## Technology

How I built Fittessness:

- **Backend:** Node.js and Express for fast, reliable server performance
- **Database:** MySQL for secure, scalable data storage
- **Frontend:** EJS templates with responsive CSS design
- **Security:** bcrypt password encryption and express-validator input protection
- **Sessions:** Secure session management for user authentication

## Using Fittessness

### Creating Your Account

1. Click "Get Started" or "Register" on the home page
2. Fill in your details (username, name, email, password)
3. Your password must be at least 8 characters with uppercase, lowercase, numbers, and special characters
4. Click "Register" to create your account

### Logging In

1. Click "Login" and enter your credentials
2. You'll be taken to your personal dashboard
3. Your session stays active for one hour

### Adding Workouts

1. Click "Add Workout" from the dashboard or navigation menu
2. Enter the date of your workout
3. Specify the exercise name (e.g., "Running", "Bench Press", "Yoga")
4. Record duration in minutes
5. Enter calories burned
6. Optionally add notes about how you felt or any observations
7. Click "Save Workout"

### Viewing Your Progress

- **Dashboard:** See your total statistics at a glance
- **My Workouts:** Browse your complete workout history
- **Search:** Find specific exercises you've done
- **Profile:** View your account details and overall stats

### Searching Workouts

1. Click "Search" in the navigation menu
2. Enter an exercise name (e.g., "running")
3. View all matching workouts
4. Search is case-insensitive and matches partial names

## Data Privacy & Security

The data is protected with standard security measures:

- All passwords are encrypted using bcrypt hashing
- Sessions use secure HTTP only cookies
- SQL injection protection through parameterized queries
- Input validation prevents malicious data entry
- Each user's data is completely isolated

## Database Schema

Fittessness uses a simple, efficient database structure:

**Users Table:** Stores your account information (username, name, email, encrypted password)

**Workouts Table:** Contains your workout records (date, exercise, duration, calories, notes)

The tables are linked so each workout belongs to a specific user, maintaining data integrity and privacy.

## Test Account

A test account is pre-configured for demonstration:

- **Username:** gold
- **Password:** smiths

This account includes sample workout data to explore the application's features.
