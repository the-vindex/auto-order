import React, { useState } from 'react'

function Login() {
  const [username, setUsername] = useState('')
  const [isValid, setIsValid] = useState(true)

  const handleUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (username.trim()) {
      setIsValid(true)
      localStorage.setItem('username', username)
    } else {
      setIsValid(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              username
            </label>
            <input
              className="w-full px-3 py-2 border rounded"
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          {!isValid && (
            <div className="mb-4 text-red-500 text-center">
              Username and password are required.
            </div>
          )}
          <button
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
