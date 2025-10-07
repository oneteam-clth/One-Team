import { useAdmin } from "@/hooks/useAdmin";
import { AlertCircle } from "lucide-react";

export default function AdminAnalytics() {
  const { canViewAnalytics } = useAdmin();

  if (!canViewAnalytics) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tenés permisos para ver analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Estadísticas y reportes</p>
      </div>

      <div className="text-center py-12 text-muted-foreground">
        Funcionalidad próximamente...
      </div>
    </div>
  );
}
