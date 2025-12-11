// Fittessness - Fitness Tracking Application
// Main server file

const express = require('express');
const session = require('express-session');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const port = 8000;
const saltRounds = 10;

// Database connection
const db = mysql.createConnection({
    host: process.env.HEALTH_HOST || 'localhost',
    user: process.env.HEALTH_USER || 'health_app',
    password: process.env.HEALTH_PASSWORD || 'qwertyuiop',
    database: process.env.HEALTH_DATABASE || 'health'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'fittessness-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3600000 // 1 hour
    }
}));

// Authentication middleware
const requireLogin = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Input sanitization helper
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim();
};

// ==================== ROUTES ====================

// Home page
app.get('/', (req, res) => {
    res.render('index');
});

// About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Register page
app.get('/register', (req, res) => {
    res.render('register');
});

// Register POST - with validation
app.post('/registered', [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be 3-50 characters')
        .isAlphanumeric()
        .withMessage('Username must contain only letters and numbers'),
    body('first')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('First name is required'),
    body('last')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Last name is required'),
    body('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character')
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.send(`
            <h1>Registration Error</h1>
            <p>${errors.array().map(e => e.msg).join('<br>')}</p>
            <a href="/register">Go back</a>
        `);
    }

    const { username, first, last, email, password } = req.body;
    
    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        // Insert user
        const sqlQuery = 'INSERT INTO users (username, first_name, last_name, email, hashed_password) VALUES (?, ?, ?, ?, ?)';
        
        db.query(sqlQuery, [
            sanitizeInput(username),
            sanitizeInput(first),
            sanitizeInput(last),
            sanitizeInput(email),
            hashedPassword
        ], (err, result) => {
            if (err) {
                console.error('Registration error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.send(`
                        <h1>Registration Error</h1>
                        <p>Username or email already exists. Please try another.</p>
                        <a href="/register">Go back</a>
                    `);
                }
                return res.send(`
                    <h1>Registration Error</h1>
                    <p>An error occurred. Please try again.</p>
                    <a href="/register">Go back</a>
                `);
            }
            
            res.send(`
                <h1>Registration Successful!</h1>
                <p>Welcome, ${sanitizeInput(first)}! Your account has been created.</p>
                <a href="/login">Login now</a>
            `);
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.send(`
            <h1>Registration Error</h1>
            <p>An error occurred. Please try again.</p>
            <a href="/register">Go back</a>
        `);
    }
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

// Login POST
app.post('/loggedin', [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.send(`
            <h1>Login Error</h1>
            <p>Please provide username and password.</p>
            <a href="/login">Go back</a>
        `);
    }

    const { username, password } = req.body;
    
    const sqlQuery = 'SELECT * FROM users WHERE username = ?';
    
    db.query(sqlQuery, [sanitizeInput(username)], async (err, results) => {
        if (err) {
            console.error('Login error:', err);
            return res.send(`
                <h1>Login Error</h1>
                <p>An error occurred. Please try again.</p>
                <a href="/login">Go back</a>
            `);
        }
        
        if (results.length === 0) {
            return res.send(`
                <h1>Login Failed</h1>
                <p>Invalid username or password.</p>
                <a href="/login">Try again</a>
            `);
        }
        
        const user = results[0];
        
        try {
            const match = await bcrypt.compare(password, user.hashed_password);
            
            if (match) {
                // Set session
                req.session.userId = user.id;
                req.session.username = user.username;
                req.session.firstName = user.first_name;
                
                res.redirect('/dashboard');
            } else {
                res.send(`
                    <h1>Login Failed</h1>
                    <p>Invalid username or password.</p>
                    <a href="/login">Try again</a>
                `);
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            res.send(`
                <h1>Login Error</h1>
                <p>An error occurred. Please try again.</p>
                <a href="/login">Go back</a>
            `);
        }
    });
});

// Dashboard (protected)
app.get('/dashboard', requireLogin, (req, res) => {
    const userId = req.session.userId;
    
    // Get statistics
    const statsQuery = `
        SELECT 
            COUNT(*) as totalWorkouts,
            COALESCE(SUM(calories), 0) as totalCalories,
            COALESCE(SUM(duration), 0) as totalDuration
        FROM workouts 
        WHERE user_id = ?
    `;
    
    db.query(statsQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching stats:', err);
            return res.send('Error loading dashboard');
        }
        
        const stats = results[0];
        
        res.render('dashboard', {
            user: req.session.firstName,
            totalWorkouts: stats.totalWorkouts,
            totalCalories: stats.totalCalories,
            totalDuration: stats.totalDuration
        });
    });
});

// workout page (protected)
app.get('/add-workout', requireLogin, (req, res) => {
    res.render('add-workout');
});

// workout post (protected)
app.post('/workout-added', requireLogin, [
    body('date').isDate().withMessage('Valid date is required'),
    body('exercise')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Exercise name is required (max 100 characters)'),
    body('duration')
        .isInt({ min: 1 })
        .withMessage('Duration must be a positive number'),
    body('calories')
        .isInt({ min: 0 })
        .withMessage('Calories must be a non-negative number'),
    body('notes')
        .optional()
        .trim()
], (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.send(`
            <h1>Invalid Input</h1>
            <p>${errors.array().map(e => e.msg).join('<br>')}</p>
            <a href="/add-workout">Go back</a>
        `);
    }

    const { date, exercise, duration, calories, notes } = req.body;
    const userId = req.session.userId;
    
    const sqlQuery = 'INSERT INTO workouts (user_id, date, exercise, duration, calories, notes) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(sqlQuery, [
        userId,
        date,
        sanitizeInput(exercise),
        parseInt(duration),
        parseInt(calories),
        sanitizeInput(notes) || null
    ], (err, result) => {
        if (err) {
            console.error('Error adding workout:', err);
            return res.send(`
                <h1>Error</h1>
                <p>Failed to add workout. Please try again.</p>
                <a href="/add-workout">Go back</a>
            `);
        }
        
        res.send(`
            <h1>Workout Added!</h1>
            <p>Your workout has been successfully logged.</p>
            <a href="/dashboard">Back to Dashboard</a>
            <a href="/add-workout">Add Another</a>
            <a href="/list-workouts">View All Workouts</a>
        `);
    });
});

// List workouts (protected)
app.get('/list-workouts', requireLogin, (req, res) => {
    const userId = req.session.userId;
    
    const sqlQuery = 'SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC';
    
    db.query(sqlQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching workouts:', err);
            return res.send('Error loading workouts');
        }
        
        res.render('list-workouts', { workouts: results });
    });
});

// Search workouts page (protected)
app.get('/search-workouts', requireLogin, (req, res) => {
    const userId = req.session.userId;
    const keyword = req.query.keyword;
    
    if (!keyword) {
        return res.render('search-workouts', {
            searched: false,
            results: [],
            keyword: ''
        });
    }
    
    // Search by exercise name
    const sqlQuery = 'SELECT * FROM workouts WHERE user_id = ? AND exercise LIKE ? ORDER BY date DESC';
    const searchTerm = `%${sanitizeInput(keyword)}%`;
    
    db.query(sqlQuery, [userId, searchTerm], (err, results) => {
        if (err) {
            console.error('Error searching workouts:', err);
            return res.send('Error searching workouts');
        }
        
        res.render('search-workouts', {
            searched: true,
            results: results,
            keyword: keyword
        });
    });
});

// Profile page (protected)
app.get('/profile', requireLogin, (req, res) => {
    const userId = req.session.userId;
    
    const userQuery = 'SELECT id, username, first_name, last_name, email, created_at FROM users WHERE id = ?';
    
    db.query(userQuery, [userId], (err, userResults) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.send('Error loading profile');
        }
        
        if (userResults.length === 0) {
            return res.redirect('/logout');
        }
        
        const user = userResults[0];
        
        // Get statistics
        const statsQuery = `
            SELECT 
                COUNT(*) as totalWorkouts,
                COALESCE(SUM(calories), 0) as totalCalories
            FROM workouts 
            WHERE user_id = ?
        `;
        
        db.query(statsQuery, [userId], (err, statsResults) => {
            if (err) {
                console.error('Error fetching stats:', err);
                return res.send('Error loading profile');
            }
            
            const stats = statsResults[0];
            
            res.render('profile', {
                user: {
                    username: user.username,
                    first: user.first_name,
                    last: user.last_name,
                    email: user.email,
                    created_at: user.created_at
                },
                totalWorkouts: stats.totalWorkouts,
                totalCalories: stats.totalCalories
            });
        });
    });
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <a href="/">Go to Home</a>
    `);
});

// Start server
app.listen(port, () => {
    console.log(`Fittessness app listening on port ${port}`);
    console.log(`Visit http://localhost:${port}`);
});
