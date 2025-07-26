import { Navigate } from 'react-router-dom'
import { validateCookie } from '../api/user'
import { useQuery } from '@tanstack/react-query'

const RequireAuth = ({ children }) => {
  const { isPending, isError, error, data } = useQuery({
    queryKey: ['validate'],
    queryFn: () => validateCookie(),
    staleTime: 30000,
  })

  if (isPending) return 'Loading...'
  if (isError) {
    return `Error: ${error.message}`
  }
  if (!data) return <Navigate to="/login" replace />

  return children
}

export default RequireAuth
