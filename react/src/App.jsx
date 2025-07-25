import { useState } from 'react'

import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth.jsx'
import './index.css'

function App() {
	const [count, setCount] = useState(0)

	return (
		<Routes>
			<Route
				path="/"
				element={
					<Home />
				}
			/>
		</Routes>
	)
}


export default App;
