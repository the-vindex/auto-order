
import { useState } from 'react'

import './App.css'
import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './RequireAuth.jsx'

function App() {
	const [count, setCount] = useState(0)

	return (
		<Routes>
			<Route
				path="/"
				element={
					<RequireAuth>
						<Home />
					</RequireAuth>
				}
			/>
		</Routes>
	)
>>>>>>> main


export default App;
