const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer, // Store the photo as binary data (Buffer)
      contentType: String, // Store the content type (e.g., image/jpeg)
    },
    shopping: {
      type: Boolean,
    },
    tribalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TribalUser',
    },
    totalCost: {
      type: Number,
    },
    sold: { 
      type: Number, 
      default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
