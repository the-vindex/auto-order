import type { Response } from "express";

export function respondWithError(res: Response, code: number, message: string) {
	respondWithJSON(res, code, { error: message });
}

export function respondWithJSON(res: Response, code: number, payload: any) {
	res.header("Content-Type", "application/json");
	const body = JSON.stringify(payload);
	res.status(code).send(body);
	res.end();
}
