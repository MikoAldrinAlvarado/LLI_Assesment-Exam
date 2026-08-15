import { sql, poolPromise } from '../config/database.js'

class UserModel {
  async findByUsername(username) {
    const pool = await poolPromise
    const result = await pool
      .request()
      .input('username', sql.NVarChar(50), username)
      .query(`
        SELECT UserId, FullName, Username, PasswordHash
        FROM dbo.Users
        WHERE Username = @username AND IsActive = 1
      `)

    return result.recordset[0] || null
  }
}

export default new UserModel()
