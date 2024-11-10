const User = require("../models/user");
const { use } = require("../routes/user");
const {v4:uuidv4 } = require('uuid')
const {setUser} =require('../service/auth')

async function handleUsersSignup(req, res) {
    const {name, email, password} =req.body;
    await User.create({
        name,
        email,
        password,
    });
    return res.redirect('/');
}

async function handleUsersLogin(req, res) {
    const {name, email, password} =req.body;
   const user = await User.findOne({email, password});
  // console.log('User',user)
   if(!user) return res.render("login", {
    error: "Invalid Username or Password",
   });
   const sessionId =uuidv4();
   setUser(sessionId, user);
   res.cookie("uid", sessionId);
    return res.redirect("/");
}

module.exports = {
    handleUsersSignup,
    handleUsersLogin,
}
