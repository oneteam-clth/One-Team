import { useAdmin } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle } from "lucide-react";

export default function AdminProducts() {
  const { canManageProducts } = useAdmin();

  if (!canManageProducts) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tenés permisos para gestionar productos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Productos</h1>
          <p className="text-muted-foreground">Gestionar catálogo y stock</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        Funcionalidad próximamente...
      </div>
    </div>
  );
}
