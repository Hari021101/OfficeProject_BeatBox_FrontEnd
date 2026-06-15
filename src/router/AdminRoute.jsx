import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has 'Admin' role
  if (!user.roles || !user.roles.includes('Admin')) {
    // If logged in but not an admin, redirect to home or an unauthorized page
    return <Navigate to="/" replace />;
  }

  return children;
}
