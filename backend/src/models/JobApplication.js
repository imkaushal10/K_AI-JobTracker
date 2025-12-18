const { pool } = require('../config/database');

class JobApplication {
  // Create new job application
  static async create(userId, jobData) {
    try {
      const {
        companyName,
        jobTitle,
        jobDescription,
        jobUrl,
        location,
        salaryRange,
        status = 'applied',
        appliedDate,
        notes
      } = jobData;

      const query = `
        INSERT INTO job_applications (
          user_id, company_name, job_title, job_description,
          job_url, location, salary_range, status, applied_date, notes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;

      const result = await pool.query(query, [
        userId,
        companyName,
        jobTitle,
        jobDescription || null,
        jobUrl || null,
        location || null,
        salaryRange || null,
        status,
        appliedDate || new Date(),
        notes || null
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get all applications for a user
  static async findByUserId(userId, filters = {}) {
    try {
      let query = 'SELECT * FROM job_applications WHERE user_id = $1';
      const params = [userId];
      let paramIndex = 2;

      // Filter by status if provided
      if (filters.status) {
        query += ` AND status = $${paramIndex}`;
        params.push(filters.status);
        paramIndex++;
      }

      // Sort by most recent first
      query += ' ORDER BY applied_date DESC, created_at DESC';

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // Get single application by ID
  static async findById(id, userId) {
    try {
      const query = `
        SELECT * FROM job_applications 
        WHERE id = $1 AND user_id = $2
      `;
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update application
  static async update(id, userId, updates) {
    try {
      const {
        companyName,
        jobTitle,
        jobDescription,
        jobUrl,
        location,
        salaryRange,
        status,
        appliedDate,
        notes
      } = updates;

      const query = `
        UPDATE job_applications
        SET 
          company_name = COALESCE($1, company_name),
          job_title = COALESCE($2, job_title),
          job_description = COALESCE($3, job_description),
          job_url = COALESCE($4, job_url),
          location = COALESCE($5, location),
          salary_range = COALESCE($6, salary_range),
          status = COALESCE($7, status),
          applied_date = COALESCE($8, applied_date),
          notes = COALESCE($9, notes),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10 AND user_id = $11
        RETURNING *
      `;

      const result = await pool.query(query, [
        companyName,
        jobTitle,
        jobDescription,
        jobUrl,
        location,
        salaryRange,
        status,
        appliedDate,
        notes,
        id,
        userId
      ]);

      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete application
  static async delete(id, userId) {
    try {
      const query = `
        DELETE FROM job_applications 
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get applications grouped by status (for Kanban board)
  static async getByStatus(userId) {
    try {
      const query = `
        SELECT 
          status,
          json_agg(
            json_build_object(
              'id', id,
              'companyName', company_name,
              'jobTitle', job_title,
              'location', location,
              'salaryRange', salary_range,
              'appliedDate', applied_date,
              'createdAt', created_at
            ) ORDER BY applied_date DESC
          ) as applications
        FROM job_applications
        WHERE user_id = $1
        GROUP BY status
      `;

      const result = await pool.query(query, [userId]);
      
      // Transform into object with status as keys
      const grouped = {
        applied: [],
        interviewing: [],
        offered: [],
        rejected: [],
        accepted: []
      };

      result.rows.forEach(row => {
        grouped[row.status] = row.applications || [];
      });

      return grouped;
    } catch (error) {
      throw error;
    }
  }

  // Get statistics
  static async getStats(userId) {
    try {
      const query = `
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'applied') as applied,
          COUNT(*) FILTER (WHERE status = 'interviewing') as interviewing,
          COUNT(*) FILTER (WHERE status = 'offered') as offered,
          COUNT(*) FILTER (WHERE status = 'rejected') as rejected,
          COUNT(*) FILTER (WHERE status = 'accepted') as accepted
        FROM job_applications
        WHERE user_id = $1
      `;

      const result = await pool.query(query, [userId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = JobApplication;