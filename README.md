# Criollazo

Un juego de palabras venezolanas inspirado en Wordle.

## Descripción

Criollazo es una adaptación del popular juego Wordle usando exclusivamente palabras del vocabulario venezolano. Los jugadores deben adivinar una palabra de 5 letras en máximo 6 intentos, recibiendo pistas visuales después de cada intento.

## Características

- 20 palabras venezolanas auténticas del diccionario de venezolanismos
- Interfaz completamente accesible con soporte para lectores de pantalla
- Efectos de sonido interactivos
- Navegación por teclado físico y virtual
- Diseño responsive para móviles y escritorio
- Modales informativos con instrucciones del juego

## Tecnologías

- Next.js 15
- TypeScript
- CSS Modules
- Web Audio API

## Instalación

```bash
cd turpial
pnpm install
pnpm run dev
```

El juego estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
turpial/
├── src/app/
│   ├── components/          # Componentes reutilizables
│   ├── hooks/              # Custom hooks de React
│   ├── utils/              # Funciones utilitarias
│   ├── types/              # Definiciones de TypeScript
│   ├── data/               # Datos del juego (palabras)
│   └── styles/             # Estilos CSS
```

## Contribuir

Las contribuciones son bienvenidas. Para agregar nuevas palabras venezolanas, edita el archivo `src/app/data/words.json`.

## Licencia

Este proyecto está bajo la [MIT License](LICENSE).

## Créditos

Creado por Andrés Argote y vibecodeado con Claude
