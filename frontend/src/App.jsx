import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Books from "./Pages/Books";
import Articles from "./Pages/Articles";
import Liked from "./Pages/Liked";
import Bookmarked from "./Pages/Bookmarked";
import Layout from "./Layout";
import UserPage from "./Pages/UserPage";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import AdminPanel from "./Pages/AdminPanel";
import ForgotPassword from "./Pages/ForgotPassword";
// book and article
import BookPage from "./Pages/BookPage";
import ArticlePage from "./Pages/ArticlePage";

// provider for user data centralization
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
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
            {/* individual book/articles pages */}
            <Route path="/book/:id" element={<BookPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
