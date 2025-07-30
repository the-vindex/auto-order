export async function createUser(name, email, password) {
	const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/users`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email, password }),
	})

	const responseBody = await res.json()

	if (!res.ok) {
		const errorMessage =
			'error' in responseBody
				? responseBody['error']
				: 'An internal server error has occurred.'

		const error = new Error(errorMessage)
		error.response = res
		error.status = res.status
		throw error
	}

	const date = new Date()
	date.setTime(date.getTime() + 24 * 60 * 60 * 1000) // 24 hours in ms
	const expires = 'expires=' + date.toUTCString()

	// TODO: The frontend sets the username and email in plain cookies.  This leaks user
	// information to client‑side scripts and does not provide any security benefit because
	// authentication is handled via an HTTP‑only token cookie set by the server.  Consider
	// removing these cookies entirely or replacing them with a minimal, non‑PII flag indicating
	// that the user is logged in.
	document.cookie = `username=${responseBody.name}; ${expires}; path=/`
	document.cookie = `email=${responseBody.email}; ${expires}; path=/`

	return responseBody
}

export async function loginUser(email, password) {
	const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/login`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	})
	const body = await res.json()

	if (!res.ok) {
		const errorMessage =
			'error' in body ? body['error'] : 'An internal server error has occurred.'

		const error = new Error(errorMessage)
		error.response = res
		error.status = res.status
		throw error
	}

	const date = new Date()
	date.setTime(date.getTime() + 24 * 60 * 60 * 1000) // 24 hours in ms
	const expires = 'expires=' + date.toUTCString()

	// TODO: Avoid storing username and email in plain cookies.  See corresponding comment in
	// createUser().  Use secure, HTTP‑only cookies set by the server for authentication and
	// store non‑sensitive data in React state or context instead.
	document.cookie = `username=${body.name}; ${expires}; path=/`
	document.cookie = `email=${body.email}; ${expires}; path=/`

	return body
}

export async function logoutUser() {
	await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/logout`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json', // Add this
		},
	})

	//expire cookies
	document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
	document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

export async function validateCookie() {
	try {
		const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/me`, {
			method: 'GET',
			credentials: 'include',
		})

		if (res.ok) {
			return true
		} else {
			return false
		}
	} catch {
		return false
	}
}
