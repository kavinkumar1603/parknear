import { Navigate, useLocation, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const location = useLocation();
    
    if (!token) {
        // Redirect to login and save the attempted URL
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    return <Outlet />;
};

export default ProtectedRoute;
