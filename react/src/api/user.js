export async function createUser(name, email, password) {
	const res = await fetch('http://localhost:3000/api/v1/users', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email, password }),
	});

	if (!res.ok) {
		switch (res.status) {
			//TODO maybe should throw these errors from the server side?
			case 400:
				return { 'error': 'Invalid data.' }
			case 409:
				return { 'error': 'User with given email already exists.' }
			default:
				return { 'error': 'Internal server error occurred.' }
		}
	}

	return {};
}

export async function loginUser(email, password) {
	const res = await fetch('http://localhost:3000/api/v1/login', {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		switch (res.status) {
			case 400:
				return { 'error': 'Invalid data.' }
			case 404:
				return { 'error': 'No user found for given email.' }
			case 401:
				return { 'error': 'Password is incorrect.' }
			default:
				return { 'error': 'Internal server error occurred.' }
		}
	}

	return {};
}

export async function validateCookie() {
	try {
		const res = await fetch('http://localhost:3000/api/v1/me', {
			method: 'GET',
			credentials: 'include',
		});

		if (res.ok) {
			return true;
		} else {
			return false;
		}
	}
	catch (error) {
		return false;
	}
}
