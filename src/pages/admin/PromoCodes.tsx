import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";

export default function AdminPromoCodes() {
  const { canManagePromoCodes } = useAdmin();

  if (!canManagePromoCodes) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tenés permisos para gestionar códigos promocionales</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Códigos Promocionales</h1>
          <p className="text-muted-foreground">Crear y gestionar cupones de descuento</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cupón
        </Button>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        Funcionalidad próximamente...
      </div>
    </div>
  );
}
