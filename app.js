require("dotenv").config()
const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.use(
	session({
		secret: "OurLittleSecret.",
		resave: false,
		saveUninitialized: false
	})
)

app.use(passport.initialize())
app.use(passport.session())

//connect mongoose
mongoose.connect("mongodb://localhost:27017/userDB")

//create userSchema

const userSchema = new mongoose.Schema({
	email: String,
	password: String
})

userSchema.plugin(passportLocalMongoose)

const User = new mongoose.model("User", userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.get("/", (req, res) => {
	res.render("home")
})

app.get("/register", (req, res) => {
	res.render("register")
})

app.get("/login", (req, res) => {
	res.render("login")
})

app.get("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) {
			return next(err)
		}
		res.redirect("/")
	})
})

app.get("/secrets", (req, res) => {
	if (req.isAuthenticated()) {
		res.render("secrets")
	} else {
		res.redirect("/login")
	}
})

////////////////////////////////// Post Routes///////////////////////////////////////

app.post("/register", (req, res) => {
	User.register({ username: req.body.username }, req.body.password, (err, user) => {
		if (err) {
			console.log(err)
			res.redirect("/register")
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/secrets")
			})
		}
	})
})

app.post("/login", (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password
	})
	req.login(user, (err) => {
		if (err) {
			console.log(err)
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/secrets")
			})
		}
	})
})

app.listen(4000, () => {
	console.log("Server started on port 4000.")
})
