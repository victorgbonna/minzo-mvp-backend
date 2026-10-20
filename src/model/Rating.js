const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const RatingSchema = new Schema(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    lastRatingUpdated:{
        type:Date,
        default: Date.now,
    },
    reasonForDisapproval:{  
        type: String,
        default: null
    }
     
  },
  {
    timestamps: true,
  }
);


const Rating = mongoose.model("Rating", RatingSchema);

module.exports = Rating;


