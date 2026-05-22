import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import { useAuth } from "./context/auth";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Explore from "./pages/explore/explore";
import Profile from "./pages/profile/profile";
import Followers from "./pages/followers/followers";

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();

  const location = useLocation();

  const unauth = ["/login", "/register"];

  const isUnauthPath = unauth.some((path) =>
    location.pathname.startsWith(path),
  );

  if (!isAuthenticated && !isUnauthPath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
const routes = createRoutesFromElements(
  <Route errorElement={<></>}>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Signup />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<Explore />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/followers" element={<Followers />} />
    </Route>
  </Route>,
);

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
