import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook personalizado para verificar permisos de administrador
 * 
 * @example
 * ```tsx
 * const { isAdmin, isSuperAdmin, role, canManageProducts } = useAdmin();
 * 
 * if (!isAdmin) return <AccessDenied />;
 * 
 * return (
 *   <div>
 *     {canManageProducts && <ProductEditor />}
 *     {isSuperAdmin && <UserManagement />}
 *   </div>
 * );
 * ```
 */
export function useAdmin() {
  const { role, isAdmin, isSuperAdmin, user } = useAuth();

  return {
    /** Rol del usuario actual */
    role,
    
    /** True si el usuario es admin o super_admin */
    isAdmin,
    
    /** True si el usuario es super_admin */
    isSuperAdmin,
    
    /** True si el usuario es customer (no admin) */
    isCustomer: role === 'customer',
    
    /** Usuario actual */
    user,

    // Permisos específicos (puedes agregar más según necesites)
    
    /** Puede gestionar productos (crear, editar, eliminar) */
    canManageProducts: isAdmin,
    
    /** Puede gestionar stock */
    canManageStock: isAdmin,
    
    /** Puede ver todas las órdenes */
    canViewAllOrders: isAdmin,
    
    /** Puede gestionar órdenes (cambiar estado, etc.) */
    canManageOrders: isAdmin,
    
    /** Puede aplicar códigos promocionales */
    canManagePromoCodes: isAdmin,
    
    /** Puede ver analytics */
    canViewAnalytics: isAdmin,
    
    /** Puede gestionar usuarios (solo super_admin) */
    canManageUsers: isSuperAdmin,
    
    /** Puede cambiar roles (solo super_admin) */
    canManageRoles: isSuperAdmin,
    
    /** Puede acceder a configuración del sistema (solo super_admin) */
    canAccessSystemConfig: isSuperAdmin,
  };
}
