import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { validateCookie } from '../api/user';

const RequireAuth = ({ children }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const result = await validateCookie();
				setIsLoggedIn(result);
			} catch (err) {
				setIsLoggedIn(false);
			} finally {
				setIsLoading(false);
			}
		};
		checkAuth();
	}, []);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!isLoggedIn) {
		return <Navigate to="/login" replace />;
	}

	return children;
};

export default RequireAuth;
