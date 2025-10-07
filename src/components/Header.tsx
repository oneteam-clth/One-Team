import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Heart, Menu, X, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/hooks/useAdmin";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { categories, collections } from "@/data/products";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img 
            src="/brand/one-team-logo-color.png" 
            alt="One Team" 
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/shop" className="text-sm font-medium transition-colors hover:text-primary">
            Tienda
          </Link>
          {collections.map((collection) => (
            <Link
              key={collection.id}
              to={`/collections/${collection.slug}`}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {collection.name}
            </Link>
          ))}
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            Nosotros
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isAdmin && (
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Button>
            </Link>
          )}
          
          {user ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" title="Mi cuenta">
                  <User className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Mi Cuenta</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 py-4">
                  <div className="border-b pb-4">
                    <p className="text-sm font-medium">Hola!</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Link to="/profile" className="flex items-center gap-2 text-sm hover:text-primary">
                    <User className="h-4 w-4" />
                    Mi Perfil
                  </Link>
                  <Link to="/profile?tab=orders" className="flex items-center gap-2 text-sm hover:text-primary">
                    <User className="h-4 w-4" />
                    Mis Órdenes
                  </Link>
                  <Button variant="ghost" onClick={handleSignOut} className="justify-start px-0">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="icon" title="Iniciar sesión">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <Link to="/wishlist">
            <Button variant="ghost" size="icon" className="relative">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Button>
          </Link>

          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <nav className="flex flex-col gap-6 pt-8">
                <Link
                  to="/shop"
                  className="text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Tienda
                </Link>
                {collections.map((collection) => (
                  <Link
                    key={collection.id}
                    to={`/collections/${collection.slug}`}
                    className="text-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {collection.name}
                  </Link>
                ))}
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop?category=${category.slug}`}
                    className="pl-4 text-sm text-muted-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to="/about"
                  className="text-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
