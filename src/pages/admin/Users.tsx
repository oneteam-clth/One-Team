import { useAdmin } from "@/hooks/useAdmin";
import { AlertCircle } from "lucide-react";

export default function AdminUsers() {
  const { canManageUsers } = useAdmin();

  if (!canManageUsers) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">Solo Super Admins pueden gestionar usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Gestionar usuarios y roles</p>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        Funcionalidad próximamente...
      </div>
    </div>
  );
}
