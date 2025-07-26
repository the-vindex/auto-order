export async function createUser(name, email, password) {
  const res = await fetch('http://localhost:3000/api/v1/users', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  })

  if (!res.ok) {
    const body = await res.json()
    const errorMessage =
      'error' in body ? body['error'] : 'An internal server error has occurred.'

    const error = new Error(errorMessage)
    error.response = res
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function loginUser(email, password) {
  const res = await fetch('http://localhost:3000/api/v1/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const body = await res.json()
    const errorMessage =
      'error' in body ? body['error'] : 'An internal server error has occurred.'

    const error = new Error(errorMessage)
    error.response = res
    error.status = res.status
    throw error
  }

  return res.json()
}

export async function logoutUser() {
  const res = await fetch('http://localhost:3000/api/v1/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json', // Add this
    },
  })
}

export async function validateCookie() {
  try {
    const res = await fetch('http://localhost:3000/api/v1/me', {
      method: 'GET',
      credentials: 'include',
    })

    if (res.ok) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}
