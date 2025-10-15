const db = require('../config/database');

class Budget {
  // Naya budget item create kare
  static async create(budgetData) {
    const { userId, category, type, amount, description } = budgetData;
    
    // Database se saare budgets lao
    const budgets = db.readBudgets();
    
    // Naya budget object banao
    const newBudget = {
      id: Date.now().toString(),  // Unique ID time se banaye
      userId,           // Kaun sa user add kar raha hai
      category,         // Category jaise: Food, Rent, Shopping
      type,             // Type: income (kamai) ya expense (kharch)
      amount: parseFloat(amount),  // Paisa number mein convert kare
      description: description || '',  // Description, agar nahi hai toh empty string
      date: new Date().toISOString(),  // Aaj ka date
      createdAt: new Date().toISOString()  // Creation time
    };
    
    // Naya budget list mein add kare
    budgets.push(newBudget);
    
    // Database mein save kare
    db.writeBudgets(budgets);
    
    return newBudget;
  }

  // Specific user ke saare budget items lao
  static async findByUserId(userId) {
    const budgets = db.readBudgets();
    
    // Sirf usi user ke budgets filter kare
    // Aur newest pehle dikhaye (date ke hisab se sort kare)
    return budgets
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Specific budget item usi user ka hai ya nahi check kare
  static async findByIdAndUserId(id, userId) {
    const budgets = db.readBudgets();
    
    // Budget item dhoondhe jo ID se match kare aur usi user ka ho
    return budgets.find(b => b.id === id && b.userId === userId);
  }

  // Budget item delete kare
  static async delete(id) {
    const budgets = db.readBudgets();
    const initialLength = budgets.length;
    
    // Jo item delete karna hai use hata de
    const filteredBudgets = budgets.filter(b => b.id !== id);
    
    // Check kare koi item delete hua ya nahi
    if (filteredBudgets.length < initialLength) {
      // Updated list database mein save kare
      db.writeBudgets(filteredBudgets);
      return { deleted: true };  // Success
    }
    return { deleted: false };   // Item nahi mila
  }

  // User ka financial summary calculate kare
  static async getSummary(userId) {
    const budgets = db.readBudgets();
    
    // Sirf current user ke budgets lo
    const userBudgets = budgets.filter(b => b.userId === userId);
    
    // Total income calculate kare
    const totalIncome = userBudgets
      .filter(b => b.type === 'income')  // Sirf income wale items
      .reduce((sum, b) => sum + b.amount, 0);  // Sabka amount jod de
    
    // Total expense calculate kare  
    const totalExpense = userBudgets
      .filter(b => b.type === 'expense')  // Sirf expense wale items
      .reduce((sum, b) => sum + b.amount, 0);  // Sabka amount jod de
    
    // Balance nikal de (income - expense)
    const balance = totalIncome - totalExpense;
    
    // Summary object return kare
    return {
      totalIncome,   // Total kamai
      totalExpense,  // Total kharch
      balance        // Bacha hua paisa
    };
  }
}

module.exports = Budget;