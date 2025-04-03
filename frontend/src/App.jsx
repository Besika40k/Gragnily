import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Books from './Pages/Books'
import Articles from './Pages/Articles'
import Liked from './Pages/Liked'
import Bookmarked from './Pages/Bookmarked'
import Layout from './Layout'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/bookmarked" element={<Bookmarked />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
