const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Naya user create kare (register)
  static async create(userData) {
    const { username, email, password } = userData;
    
    // Password ko secure hash mein convert kare
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Database se saare users lao
    const users = db.readUsers();
    
    // Check kare ki user pehle se exists karta hai kya
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
      throw new Error('User already exists');  // Agar hai toh error throw kare
    }
    
    // Naya user object banao
    const newUser = {
      id: Date.now().toString(),      // Unique ID time se banaye
      username,                       // User ka username
      email,                          // User ka email
      password: hashedPassword,       // Secure hashed password
      createdAt: new Date().toISOString()  // Creation date
    };
    
    // Naya user list mein add kare
    users.push(newUser);
    
    // Database mein save kare
    db.writeUsers(users);
    
    // Password ko chod kar baaki details return kare (security ke liye)
    return { id: newUser.id, username, email };
  }

  // Email se user dhoondhe
  static async findByEmail(email) {
    const users = db.readUsers();
    return users.find(u => u.email === email);
  }

  // Username se user dhoondhe
  static async findByUsername(username) {
    const users = db.readUsers();
    return users.find(u => u.username === username);
  }

  // ID se user dhoondhe
  static async findById(id) {
    const users = db.readUsers();
    const user = users.find(u => u.id === id);
    if (user) {
      // Password ko chod kar baaki details return kare
      return {
        id: user.id,
        username: user.username,
        email: user.email
      };
    }
    return null;  // User nahi mila
  }

  // Password check kare (login ke time)
  static async comparePassword(candidatePassword, hashedPassword) {
    // User ka diya hua password aur database ka stored hash match kare
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;