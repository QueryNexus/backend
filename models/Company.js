const mongoose = require("mongoose");

const questionAnswerSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const companySchema = new mongoose.Schema(
  {
    uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    industry: String,
    website: String,
    description: String,
    support_hours: String,
    location: String,
    other_branches: [String],
    main_questions: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    other_questions: [questionAnswerSchema],
  },
  {
    timestamps: true,
  }
);

// Adding default main questions
companySchema.pre("save", function (next) {
  if (!this.main_questions || this.main_questions.length === 0) {
    this.main_questions = [
      {
        question: "What are your business hours?",
        answer: "Please update your business hours",
      },
      {
        question: "What is your refund policy?",
        answer: "Please update your refund policy",
      },
      {
        question: "How can I contact customer support?",
        answer: "Please update your contact information",
      },
      {
        question: "What services/products do you offer?",
        answer: "Please update your services/products information",
      },
    ];
  }
  next();
});

module.exports = mongoose.model("Company", companySchema);
