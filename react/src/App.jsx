import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './auth/RequireAuth.jsx'
import './index.css'

import Login from './Login.jsx'
function App() {
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
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
