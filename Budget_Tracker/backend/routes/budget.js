const express = require('express');
const Budget = require('../models/Budget');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// User ke saare budget items get kare
router.get('/', requireAuth, async (req, res) => {
  try {
    // Current logged in user ke saare budget items lao
    const budgets = await Budget.findByUserId(req.session.userId);
    
    res.json({
      success: true,
      data: budgets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Budget items fetch karne mein error aaya',
      error: error.message
    });
  }
});

// Naya budget item add kare
router.post('/', requireAuth, async (req, res) => {
  try {
    // Frontend se data lo
    const { category, type, amount, description } = req.body;
    
    // Database mein naya budget entry banao
    const budget = await Budget.create({
      userId: req.session.userId,  // Current user ka ID
      category,    // Jaise: Food, Rent, Salary
      type,        // Jaise: income (kamai) ya expense (kharch)
      amount,      // Kitna paisa
      description  // Kya cheez ka kharch/income
    });
    
    res.status(201).json({
      success: true,
      message: 'Budget item successfully add ho gaya',
      data: budget
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Budget item add karne mein error aaya',
      error: error.message
    });
  }
});

// Budget item delete kare
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    // Pehle check kare ki yeh budget item current user ka hai
    const budget = await Budget.findByIdAndUserId(req.params.id, req.session.userId);
    
    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget item nahi mila'
      });
    }
    
    // Budget item delete kare
    await Budget.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Budget item successfully delete ho gaya'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Budget item delete karne mein error aaya',
      error: error.message
    });
  }
});

// Budget summary get kare (total income, expense, balance, etc.)
router.get('/summary', requireAuth, async (req, res) => {
  try {
    // User ka complete financial summary lao
    const summary = await Budget.getSummary(req.session.userId);
    
    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Summary fetch karne mein error aaya',
      error: error.message
    });
  }
});

module.exports = router;