const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;


const BusinessSchema = new Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    
    type: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    county: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    businessPhone: {
      type: String,
    },
    businessEmail: {
      type: String,
      required: false,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    
    openingHours: {
      type: Mixed,
    },
    registrationDocumentUrl: {
      type: String,
    },
    doctors: {
      type: [String]
    },
    headNurse:{
        type: String,
    },
    services: {
      type: Mixed
    },
    location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
            default: [],
          },
        },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    badgeStatus: {
      type: String,
      enum: ["verified", "unverified"],
      default: "unverified",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratings:{
      type: [
        {
          ratingId: {
            type: Schema.Types.ObjectId,
            ref: "Rating",
          },
          value: {
            type: Number,
            required: true,
          },
        },
      ],
      default: [],
    },
    // totalRating: {
    //   type: Number,
    //   default: 0,
    // },
    // ratingCount: {
    //   type: Number,
    //   default: 0,
    // },
  },
  {
    timestamps: true,
  }
);
// BusinessSchema.pre("save", function (next) {
//   if (!this.isModified("city") && this.location?.coordinates?.length) {
//     return next();
//   }

//   const city = liberiaCities.find(
//     (item) =>
//       item.city.toLowerCase() === this.city?.trim().toLowerCase()
//   );

//   if (!city) {
//     return next(
//       new Error(`Coordinates not found for city: ${this.city}`)
//     );
//   }

//   this.latitude = city.lat;
//   this.longitude = city.longitude;

//   this.location = {
//     type: "Point",
//     coordinates: [city.longitude, city.lat],
//   };

//   next();
// })
BusinessSchema.index({ location: "2dsphere" });

const Business = mongoose.model("Business", BusinessSchema);

module.exports = Business;