import React, { useState } from 'react'
import { createUser } from './api/user'

function Register() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [isValid, setIsValid] = useState(true)
	const [errorMessage, setErrorMessage] = useState('')

	const handleUsernameChange = e => setUsername(e.target.value)
	const handlePasswordChange = e => setPassword(e.target.value)
	const handleConfirmPasswordChange = e => setConfirmPassword(e.target.value)

	const handleSubmit = e => {
		e.preventDefault()
		if (!username.trim() || !password.trim() || !confirmPassword.trim()) {
			setIsValid(false)
			setErrorMessage('All fields are required.')
			return
		}

		if (password !== confirmPassword) {
			setIsValid(false)
			setErrorMessage('Passwords do not match.')
			return
		}

		setIsValid(true)
		localStorage.setItem('username', username)
		const response = createUser("TEST NAME", username, password)
		console.log(response)
	}

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
				<h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="username">
							Username
						</label>
						<input
							className="w-full px-3 py-2 border rounded"
							type="email"
							id="username"
							value={username}
							onChange={handleUsernameChange}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="password">
							Password
						</label>
						<input
							className="w-full px-3 py-2 border rounded"
							type="password"
							id="password"
							value={password}
							onChange={handlePasswordChange}
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
							Confirm Password
						</label>
						<input
							className="w-full px-3 py-2 border rounded"
							type="password"
							id="confirmPassword"
							value={confirmPassword}
							onChange={handleConfirmPasswordChange}
						/>
					</div>
					{!isValid && (
						<div className="mb-4 text-red-500 text-center">
							{errorMessage}
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

export default Register
