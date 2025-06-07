JhojanRop: Crea un readme bien detallado de la aplicación

Workspace: Recopilando información del área de trabajoAquí tienes un README detallado para tu aplicación de recomendaciones de computadores:

```markdown
# 404 Tech Store – Sistema de Recomendaciones

## Descripción

404 Tech Store es una tienda tecnológica con un sistema inteligente de recomendaciones personalizadas de computadores. Los usuarios responden un breve cuestionario sobre sus necesidades y preferencias, y el sistema les sugiere los productos más adecuados según su perfil.

## Características principales

- **Cuestionario interactivo**: El usuario responde preguntas sobre uso, presupuesto, experiencia, prioridades, portabilidad, importancia del gaming y software que planea usar.
- **Recomendaciones personalizadas**: El sistema muestra una lista de productos recomendados, con detalles de por qué cada uno es adecuado para el usuario.
- **Carrito de compras**: Los usuarios pueden agregar productos recomendados directamente al carrito.
- **Autenticación**: Solo usuarios autenticados pueden recibir recomendaciones.
- **Interfaz moderna y responsiva**: Construida con Next.js y Tailwind CSS, optimizada para desktop y móvil.
- **Manejo de errores y estados**: Indicadores de carga, validación de pasos y mensajes claros en caso de error.

## Estructura del proyecto

- `src/app/recommendations/page.tsx`: Página principal del sistema de recomendaciones y cuestionario.
- `src/services/userProfiles.ts`: Lógica para la generación y validación de perfiles y recomendaciones.
- `src/services/auth.ts`: Manejo de autenticación y almacenamiento de tokens.
- `src/context/CartContext.tsx`: Contexto global para el carrito de compras.
- `src/components/`: Componentes reutilizables (Header, Footer, etc).

## Flujo de usuario

1. **Acceso**: El usuario inicia sesión o se registra.
2. **Cuestionario**: Responde 7 preguntas sobre su perfil y necesidades.
3. **Generación de recomendaciones**: El sistema consulta la API y muestra los productos más adecuados.
4. **Acciones**: El usuario puede ver detalles, agregar productos al carrito o reiniciar el cuestionario.

## Instalación y ejecución

1. **Clona el repositorio**
   ```bash
   git clone https://github.com/JhojanRop/404-tech.git
   cd 404-tech
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Configura variables de entorno**
   Copia `.env.example` a `.env` y ajusta los valores según tu entorno.

4. **Ejecuta el servidor de desarrollo**
   ```bash
   npm run dev
   ```

5. **Abre la aplicación**
   Ve a [http://localhost:3000](http://localhost:3000) en tu navegador.

## Personalización

- **Agregar nuevas preguntas**: Modifica el array de pasos en [`src/app/recommendations/page.tsx`](src/app/recommendations/page.tsx).
- **Modificar lógica de recomendaciones**: Ajusta la función `fetchRecommendations` o la API en [`src/services/userProfiles.ts`](src/services/userProfiles.ts).
- **Cambiar productos mock**: Edita el array `mockRecommendations` en [`src/app/recommendations/page.tsx`](src/app/recommendations/page.tsx).

## Tecnologías utilizadas

- **Next.js** (App Router)
- **React** (Hooks, Context)
- **Tailwind CSS**
- **Lucide React** (iconos)
- **API REST** para recomendaciones y autenticación

## Contribuir

1. Haz un fork del repositorio.
2. Crea una rama con tu feature: `git checkout -b mi-feature`
3. Haz commit de tus cambios: `git commit -am 'Agrega nueva funcionalidad'`
4. Haz push a la rama: `git push origin mi-feature`
5. Abre un Pull Request.

## Licencia

MIT

---

¿Dudas o sugerencias? Abre un issue o contacta al equipo en [GitHub](https://github.com/JhojanRop/404-tech).
```
