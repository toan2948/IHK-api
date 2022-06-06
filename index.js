// create an express server
const express = require("express")


//import .env file
const dotenv = require("dotenv")
dotenv.config()

// create an app
const app = express()

//the listening port of the app
app.listen(process.env.PORT || 5000, () => {
    console.log("backend server is running")
})
//import cors // *todo this should be placed above all
const cors = require("cors")
app.use(cors())
// connect the app to the mongo server
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log ("db connection successful"))
    .catch(e => console.log('error: ', e))

// create endpoints for api => we need a folder to organize all many endpoints
// app.get("/api/test", ()=> console.log("test success"))

//allow the server to receive json data
app.use(express.json())

// import routes of user
const userRoute = require("./routes/user")
app.use("/api/users", userRoute) //=> localhost:5000/api/user/test

//import routes of auth
const authRouter = require("./routes/auth")
app.use("/api/auth", authRouter)

//import routes of product
const productRoute = require("./routes/product")
app.use("/api/products", productRoute)


//import routes of carts
const cartRoute = require("./routes/cart")
app.use("/api/cart", cartRoute)


//import routes of order
const orderRoute = require("./routes/order")
app.use("/api/orders", orderRoute)

//import routes of stripe
const checkoutRoute = require("./routes/stripe")
app.use("/api/checkout", checkoutRoute)
