const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    industry: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    privacy_policy: String,
    terms_and_conditions: String,
    returnpolicy: String,
    services: [String],
    products:[String],
    services_provided_in: [String],
    board_members:{
      ceo: {type: String},
      cto: {type: String},
      cfo: {type: String},
      cmo: {type: String},
    },
    expected_service_time:{type: String},
    founded_year: Number,
    company_size: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    contact: {
      email: {
        type: String,
        required: true,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postal_code: String,
    },
    social_media: {
      linkedin: String,
      twitter: String,
      facebook: String,
      instagram: String,
    },
    support_hours: String,
    location: {
      type: String,
      required: true,
    },
    logo_url: String,
    other_details: mongoose.Schema.Types.Mixed, // This can store any type of data
  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model("Company", companySchema);
