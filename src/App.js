import { UserAuth } from "./context/AuthContext";
import NonUserRoutes from "./routes/NonUserRoutes";
import UserRoutes from "./routes/UserRoutes";
import './index.css';
import NavBar from "./components/NavBar";

function App() {
    // Retrieves the current user's authentication status:
    const context = UserAuth();

    const { user, loading } = context;

  if (loading) {
      return null; // Do not render anything while loading page
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
