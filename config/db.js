
const mongoose = require("mongoose");
const colors = require("colors");


const connectDb = async ()=>{

     try{
         const conn = await mongoose.connect(process.env.MONGO_URL);
         console.log(`connectedd to mongoDb ${conn.connection.host}`.bgGreen.bgRed.bold);
     }catch(error){
         console.log(`error in mongoDb ${error}`.bgRed.bgWhite.bold)

     }
}
module.exports = connectDb;