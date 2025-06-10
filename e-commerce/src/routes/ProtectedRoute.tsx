// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import useStore from '../store/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}) => {
  const { user, isAuthenticated } = useStore();

  // Debug logs
  if (requireAdmin) {
    console.log('ProtectedRoute Debug:', {
      user,
      userRole: user?.rol,
      userRoleTrimmed: user?.rol?.trim().toLowerCase(),
      isAuthenticated: isAuthenticated(),
      requireAdmin,
      hasUser: !!user,
    });
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated()) {
    console.log('Redirecting to /account - not authenticated');
    return <Navigate to="/account" replace />;
  }

  // Si requiere ser admin y no es admin
  // Hacemos la comparación más flexible (sin distinguir mayúsculas y eliminando espacios)
  if (requireAdmin && (!user || user.rol?.trim().toLowerCase() !== 'admin')) {
    console.log('Redirecting to /home - not admin', {
      hasUser: !!user,
      userRole: user?.rol,
      userRoleTrimmed: user?.rol?.trim().toLowerCase(),
      isAdmin: user?.rol?.trim().toLowerCase() === 'admin'
    });
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;