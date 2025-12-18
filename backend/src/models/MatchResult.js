const { pool } = require('../config/database');

class MatchResult {
  // Create or update match result
  static async createOrUpdate(jobApplicationId, matchData) {
    try {
      const { matchScore, strengths, missingQualifications, suggestions } = matchData;

      // Check if result already exists
      const existingQuery = 'SELECT id FROM match_results WHERE job_application_id = $1';
      const existing = await pool.query(existingQuery, [jobApplicationId]);

      if (existing.rows.length > 0) {
        // Update existing result
        const updateQuery = `
          UPDATE match_results
          SET 
            match_score = $1,
            strengths = $2,
            missing_qualifications = $3,
            suggestions = $4,
            created_at = CURRENT_TIMESTAMP
          WHERE job_application_id = $5
          RETURNING *
        `;

        const result = await pool.query(updateQuery, [
          matchScore,
          JSON.stringify(strengths),
          JSON.stringify(missingQualifications),
          JSON.stringify(suggestions),
          jobApplicationId
        ]);

        return result.rows[0];
      } else {
        // Create new result
        const insertQuery = `
          INSERT INTO match_results (
            job_application_id, match_score, strengths, 
            missing_qualifications, suggestions
          )
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;

        const result = await pool.query(insertQuery, [
          jobApplicationId,
          matchScore,
          JSON.stringify(strengths),
          JSON.stringify(missingQualifications),
          JSON.stringify(suggestions)
        ]);

        return result.rows[0];
      }
    } catch (error) {
      throw error;
    }
  }

  // Get match result for a job application
  static async findByJobId(jobApplicationId) {
    try {
      const query = 'SELECT * FROM match_results WHERE job_application_id = $1';
      const result = await pool.query(query, [jobApplicationId]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const match = result.rows[0];
      
      // Parse JSON fields
      return {
        id: match.id,
        jobApplicationId: match.job_application_id,
        matchScore: match.match_score,
        strengths: JSON.parse(match.strengths),
        missingQualifications: JSON.parse(match.missing_qualifications),
        suggestions: JSON.parse(match.suggestions),
        createdAt: match.created_at
      };
    } catch (error) {
      throw error;
    }
  }

  // Delete match result
  static async delete(jobApplicationId) {
    try {
      const query = 'DELETE FROM match_results WHERE job_application_id = $1 RETURNING *';
      const result = await pool.query(query, [jobApplicationId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MatchResult;