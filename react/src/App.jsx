// TODO: The frontend is currently written in JavaScript.
// Migrating to TypeScript would introduce static typing, which can help catch errors early,
// improve code quality, and make the codebase easier to maintain, especially as it grows.
// The backend is already in TypeScript, so this would also make the entire project more consistent.

import Home from './Home.jsx'
import { Routes, Route } from 'react-router-dom'

import RequireAuth from './auth/RequireAuth.jsx'
import './index.css'
import Landing from './Landing.jsx'
import Login from './Login.jsx'
import Register from './Register.jsx'
import NotFound from './NotFound.jsx'

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
      <Route path="/register" element={<Register />} />
      <Route path="/landing" element={<Landing />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
