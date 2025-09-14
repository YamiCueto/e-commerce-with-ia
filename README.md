# TechStore IA - E-commerce con Angular

Una aplicación de comercio electrónico moderna desarrollada con Angular 20, Angular Material y diseño responsive.

🚀 **[Ver aplicación en vivo](https://yamicueto.github.io/e-commerce-with-ia/)**

## ✨ Características

- 🛒 **Carrito de compras** completo con persistencia en localStorage
- 💳 **Proceso de checkout** con simulación de pagos
- 🔔 **Sistema de notificaciones** en tiempo real
- 📱 **Diseño responsive** que funciona en todos los dispositivos
- 🎨 **Material Design** con tema personalizado
- ⚡ **Angular Signals** para manejo reactivo del estado
- 🚀 **Lazy loading** para optimización de performance

## 🛠️ Tecnologías

- **Angular 20** - Framework principal
- **Angular Material** - Componentes de UI
- **TypeScript** - Lenguaje de programación
- **RxJS** - Programación reactiva
- **Angular Router** - Navegación
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

## 🚀 Inicio rápido

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/YamiCueto/e-commerce-with-ia.git
cd e-commerce-with-ia
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm start
```

4. Abre tu navegador en `http://localhost:4200`

## 📦 Scripts disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run build` - Build para desarrollo
- `npm run build:prod` - Build optimizado para producción
- `npm run build:github-pages` - Build para GitHub Pages
- `npm test` - Ejecuta las pruebas unitarias

## 🏗️ Estructura del proyecto

```
src/
├── app/
│   ├── components/          # Componentes de la aplicación
│   │   ├── cart/           # Carrito de compras
│   │   ├── checkout/       # Proceso de pago
│   │   ├── home/           # Página principal
│   │   ├── products/       # Lista de productos
│   │   └── ...
│   ├── services/           # Servicios de la aplicación
│   │   ├── cart.service.ts # Gestión del carrito
│   │   ├── product.service.ts # Gestión de productos
│   │   └── ...
│   └── shared/             # Componentes y módulos compartidos
├── assets/                 # Recursos estáticos
└── ...
```

## 🚀 Deployment

La aplicación se despliega automáticamente en GitHub Pages mediante GitHub Actions cuando se hace push a la rama `main`.

URL de producción: https://yamicueto.github.io/e-commerce-with-ia/

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
