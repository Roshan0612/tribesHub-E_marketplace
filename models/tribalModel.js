const mongoose = require("mongoose");

const tribalUserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true },

  uniqueId: { 
    type: String, 
    required: true, 
    unique: true },  

  photo: {
    data: Buffer,
    contentType: String,
  },
  location: { 
    type: String, 
    required: false },  
  sales: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantitySold: { type: Number },
        amountEarned: { type: Number },
      },
  ],
  
});

module.exports = mongoose.model("TribalUser", tribalUserSchema);
