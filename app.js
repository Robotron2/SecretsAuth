const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
// const mongoose = require("mongoose")

const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

app.listen(4000, () => {
	console.log("Server started on port 4000.")
})
