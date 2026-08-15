import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import UserModel from '../Models/UserModel.js'

class AuthController {
  async login(request, response) {
    try {
      const { username, password } = request.body

      if (!username || !password) {
        return response.status(400).json({ message: 'Username and password are required.' })
      }

      const user = await UserModel.findByUsername(username)

      if (!user) {
        return response.status(401).json({ message: 'Invalid username or password.' })
      }

      const isPasswordValid = await bcrypt.compare(password, user.PasswordHash)

      if (!isPasswordValid) {
        return response.status(401).json({ message: 'Invalid username or password.' })
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is missing from the environment configuration.')
      }

      const token = jwt.sign(
        { userId: user.UserId, username: user.Username },
        process.env.JWT_SECRET,
        { expiresIn: '8h' },
      )

      return response.status(200).json({
        message: 'Login successful.',
        token,
        user: {
          id: user.UserId,
          fullName: user.FullName,
          username: user.Username,
        },
      })
    } catch (error) {
      console.error('Login error:', error.message)
      return response.status(500).json({ message: 'Unable to log in. Please try again.' })
    }
  }
}

export default new AuthController()
