const router = require("express").Router()
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")

// import User Schema
const User = require("../models/User")

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    // password: req.body.password, => it should be encrypted, otherwise the passowrd will be visible in the database
    password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()

  })
  // send the new user to the DB ( we use async because it takes time for data to be saved in the DB,
  // the command below save() like console.log may run before the new user is saved successfully)
  try { // use try. catch to catch the error if server has the problem during saving the new User.
    const savedUser = await newUser.save()
    console.log(savedUser)
    //201 mean 'successfully added'
    res.status(201).json(savedUser)
  }
  catch (err)
  {console.log(err)
    res.status(500).json(err)
  }
})

// LOGIN
router.post("/login", async (req,res) => {
  try {
    const user = await User.findOne({username: req.body.username})
    !user && res.status(401).json("wrong username")
    //toString(CryptoJS.enc.Utf8) is to get the right password
    const passwordFromDB = await CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8)
    if (passwordFromDB !== req.body.password) {
      res.status(401).json("wrong password")
    }
    else {
      const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin
          },
          process.env.JWT_SEC,
          {
            expiresIn: "3d"
          }
      )
      res.status(201).json({user, accessToken})
    }
  }
  catch (err)
  {console.log(err)
    res.status(500).json(err)
  }
})



module.exports = router
