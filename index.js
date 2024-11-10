const express = require("express");
const {connectToMongoDB}=require("./connect");
const  path=require("path");
const { name } = require("ejs");
const cookieParser = require("cookie-parser") 
const { restrictToLoggedinUserOnly }=require('./middlewares/auth')

/// Routes
const URL=require('./models/url');
const staticRouter= require("./routes/staticRouter");
const urlRoute = require('./routes/url');
const userRoutes = require('./routes/user')

const app=express();
const PORT=8001;

connectToMongoDB('mongodb://localhost:27017/short-url').then(()=>console.log('Mongodb connected'));


app.set("view engine","ejs")
app.set("views",path.resolve('./views'))


// middleware

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());




// use of Routes
app.use("/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoutes)
app.use("/",staticRouter);


app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { $push: { visitHistory: { timestamp: Date.now() } } },
        { new: true } // Optional: Returns the updated document
    );

    if (entry) {
        res.redirect(entry.redirectURL);
    } else {
        res.status(404).send("URL not found");
    }
});

app.listen(PORT,()=>console.log(`Server started at Port:${PORT}`));
