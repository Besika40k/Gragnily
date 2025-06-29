import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Books from "./Pages/Books";
import Articles from "./Pages/Articles";
import Liked from "./Pages/Liked";
import EssayPage from "./Pages/essayPage/EssayPage";
import EssayUpload from "./modules/Essays/EssayUpload";
import Layout from "./Layout";
import UserPage from "./Pages/UserPage";
import SignUp from "./Pages/SignUp";
import LogIn from "./Pages/LogIn";
import AdminPanel from "./Pages/AdminPanel";
import ForgotPassword from "./Pages/ForgotPassword";
import EssayEdit from "./Pages/essayEdit/EssayEdit";
import MyEssayPage from "./Pages/myEssayPage/MyEssayPage";

// book and article
import BookPage from "./Pages/BookPage";
import ArticlePage from "./Pages/ArticlePage";
import EssayIndividualPage from "./modules/Essays/EssayIndividualPage";
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
            <Route path="/essay" element={<EssayPage />} />
            <Route path="/essay/upload" element={<EssayUpload />} />
            /* login/signup pages*/
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route
              path="forgot-password-out"
              element={<ForgotPassword logIn={false} />}
            />
            <Route
              path="forgot-password-in"
              element={<ForgotPassword logIn={true} />}
            />
            <Route path="/my-essay-page" element={<MyEssayPage />} />
            <Route path="/user-page" element={<UserPage />} />
            {/* individual book/articles/essays pages */}
            <Route path="/books/:id" element={<BookPage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route path="/essays/:id" element={<EssayIndividualPage />} />
            <Route path="/essays/edit/:id" element={<EssayEdit />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
