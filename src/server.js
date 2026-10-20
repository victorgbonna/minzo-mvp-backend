require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const consolelog = require("./utils/consolelog");
const routes = require("./routes/api");
const cron = require('node-cron');
const Rating = require("./model/Rating");
const Business = require("./model/Business");

const app = express();


// app.use( cors( {
//   // origin:[ "https://www.use-webbi.com",  "https://use-webbi.com",  "https://use-webbi.vercel.app"]
// }) )
app.use(cors({
  origin: '*'
}));

app.use(express.urlencoded({ limit: "1000000mb", extended: true }));
app.use(express.json({ limit: "1000000mb", extended: true }));

const db = require("./config/constants").mongoURI;

// Run every 1 hour → "0 */1 * * *"



cron.schedule("0 0 * * *", async () => {
  try {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() - 24);

    const expiredReviews = await Rating.find({
      status: "active",
      createdAt: { $lte: expiryDate },
    }).select("_id business rating").sort({createdAt:-1});

    if (!expiredReviews.length) return;

    const groupedReviews = expiredReviews.reduce((groups, review) => {
      const businessId = review.business.toString();

      if (!groups[businessId]) {
        groups[businessId] = [];
      }

      groups[businessId].push(review._id);

      return groups;
    }, {});

    await Rating.updateMany(
      {
        _id: { $in: expiredReviews.map((review) => review._id) },
        status: "active",
      },
      {
        $set: { status: "expired" },
      }
    );

    for (const [businessId, reviewIds] of Object.entries(groupedReviews)) {
      const business = await Business.findByIdAndUpdate(
        businessId,
        {
          $pull: {
            ratings: {
              ratingId: { $in: reviewIds },
            },
          },
        },
        { new: true }
      );

      if (!business) continue;

      const totalRating = business.ratings.reduce(
        (total, rating) => total + rating.value,
        0
      );

      const ratingCount = business.ratings.length;

      const averageRating =
        ratingCount > 0 ? totalRating / ratingCount : 0;

      await Business.updateOne(
        { _id: businessId },
        {
          $set: {
            averageRating
          },
        }
      );
    }
  } catch (error) {
    console.error("Review expiration cron job failed:", error);
  }
});

mongoose
  .connect(db)
  .then(async() => {
    console.log("MongoDB Connected")
    // await Request.updateMany({},{status:'active'})
  })
  .catch((err) => console.log(err));

// global.appRoot = path.resolve(__dirname);

const PORT = process.env.PORT || 5001;
app.listen(PORT, (err) => {
  console.log("Server now running on port " + PORT);
});

routes(app);