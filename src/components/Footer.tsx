import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1">
            <img
              src="/brand/one-team-logo-color.png"
              alt="One Team"
              className="mb-4 hidden h-12 w-auto dark:block"
            />
            <p className="text-sm text-muted-foreground">
              Básicos que se sienten equipo.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Tienda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/shop?category=hoodies" className="hover:text-foreground">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link to="/shop?category=remeras" className="hover:text-foreground">
                  Remeras
                </Link>
              </li>
              <li>
                <Link to="/shop?category=buzos" className="hover:text-foreground">
                  Buzos
                </Link>
              </li>
              <li>
                <Link to="/shop?category=gorras" className="hover:text-foreground">
                  Gorras
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Ayuda</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/shipping" className="hover:text-foreground">
                  Envíos
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-foreground">
                  Cambios y Devoluciones
                </Link>
              </li>
              <li>
                <Link to="/care" className="hover:text-foreground">
                  Cuidado de Prendas
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Conectá</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} One Team. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
