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
	const body = await res.json()

	if (!res.ok) {
		const errorMessage =
			'error' in body ? body['error'] : 'An internal server error has occurred.'

		const error = new Error(errorMessage)
		error.response = res
		error.status = res.status
		throw error
	}

	const date = new Date();
	date.setTime(date.getTime() + (24 * 60 * 60 * 1000)); // 24 hours in ms
	const expires = "expires=" + date.toUTCString();

	document.cookie = `username=${body.name}; ${expires}; path=/`;
	document.cookie = `email=${body.email}; ${expires}; path=/`;

	return body
}

export async function logoutUser() {
	const res = await fetch('http://localhost:3000/api/v1/logout', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json', // Add this
		},
	})

	//expire cookies
	document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
	document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
