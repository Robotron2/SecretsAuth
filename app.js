const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const { default: mongoose, mongo } = require("mongoose")
// const mongoose = require("mongoose")

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

//connect mongoose
mongoose.connect("mongodb://localhost:27017/userDB")

//create userSchema

const userSchema = mongoose.Schema({
	email: String,
	password: String
})

const User = new mongoose.model("User", userSchema)

app.get("/", (req, res) => {
	res.render("home")
})
app.get("/register", (req, res) => {
	res.render("register")
})
app.get("/login", (req, res) => {
	res.render("login")
})

app.post("/register", (req, res) => {
	const newUser = new User({
		email: req.body.username,
		password: req.body.password
	})
	newUser
		.save()
		.then((result) => {
			if (result.email && result.password) {
				res.render("secrets")
			} else {
				res.send("A problem occured.")
			}
		})
		.catch((err) => {
			res.send(err)
		})
})

app.post("/login", (req, res) => {
	let userName = req.body.username
	let passWord = req.body.password

	User.findOne({ email: userName })
		.then((foundUser) => {
			if (foundUser) {
				if (foundUser.password === passWord) {
					res.render("secrets")
				} else {
					console.log("User not found.")
					res.send("User not Found!!")
				}
			}
		})
		.catch((err) => {
			console.log(err)
			res.send(err)
		})
})

app.listen(4000, () => {
	console.log("Server started on port 4000.")
})
