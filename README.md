# One Team Ecommerce

**One Team** - Básicos que se sienten equipo. Esenciales atemporales con foco en calidad y detalles sutiles.

## 🏗️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Pagos**: MercadoPago
- **Estado**: React Context
- **Routing**: React Router v6

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/oneteam-clth/One-Team.git

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# Ejecutar en desarrollo
npm run dev
```

### Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo (puerto 8080)
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linter
```

## 🛍️ Funcionalidades

- **Catálogo de Productos**: 12 productos con variantes (colores/talles)
- **Colecciones**: Core Basics y Since 2014
- **Categorías**: Hoodies, Remeras, Gorras, Buzos
- **Carrito de Compras**: Con persistencia en localStorage
- **Wishlist**: Lista de deseos por usuario
- **Autenticación**: Login/registro con Supabase
- **Checkout**: Integración completa con MercadoPago
- **Responsive**: Diseño adaptativo para todos los dispositivos

## 🎨 Branding

- **Logo**: One Team (disponible en color y B&W)
- **Colores**: Esquema profesional con primary/secondary
- **Tipografías**: Oswald (headings) + Inter (body)

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de shadcn/ui
│   ├── Header.tsx      # Header principal
│   ├── Footer.tsx      # Footer
│   └── ProductCard.tsx # Tarjeta de producto
├── contexts/           # Contextos de React
│   ├── AuthContext.tsx # Autenticación
│   ├── CartContext.tsx # Carrito de compras
│   └── WishlistContext.tsx # Lista de deseos
├── pages/              # Páginas de la aplicación
├── hooks/              # Custom hooks
├── lib/                # Utilidades y configuración
├── data/               # Datos estáticos
└── types/              # Tipos de TypeScript
```

## 🔧 Configuración

### Variables de Entorno

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key
```

### Supabase

El proyecto incluye:
- Esquema completo de base de datos
- Migraciones SQL
- Edge Functions para pagos
- Configuración de autenticación

## 🚀 Deploy

### Vercel (Recomendado)

1. Conectar repositorio con Vercel
2. Configurar variables de entorno
3. Deploy automático

### Otras Plataformas

- **Netlify**: Importar desde GitHub
- **Railway**: Conectar repositorio
- **Heroku**: Usar buildpack de Node.js

## 📄 Licencia

© 2024 One Team. Todos los derechos reservados.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📞 Contacto

- **Website**: [One Team](https://oneteam-clth.github.io/One-Team)
- **GitHub**: [@oneteam-clth](https://github.com/oneteam-clth)
- **Twitter**: [@oneteam_clth](https://twitter.com/oneteam_clth)
