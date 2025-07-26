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
		const body = await res.json();
		if ('error' in body) {
			return body['error'];
		} else {
			return 'An internal server error has occured.'
		}
	}

	return '';
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
		const body = await res.json();
		if ('error' in body) {
			return body['error'];
		} else {
			return 'An internal server error has occured.'
		}
	}

	return '';
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
