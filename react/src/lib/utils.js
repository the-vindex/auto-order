import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
	return twMerge(clsx(inputs));
}

export function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	console.log(parts)
	if (parts.length === 2) return parts.pop().split(';').shift();
}
