import mysql, { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2/promise';

// Define types for our database tables
export interface UserProfile extends RowDataPacket {
  id: number;
  clerk_id: string;
  name: string;
  age: number;
  occupation: string;
  monthly_income: number;
  monthly_expenses: number;
  dependents: number;
  investment_experience: string;
  existing_investments: string;
  preferred_investment_types: string;
  risk_tolerance: string;
  financial_goals: string;
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessage extends RowDataPacket {
  id: number;
  user_id: number;
  message: string;
  is_ai: boolean;
  created_at: Date;
}

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'nikhil123',
  database: process.env.MYSQL_DATABASE || 'wealth_companion',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
pool.getConnection()
  .then(connection => {
    console.log('Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Export the query function with better error handling and types
export const db = {
  async query<T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T> {
    try {
      console.log('Executing query:', sql);
      console.log('With params:', params);
      const [results] = await pool.execute<T>(sql, params);
      console.log('Query results:', results);
      return results;
    } catch (error) {
      console.error('Database query error:', error);
      throw new Error(`Database error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}; 