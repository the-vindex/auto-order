
// frontend/src/api/user.ts
export async function createUser(name, email, password) {
	const res = await fetch('http://localhost:3000/api/v1/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email, password }),
	});

	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to create user: ${err}`);
	}

	return await res.json();
}

export async function loginUser(email, password) {
	const res = await fetch('http://localhost:3000/api/v1/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const err = await res.text();
		return err
	}

	return;
}
