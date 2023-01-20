// @ts-nocheck
const mongoose=require("mongoose");
const DBconnection=mongoose.connect(process.env.DB_URL)

module.exports=DBconnection;