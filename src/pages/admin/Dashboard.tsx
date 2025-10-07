import { useAdmin } from "@/hooks/useAdmin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  AlertCircle,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return (
      <div className="container px-4 py-12">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-destructive" />
          <h1 className="text-2xl font-bold mb-2">Acceso Denegado</h1>
          <p className="text-muted-foreground">No tenés permisos de administrador</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Ventas del Mes",
      value: "$0",
      change: "+0%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Órdenes Pendientes",
      value: "0",
      change: "0 nuevas",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Productos",
      value: "0",
      change: "0 sin stock",
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Usuarios",
      value: "0",
      change: "+0 este mes",
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground">Bienvenido al panel de control de One Team</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/products">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <Package className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Productos</CardTitle>
              <CardDescription>
                Gestionar catálogo, stock y variantes
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/orders">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <ShoppingCart className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Órdenes</CardTitle>
              <CardDescription>
                Ver y gestionar pedidos de clientes
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/analytics">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <BarChart3 className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Estadísticas y reportes de ventas
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/promo-codes">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <TrendingUp className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Códigos Promocionales</CardTitle>
              <CardDescription>
                Crear y gestionar cupones de descuento
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link to="/admin/users">
          <Card className="hover:bg-accent transition-colors cursor-pointer">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>
                Gestionar usuarios y roles (Super Admin)
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
