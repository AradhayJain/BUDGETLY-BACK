// controllers/setupController.js

import { User } from "../models/user.model.js";
import googleGenAi from "../utils/Gemini.js";
import { AIInsights } from "../models/airesponse.model.js";

// @desc    Handle initial setup data from user
// @route   POST /api/setup
// @access  Private
export const setupUser = async (req, res) => {
  try {
    const {monthlyBudget, incomeSources, PrimarySpendsLimits } = req.body;
    const userId = req.user.id;

    // Validation
    if (
      !monthlyBudget ||
      !Array.isArray(incomeSources) || incomeSources.length === 0 ||
      !Array.isArray(PrimarySpendsLimits) || PrimarySpendsLimits.length === 0
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // Update fields
    user.monthlyBudget = monthlyBudget;
    user.incomeSources = incomeSources;
    user.PrimarySpendsLimits = PrimarySpendsLimits;
    user.onboardingCompleted = true;

    await user.save();

    res.status(200).json({
      message: "Initial setup saved successfully.",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        monthlyBudget: user.monthlyBudget,
        incomeSources: user.incomeSources,
        PrimarySpendsLimits: user.PrimarySpendsLimits,
        onboardingCompleted: user.onboardingCompleted
      }
    });
  } catch (error) {
    console.error("Setup Error:", error);
    res.status(500).json({ message: "Server error during setup." });
  }
};


export const getSetupData = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const { monthlyBudget, incomeSources, PrimarySpendsLimits } = user;

    // Calculate totals
    let totalIncome = 0;
    incomeSources.forEach((income) => {
      totalIncome += parseInt(income.amount, 10);
    });

    const balance = totalIncome - monthlyBudget;

    // ✅ Check if insights already exist
    const existing = await AIInsights.findOne({ user: userId }).sort({ createdAt: -1 });
    if (existing) {
      return res.status(200).json({
        budget: {
          suggestedSavingsPlan: existing.suggestedSavingsPlan,
          insights: existing.insights,
          recommendations: existing.recommendations
        }
      });
    }

    // Build prompt
    const prompt = `
You are a professional financial advisor AI assistant.

A college student has the following financial situation:
{
  "totalIncome": ${totalIncome},
  "balance": ${balance},
  "spendingLimits": ${JSON.stringify(PrimarySpendsLimits)}
}

Please suggest how to allocate the **balance** into savings categories appropriate for a student.

Also, review the provided spending limits and suggest improvements if they seem unbalanced compared to income.

Output in STRICT JSON format:
{
  "suggestedSavingsPlan": [
    { "category": "<string>", "amount": <integer> }
  ],
  "insights": [
    "<short insight on user's spending behavior or planning>"
  ],
  "recommendations": [
    "<short suggestion to optimize spending or saving>"
  ]
}

**Instructions:**
- Use only the balance for savings planning.
- Use PrimarySpendsLimits only for limit analysis — not as actual expenses.
- Do not return markdown, explanation, or currency symbols.
- Use whole numbers only.
`;

    // 🧠 Generate AI data
    const aiRaw = await googleGenAi(prompt);

    let parsedBudget;
    try {
      parsedBudget = JSON.parse(aiRaw);
    } catch (parseError) {
      console.error("❌ Invalid JSON from AI:", aiRaw);
      return res.status(500).json({ message: "AI response not in valid JSON format." });
    }

    // 🗃️ Save to DB for reuse
    const saved = await AIInsights.create({
      user: userId,
      insights: parsedBudget.insights || [],
      recommendations: parsedBudget.recommendations || [],
      suggestedSavingsPlan: parsedBudget.suggestedSavingsPlan || [],
    });

    res.status(200).json({
      budget: {
        suggestedSavingsPlan: saved.savingsPlan,
        insights: saved.insights,
        recommendations: saved.recommendations
      }
    });

  } catch (err) {
    console.error("❌ Error in getSetupData:", err);
    res.status(500).json({ message: "Failed to generate or retrieve AI budget plan." });
  }
};




export const AddCategory = async (req, res) => {
  const userId = req.user.id;
  const { title, amount } = req.body;

  if (!title || !amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Invalid category title or amount." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if category already exists (case-insensitive)
    const exists = user.PrimarySpendsLimits.some(
      (cat) => cat.title.toLowerCase() === title.toLowerCase()
    );

    if (exists) {
      return res.status(400).json({ message: "Category already exists." });
    }

    // Add new category
    user.PrimarySpendsLimits.push({ title, amount: Number(amount) });

    await user.save();

    res.status(201).json({
      message: "Category added successfully.",
      updatedCategories: user.PrimarySpendsLimits,
    });
  } catch (err) {
    console.error("❌ Error adding category:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};

