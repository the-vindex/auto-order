import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
}

export default App;
