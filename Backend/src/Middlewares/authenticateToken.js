import jwt from 'jsonwebtoken'

export default function authenticateToken(request, response, next) {
  const authorizationHeader = request.headers.authorization
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : null

  if (!token) {
    return response.status(401).json({ message: 'Authentication token is required.' })
  }

  try {
    request.user = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch {
    return response.status(401).json({ message: 'Invalid or expired authentication token.' })
  }
}
