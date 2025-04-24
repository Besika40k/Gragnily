import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Books from "./Pages/Books";
import Articles from "./Pages/Articles";
import Liked from "./Pages/Liked";
import Bookmarked from "./Pages/Bookmarked";
import Layout from "./Layout";
import UserPage from "./Pages/UserPage";
import SignUp from "./pages/SignUp";
import LogIn from "./Pages/LogIn";
import AdminPanel from "./Pages/AdminPanel";
import ForgotPassword from "./Pages/ForgotPassword";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/books" element={<Books />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/liked" element={<Liked />} />
          <Route path="/bookmarked" element={<Bookmarked />} />
          /* login/signup pages*/
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="/user-page" element={<UserPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
