// models/aiInsights.model.js
import mongoose from "mongoose";

const aiInsightsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    insights: [
      {
        type: String,
        required: true,
      }
    ],

    recommendations: [
      {
        type: String,
        required: true,
      }
    ],

    suggestedSavingsPlan: [
      {
        category: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      }
    ],

    generatedAt: {
      type: Date,
      default: Date.now,
    }
  },
  {
    timestamps: true,
  }
);

export const AIInsights = mongoose.model("AIInsights", aiInsightsSchema);
