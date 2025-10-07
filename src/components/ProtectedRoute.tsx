import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ShieldAlert } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireSuperAdmin = false 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si requiere super admin y no lo es
  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold">Acceso Denegado</h1>
          <p className="text-muted-foreground">
            Necesitás permisos de Super Administrador para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  // Si requiere admin y no lo es
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="mb-2 text-2xl font-bold">Acceso Denegado</h1>
          <p className="text-muted-foreground">
            Necesitás permisos de Administrador para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  // Usuario autenticado y con permisos correctos
  return <>{children}</>;
}
