const express=require("express");
const URL=require('../models/url');
const router=express.Router();

router.get('/',async(req,res)=>{
    const allurls= await URL.find({})
    return res.render('home',{
        urls:allurls,
    });
})


router.get('/signup',(req,res)=>{
    return res.render("signup")
})

router.get('/Login',(req,res)=>{
    return res.render("Login")
})


module.exports=router;