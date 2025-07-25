import { Navigate } from 'react-router-dom'
import { isLoggedIn } from './jwt.js'

const RequireAuth = ({ children }) => {
  console.log('Authenticating user')
  if (!isLoggedIn()) {
    console.log('User not logged in.')
    return <Navigate to="/login" replace />
  }
  return children
}

export default RequireAuth
