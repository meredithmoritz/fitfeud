import { UserAuth } from "./context/AuthContext";
import NonUserRoutes from "./routes/NonUserRoutes";
import UserRoutes from "./routes/UserRoutes";
import './index.css';

function App() {
  const { user } = UserAuth();

  return (
    <div>
      {user ? <UserRoutes /> : <NonUserRoutes /> }
    </div>
  );
}

export default App;
