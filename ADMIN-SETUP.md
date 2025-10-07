# 🔐 Sistema de Roles de Administrador - Guía Completa

## 📋 Resumen

He implementado un sistema completo de roles de administrador con 3 niveles de permisos:

- **customer** (default): Usuario normal
- **admin**: Administrador con permisos elevados
- **super_admin**: Super administrador con todos los permisos

---

## 🚀 Configuración Inicial (5 minutos)

### **Paso 1: Ejecutar el Script SQL**

1. Abrí tu Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/khyfxjjvtftaffhhoyny
   ```

2. Andá a **SQL Editor**

3. Copiá y pegá el contenido de `add-admin-roles.sql`

4. Hacé clic en **"Run"**

### **Paso 2: Asignar tu Primer Super Admin**

Hay 2 opciones:

#### **Opción A: Por Email (Recomendada)**

1. Creá tu cuenta desde la app: `http://localhost:8080/auth`
2. Verificá tu email
3. En Supabase SQL Editor, ejecutá:
   ```sql
   UPDATE profiles 
   SET role = 'super_admin' 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'tu-email@ejemplo.com');
   ```
   (Reemplazá `tu-email@ejemplo.com` con tu email real)

#### **Opción B: Por UUID**

Si conocés tu User ID:
```sql
UPDATE profiles 
SET role = 'super_admin' 
WHERE id = 'tu-user-uuid-aqui';
```

### **Paso 3: Verificar**

1. Cerrá sesión y volvé a iniciar sesión
2. Abrí la consola del navegador (F12)
3. Deberías ver: `[Auth] Event: SIGNED_IN`
4. Tu rol debería ser `super_admin`

---

## 📚 Cómo Usar el Sistema de Roles

### **1. En Componentes React**

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { role, isAdmin, isSuperAdmin } = useAuth();

  if (!isAdmin) {
    return <p>Acceso denegado</p>;
  }

  return (
    <div>
      <p>Tu rol: {role}</p>
      {isSuperAdmin && <SuperAdminPanel />}
    </div>
  );
}
```

### **2. Con el Hook useAdmin**

```tsx
import { useAdmin } from "@/hooks/useAdmin";

function ProductManager() {
  const { 
    canManageProducts, 
    canManageStock,
    canViewAnalytics 
  } = useAdmin();

  return (
    <div>
      {canManageProducts && <ProductEditor />}
      {canManageStock && <StockManager />}
      {canViewAnalytics && <Analytics />}
    </div>
  );
}
```

### **3. Rutas Protegidas**

```tsx
import ProtectedRoute from "@/components/ProtectedRoute";

// En App.tsx o tu router
<Route 
  path="/admin" 
  element={
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>

<Route 
  path="/admin/users" 
  element={
    <ProtectedRoute requireSuperAdmin>
      <UserManagement />
    </ProtectedRoute>
  } 
/>
```

---

## 🎯 Permisos por Rol

### **Customer (Usuario Normal)**
- ✅ Ver productos
- ✅ Comprar
- ✅ Ver sus propias órdenes
- ✅ Gestionar su perfil
- ✅ Wishlist
- ❌ No puede acceder a panel admin

### **Admin (Administrador)**
- ✅ Todo lo de Customer +
- ✅ Gestionar productos (crear, editar, eliminar)
- ✅ Gestionar stock
- ✅ Ver todas las órdenes
- ✅ Cambiar estado de órdenes
- ✅ Aplicar códigos promocionales
- ✅ Ver analytics
- ❌ No puede gestionar usuarios
- ❌ No puede cambiar roles

### **Super Admin (Super Administrador)**
- ✅ Todo lo de Admin +
- ✅ Gestionar usuarios
- ✅ Cambiar roles de otros usuarios
- ✅ Acceder a configuración del sistema
- ✅ Eliminar datos sensibles
- ✅ Acceso completo a la base de datos

---

## 🛠️ Archivos Creados

### **1. `add-admin-roles.sql`**
Script SQL para agregar el sistema de roles a la base de datos.

**Incluye:**
- Columna `role` en tabla `profiles`
- Políticas RLS para seguridad
- Funciones SQL: `get_user_role()`, `is_admin()`, `is_super_admin()`
- Instrucciones para asignar primer super admin

### **2. `src/contexts/AuthContext.tsx` (Actualizado)**
Context de autenticación con soporte para roles.

**Nuevas propiedades:**
- `role`: Rol del usuario actual
- `isAdmin`: Boolean si es admin o super_admin
- `isSuperAdmin`: Boolean si es super_admin

### **3. `src/hooks/useAdmin.ts`**
Hook personalizado para verificar permisos.

**Propiedades:**
```ts
{
  role: 'customer' | 'admin' | 'super_admin',
  isAdmin: boolean,
  isSuperAdmin: boolean,
  isCustomer: boolean,
  canManageProducts: boolean,
  canManageStock: boolean,
  canViewAllOrders: boolean,
  canManageOrders: boolean,
  canManagePromoCodes: boolean,
  canViewAnalytics: boolean,
  canManageUsers: boolean,
  canManageRoles: boolean,
  canAccessSystemConfig: boolean,
}
```

### **4. `src/components/ProtectedRoute.tsx`**
Componente para proteger rutas que requieren autenticación o permisos específicos.

**Props:**
- `requireAdmin`: Requiere ser admin o super_admin
- `requireSuperAdmin`: Requiere ser super_admin

---

## 🔒 Seguridad

### **Row Level Security (RLS)**

Todas las políticas están configuradas para:

1. **Usuarios solo ven su propio perfil**
   ```sql
   CREATE POLICY "Users can view own profile" ON profiles 
   FOR SELECT USING (auth.uid() = id);
   ```

2. **Admins pueden ver todos los perfiles**
   ```sql
   CREATE POLICY "Admins can view all profiles" ON profiles
   FOR SELECT USING (
     EXISTS (
       SELECT 1 FROM profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role IN ('admin', 'super_admin')
     )
   );
   ```

3. **Solo super_admins pueden cambiar roles**
   ```sql
   CREATE POLICY "Super admins can update any profile" ON profiles
   FOR UPDATE USING (
     EXISTS (
       SELECT 1 FROM profiles 
       WHERE profiles.id = auth.uid() 
       AND profiles.role = 'super_admin'
     )
   );
   ```

### **Funciones SQL Seguras**

Las funciones usan `SECURITY DEFINER` para acceso controlado:

```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();
  
  RETURN user_role IN ('admin', 'super_admin');
END;
$$;
```

---

## 📝 Ejemplos de Uso

### **Ejemplo 1: Panel de Admin Básico**

```tsx
// src/pages/AdminDashboard.tsx
import { useAdmin } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const { role, canManageProducts, canViewAnalytics } = useAdmin();

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <p className="mb-4">Tu rol: <strong>{role}</strong></p>

      <div className="grid gap-4 md:grid-cols-2">
        {canManageProducts && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Productos</h2>
            <p className="text-muted-foreground">Gestionar catálogo</p>
          </Card>
        )}

        {canViewAnalytics && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-2">Analytics</h2>
            <p className="text-muted-foreground">Ver estadísticas</p>
          </Card>
        )}
      </div>
    </div>
  );
}
```

### **Ejemplo 2: Botón Condicional en Header**

```tsx
// En Header.tsx
import { useAdmin } from "@/hooks/useAdmin";
import { Shield } from "lucide-react";

function Header() {
  const { isAdmin } = useAdmin();

  return (
    <header>
      {/* ... otros elementos ... */}
      
      {isAdmin && (
        <Link to="/admin">
          <Button variant="ghost" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Admin
          </Button>
        </Link>
      )}
    </header>
  );
}
```

### **Ejemplo 3: Gestión de Usuarios (Solo Super Admin)**

```tsx
// src/pages/UserManagement.tsx
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";

export default function UserManagement() {
  const { isSuperAdmin } = useAdmin();

  if (!isSuperAdmin) {
    return <p>Acceso denegado</p>;
  }

  const changeUserRole = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Rol actualizado');
    }
  };

  return (
    <div>
      <h1>Gestión de Usuarios</h1>
      {/* Lista de usuarios con botones para cambiar roles */}
    </div>
  );
}
```

---

## 🧪 Testing

### **Verificar que la Autenticación Funciona**

1. **Crear cuenta:**
   - Andá a `/auth`
   - Registrate con un email
   - Verificá el email

2. **Verificar rol default:**
   - Abrí consola (F12)
   - Ejecutá: `localStorage.getItem('supabase.auth.token')`
   - Deberías estar logueado como `customer`

3. **Asignar super_admin:**
   - Ejecutá el UPDATE en Supabase SQL Editor
   - Cerrá sesión y volvé a iniciar
   - Tu rol debería ser `super_admin`

4. **Probar permisos:**
   - Intentá acceder a `/admin` (debería funcionar)
   - Creá una ruta protegida y probá acceso

---

## 🚀 Próximos Pasos

### **Funcionalidades Admin a Implementar**

1. **Panel de Admin** (`/admin`)
   - Dashboard con métricas
   - Accesos rápidos a gestión

2. **Gestión de Productos** (`/admin/products`)
   - Crear/editar/eliminar productos
   - Gestionar variantes
   - Subir imágenes

3. **Gestión de Stock** (`/admin/stock`)
   - Ver stock actual
   - Alertas de stock bajo
   - Actualización masiva

4. **Gestión de Órdenes** (`/admin/orders`)
   - Ver todas las órdenes
   - Cambiar estados
   - Generar etiquetas de envío

5. **Códigos Promocionales** (`/admin/promo-codes`)
   - Crear cupones
   - Ver uso
   - Activar/desactivar

6. **Analytics** (`/admin/analytics`)
   - Ventas por período
   - Productos más vendidos
   - Conversión

7. **Gestión de Usuarios** (`/admin/users`) - Solo Super Admin
   - Ver usuarios
   - Cambiar roles
   - Bloquear/desbloquear

---

## ❓ FAQ

### **¿Cómo agrego más roles?**

1. Modificá el ENUM en SQL:
   ```sql
   ALTER TYPE user_role ADD VALUE 'moderator';
   ```

2. Actualizá el type en `AuthContext.tsx`:
   ```ts
   type UserRole = 'customer' | 'admin' | 'super_admin' | 'moderator';
   ```

### **¿Cómo creo permisos más granulares?**

Agregá columnas booleanas a `profiles`:
```sql
ALTER TABLE profiles ADD COLUMN can_edit_products BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN can_view_analytics BOOLEAN DEFAULT false;
```

### **¿Cómo protejo Edge Functions?**

En tus Edge Functions, verificá el rol:
```ts
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile.role !== 'admin' && profile.role !== 'super_admin') {
  return new Response('Unauthorized', { status: 403 });
}
```

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `add-admin-roles.sql` en Supabase
- [ ] Asignar primer super_admin
- [ ] Verificar que el login funciona
- [ ] Verificar que el rol se carga correctamente
- [ ] Crear ruta `/admin` protegida
- [ ] Agregar botón "Admin" en Header (solo para admins)
- [ ] Implementar panel de admin básico
- [ ] Implementar gestión de productos
- [ ] Implementar gestión de órdenes
- [ ] Implementar analytics
- [ ] Implementar gestión de usuarios (super admin)

---

## 🎉 ¡Listo!

El sistema de roles está completamente configurado. Ahora podés:

1. ✅ Asignar roles desde la base de datos
2. ✅ Verificar permisos en componentes
3. ✅ Proteger rutas admin
4. ✅ Crear funcionalidades exclusivas para admins

**Siguiente paso:** Ejecutá `add-admin-roles.sql` y asigná tu primer super admin.

¿Necesitás ayuda con algo específico?
