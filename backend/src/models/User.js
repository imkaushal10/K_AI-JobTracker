const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create({ email, password, fullName, resumeText = null }) {
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const query = `
        INSERT INTO users (email, password, full_name, resume_text)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, full_name, created_at
      `;

      const result = await pool.query(query, [
        email,
        hashedPassword,
        fullName,
        resumeText
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = `
        SELECT id, email, full_name, resume_text, created_at 
        FROM users 
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user resume
  static async updateResume(userId, resumeText) {
    try {
      const query = `
        UPDATE users 
        SET resume_text = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id, email, full_name, resume_text
      `;
      const result = await pool.query(query, [resumeText, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;