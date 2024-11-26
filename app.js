const express = require('express')
const session = require('express-session')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
require('dotenv').config()
const bcrypt = require('bcrypt')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const prisma = require('./models/prismaClient')
const app = express()
const authRoutes = require('./routes/authRoutes')
const { ensureAuthenticated } = require('./middlewares/authMiddleware')
const uploadRoutes = require('./routes/uploadRoutes');
// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Set EJS as the view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Session management with Prisma Session Store
app.use(
	session({
		secret: process.env.SESSION_SECRET, // Replace with an actual secret in production
		resave: false,
		saveUninitialized: false,
		store: new PrismaSessionStore(prisma, {
			checkPeriod: 2 * 60 * 1000, // Check for expired sessions every 2 minutes
		}),
	})
)

passport.use(
	new LocalStrategy(
		{ usernameField: 'email' },
		async (email, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { email } })

				if (!user) {
					return done(null, false, { message: 'Invalid email or password.' })
				}

				const isPasswordValid = await bcrypt.compare(password, user.password)
				if (!isPasswordValid) {
					return done(null, false, { message: 'Invalid email or password.' })
				}

				return done(null, user)
			} catch (err) {
				return done(err)
			}
		}
	)
)

// Serialize user ID into the session
passport.serializeUser((user, done) => done(null, user.id))

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } })
		done(null, user)
	} catch (err) {
		done(err, null)
	}
})

app.use(passport.initialize())
app.use(passport.session())

// Routes

app.use('/', authRoutes)
app.use('/', uploadRoutes);


// Home route
app.get('/', ensureAuthenticated, async (req, res) => {
	try {
    // Fetch user files
    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
    });

    res.render('pages/home', { user: req.user, files });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to load dashboard.');
  }
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
