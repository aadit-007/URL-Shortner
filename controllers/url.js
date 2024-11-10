const shortid= require("shortid");
const URL=require('../models/url');

async function handleGenerateNewShortURL(req,res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:'url is required'})

      const existingURL = await URL.findOne({ redirectURL: body.url });
      if (existingURL) {
          // If it exists, return the existing short URL
          return res.render("home", {
              id: existingURL.shortId,
          });
        }

   const shortId=shortid();

   await URL.create({
    shortId: shortId,
    redirectURL: body.url,
    visitHistory: [],
   })
  return res.render("home",{
    id:shortId,
  })
   //return res.json({id:shortId});
}
async function handleGetAnalytics(req,res){
 const shortId=req.params.shortId;
 const result=await URL.findOne({shortId});
 return res.json({
    totalClicks:result.visitHistory.length,
    analytics:result.visitHistory,
})
}


async function handleDeleteURL(req, res) {
  const { shortId } = req.params;
  const result = await URL.findOneAndDelete({ shortId });
  if (!result) {
      return res.status(404).json({ success: false, message: "URL not found" });
  }
  res.status(200).json({ success: true, message: "URL deleted successfully" });
}

module.exports={
    handleGenerateNewShortURL,
    handleGetAnalytics,
    handleDeleteURL,
}