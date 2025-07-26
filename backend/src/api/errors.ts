export class BadRequestError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class UserNotAuthenticatedError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class UserForbiddenError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class UserAlreadyExistsError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
	}
}
