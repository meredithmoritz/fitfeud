import { UserAuth } from "./context/AuthContext.jsx";
import NonUserRoutes from "./routes/NonUserRoutes.jsx";
import UserRoutes from "./routes/UserRoutes.jsx";
import './index.css';
import NavBar from "./components/NavBar.jsx";

function App() {
  // Retrieves the current user's authentication status:
  const { user, loading } = UserAuth();

  if (loading) {
      return null;
  }

  return (
    <div>
      <NavBar />
      {/* Check if the user is logged in to route them properly: */}
      {user ? <UserRoutes /> : <NonUserRoutes /> }
    </div>
  );
}

export default App;
