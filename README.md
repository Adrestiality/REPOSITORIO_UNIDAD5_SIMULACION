# Fórum UPB · Experiencia Interactiva 3D & Sistema LIVE

Experiencia web interactiva para la charla de **Fórum UPB**, construida sobre una identidad visual propia basada en **sistemas complejos, redes neuronales, filamentos orgánicos, actividad eléctrica y autoorganización**.

Conecta en tiempo real la **Pantalla Principal del Expositor (`LIVE_HOST`)** con **hasta 30 teléfonos celulares de los asistentes (`LIVE_CLIENT`)** y ofrece un modo autónomo **`GENERIC_VIEWER`** para consulta posterior.

---

## 📑 Tabla de Contenidos
1. [Instalación](#1-instalación)
2. [Ejecución Local](#2-ejecución-local)
3. [Cómo Iniciar LIVE HOST (Expositor)](#3-cómo-iniciar-live-host-expositor)
4. [Cómo Conectar un Celular (Participante)](#4-cómo-conectar-un-celular-participante)
5. [Cómo Abrir GENERIC VIEWER (Autónomo)](#5-cómo-abrir-generic-viewer-autónomo)
6. [Cambio de Idioma (Español / Portugués)](#6-cambio-de-idioma-español--portugués)
7. [Configuración Central de URLs](#7-configuración-central-de-urls)
8. [Gestión y Reemplazo de Fotografías](#8-gestión-y-reemplazo-de-fotografías)
9. [Generación y Configuración de Códigos QR](#9-generación-y-configuración-de-códigos-qr)
10. [Pruebas Automatizadas de Estrés con Múltiples Clientes](#10-pruebas-automatizadas-de-estrés-con-múltiples-clientes)
11. [Despliegue a Producción](#11-despliegue-a-producción)
12. [Estructura del Proyecto](#12-estructura-del-proyecto)
13. [Arquitectura de Comunicación e Interacciones](#13-arquitectura-de-comunicación-e-interacciones)
14. [Límites Conocidos del Sistema](#14-límites-conocidos-del-sistema)
15. [Guía de Solución de Problemas (Troubleshooting)](#15-guía-de-solución-de-problemas-troubleshooting)

---

## 1. Instalación

Requiere **Node.js 18+** instalado.

```bash
# Clonar el repositorio
git clone https://github.com/Adrestiality/REPOSITORIO_UNIDAD5_SIMULACION.git
cd REPOSITORIO_UNIDAD5_SIMULACION

# Instalar dependencias
npm install
```

---

## 2. Ejecución Local

Para una experiencia en vivo completa, se inician dos procesos: el **servidor WebSocket** y el **servidor web Vite**.

```bash
# Terminal 1: Iniciar el servidor LIVE en tiempo real (WebSocket en puerto 3000)
npm run serve:live

# Terminal 2: Iniciar el servidor web (Vite en puerto 5173 accesible en red local)
npm run dev
```

---

## 3. Cómo Iniciar LIVE HOST (Expositor)

El Host tiene el control exclusivo del ritmo de la charla y el cambio de idioma:

1. Abre tu navegador en la pantalla de proyección o computador principal:
   ```
   http://localhost:5173/?mode=host
   ```
2. Presiona <kbd>F</kbd> para activar el modo **Pantalla Completa**.
3. Presiona <kbd>→</kbd> o <kbd>Espacio</kbd> para avanzar, <kbd>←</kbd> para retroceder.
4. Presiona <kbd>H</kbd> para abrir el panel de atajos y mostrar el **QR de Conexión en Vivo** a la audiencia.

---

## 4. Cómo Conectar un Celular (Participante)

1. Conecta el teléfono móvil a la **misma red Wi-Fi** que el computador del expositor.
2. Abre la cámara del celular y escanea el QR proyectado en pantalla, o ingresa directamente en el navegador móvil a:
   ```
   http://<IP-LOCAL-DEL-HOST>:5173/?mode=client
   ```
   *(La IP local exacta es mostrada por la consola al ejecutar `npm run serve:live`).*
3. El celular entra de inmediato en sincronía con el slide actual del presentador:
   - **Slide 5:** Dibuja hasta 3 trazos táctiles con el dedo (doble tap para borrar).
   - **Slide 9:** Arrastra los puntos de su grupo asignado (Cian o Magenta) en tiempo real.
   - **Demás Slides:** Rotación 3D libre con gestos táctiles sin alterar la proyección principal.

---

## 5. Cómo Abrir GENERIC VIEWER (Autónomo)

El modo genérico es ideal para consulta posterior, revisión offline o enlaces de memorias compartidos tras el evento:

```
http://localhost:5173/?mode=generic
```
- Comienza siempre en la Diapositiva 1.
- No requiere servidor WebSocket ni celulares conectados.
- Ejecuta las simulaciones procedurales de respaldo automáticamente para las transiciones 5 ➔ 6 ➔ 7 y 9 ➔ 10.
- Permite navegación libre con teclado, botones y gestos táctiles.

---

## 6. Cambio de Idioma (Español / Portugués)

- El expositor puede alternar el idioma en cualquier momento haciendo clic en los botones **`ES` / `PT`** del dock inferior o desde la configuración.
- El cambio se propaga de forma instantánea a todos los celulares conectados mediante WebSocket sin reiniciar la simulación ni perder los trazos o puntos activos.

---

## 7. Configuración Central de URLs

Toda la arquitectura de enlaces se centraliza en el archivo `src/config.js`:

```javascript
// src/config.js
export const CONFIG = {
  urls: {
    liveHost: "http://localhost:5173/?mode=host",
    liveClient: "http://localhost:5173/?mode=client",
    genericViewer: "http://localhost:5173/?mode=generic",
    instagram: "https://instagram.com/centrodeeventosupb"
  },
  qr: {
    memoryUrl: "http://localhost:5173/?mode=generic",
    socialUrl: "https://instagram.com/centrodeeventosupb"
  }
};
```

---

## 8. Gestión y Reemplazo de Fotografías

Las imágenes oficiales están ubicadas en `public/assets/` y referenciadas en `src/slides.js`:

| Archivo | Slide | Descripción |
|---|---|---|
| `slide02_grados.jpg` | Slide 2 | Ceremonia de grados en el auditorio Fórum UPB. |
| `slide03_campus_forum.jpg` | Slide 3 | Vista exterior del campus UPB y acceso de Fórum. |
| `slide04_academia_industria.jpg` | Slide 4 | Cumbre de líderes: Academia, Industria y Ciudad. |
| `slide06_comunidad_prensa.jpg` | Slide 6 | Lanzamiento y encuentro de comunidad ("Fondo Futuro"). |
| `slide08_espacio_rutas.jpg` | Slide 8 | Espacio del Fórum preparado para mesas de diálogo. |
| `slide10_trabajo_intergeneracional.jpg` | Slide 10 | Mesa de trabajo colaborativo intergeneracional. |

Para cambiar cualquier fotografía, simplemente reemplaza el archivo correspondiente en `public/assets/` manteniendo el nombre o actualizando la propiedad `asset.src` en `src/slides.js`.

---

## 9. Generación y Configuración de Códigos QR

El sistema cuenta con un motor generador de códigos QR vectorial offline (`src/core/qrGenerator.js`):
- **Slide 13 (Cierre):** Muestra automáticamente dos tarjetas con códigos QR activos:
  1. **Memorias:** Dirige a la versión genérica de la presentación.
  2. **Instagram:** Dirige a `@centrodeeventosupb`.
- **Modal de Ayuda (Host):** Muestra el QR de conexión rápida para los asistentes.

---

## 10. Pruebas Automatizadas de Estrés con Múltiples Clientes

El repositorio incluye suites de pruebas automatizadas con sockets concurrentes:

```bash
# 1. Probar carga y sincronización de 30 clientes
npm run test:live

# 2. Probar las dos interacciones colaborativas (trazos y puntos)
npm run test:interactions

# 3. Probar el ciclo completo de la charla (13 slides, retroceso, reconexión y balanceo 50/50)
npm run test:full
```

---

## 11. Despliegue a Producción

Para compilar el cliente web optimizado:

```bash
npm run build
```

Los archivos estáticos generados en `dist/` pueden alojarse en cualquier servidor web (Vercel, Netlify, GitHub Pages, Nginx, Apache). Para la funcionalidad LIVE en tiempo real, ejecuta `node server/liveServer.js` en tu servidor Node.js o contenedor Docker.

---

## 12. Estructura del Proyecto

```
REPOSITORIO_UNIDAD5_SIMULACION/
├── public/
│   └── assets/                  # Fotografías optimizadas y logos vectoriales SVG
├── server/
│   ├── liveServer.js            # Servidor WebSocket de sesión en memoria
│   ├── testLoadClients.js       # Test de carga de 30 clientes
│   ├── testInteractions.js      # Test de las 2 interacciones
│   └── testFullDeck.js          # Test integral del ciclo de la presentación
├── src/
│   ├── core/
│   │   ├── stateManager.js      # Estado reactivo global y almacén de trazos/puntos
│   │   ├── syncBridge.js        # Comunicación híbrida WebSocket + BroadcastChannel
│   │   ├── threeStage.js        # Motor 3D WebGL Three.js con cámara OrbitControls
│   │   └── qrGenerator.js       # Generador de códigos QR offline
│   ├── simulations/             # 13 Módulos de simulación procedural 3D independientes
│   │   ├── BaseSimulation.js    # Clase base con ciclo de vida y optimizaciones
│   │   ├── Slide01Simulation.js # Red latente
│   │   ├── Slide05Simulation.js # Interacción 1: Trazos táctiles (max 3, doble tap)
│   │   ├── Slide06Simulation.js # Evolución: Morfogénesis 3D y filamentos
│   │   ├── Slide07Simulation.js # Actividad: Impulsos eléctricos
│   │   ├── Slide09Simulation.js # Interacción 2: Poblaciones A/B y arrastre
│   │   ├── Slide10Simulation.js # Evolución: Cerebro 3D y Cuerpo Calloso
│   │   └── Slide13Simulation.js # Atmósfera serena de cierre para QRs
│   ├── config.js                # Configuración de URLs, marca y metadatos
│   ├── slides.js                # Textos y definiciones oficiales (ES / PT)
│   ├── styles.css               # Sistema de diseño, tipografías y glassmorphism
│   └── main.js                  # Orquestador principal de la experiencia
├── index.html                   # Shell HTML accesible y semántico
└── package.json
```

---

## 13. Arquitectura de Comunicación e Interacciones

```
                ┌────────────────────────────────┐
                │   LIVE HOST (Pantalla Ppal)    │
                │  - Control de Diapositivas     │
                │  - Selector Idioma ES/PT       │
                └───────────────┬────────────────┘
                                │ WebSocket
                                ▼
                ┌────────────────────────────────┐
                │     LIVE SERVER (Node.js)      │
                │  - Memoria RAM de baja latencia│
                │  - Balanceo 50/50 Grupos A/B   │
                │  - Límite de 3 trazos/cliente  │
                └───────────────┬────────────────┘
                                │ WebSocket
                                ▼
  ┌───────────────────────────────────────────────────────────┐
  │         HASTA 30 CELULARES PARTICIPANTES (LIVE CLIENT)    │
  │  - Slide 5: Trazos táctiles libres (doble tap para borrar)│
  │  - Slide 9: Arrastre elástico de puntos Grupo A o Grupo B │
  │  - Demás Slides: Cámara 3D libre e independiente          │
  └───────────────────────────────────────────────────────────┘
```

- **Interacción 1 (Slides 5 ➔ 6 ➔ 7):** Los trazos dibujados con el dedo en Slide 5 se congelan al pasar a Slide 6, adquieren profundidad $Z$, brotan filamentos interconectados y en Slide 7 se electrifican con 32 impulsos lumínicos.
- **Interacción 2 (Slides 9 ➔ 10):** Los participantes reciben invisiblemente la asignación al Grupo A (Cian) o Grupo B (Magenta). En Slide 9 arrastran sus puntos; al pasar a Slide 10, los puntos se ensamblan anatómicamente en el Hemisferio Izquierdo y Derecho con puentes de comunicación en el Cuerpo Calloso.

---

## 14. Límites Conocidos del Sistema

1. **Límite de Trazos por Dispositivo:** Máximo 3 trazos activos simultáneos por celular en Slide 5 para evitar sobrecarga visual y garantizar fluidez a 60 FPS.
2. **Capacidad Concurrente Recomendada:** Optimizado para hasta 30 conexiones simultáneas sobre redes Wi-Fi estándar de eventos.
3. **Cámara 3D Móvil:** La rotación de la cámara es estrictamente local en cada celular para dar libertad al usuario sin alterar la proyección central.

---

## 15. Guía de Solución de Problemas (Troubleshooting)

### ❓ El celular no conecta al servidor
- **Causa:** El celular no está en la misma red Wi-Fi o el firewall del sistema bloquea los puertos `5173` o `3000`.
- **Solución:**
  1. Verifica que ambos dispositivos estén conectados a la misma red Wi-Fi.
  2. En Windows, permite el acceso de Node.js a redes privadas a través del Firewall de Windows Defender.
  3. Asegúrate de ingresar la IP local que muestra `npm run serve:live` (ejemplo: `http://192.168.1.50:5173/?mode=client`).

### ❓ El Host no detecta la cantidad de clientes conectados
- **Causa:** El servidor WebSocket (`node server/liveServer.js`) no está corriendo.
- **Solución:** Ejecuta `npm run serve:live` en una terminal y recarga la página del Host.

### ❓ Las simulaciones no sincronizan al cambiar de diapositiva
- **Causa:** El celular perdió conexión temporal o el navegador suspendió la pestaña.
- **Solución:** Al tocar la pantalla o reabrir la pestaña, el cliente reestablece la conexión automáticamente y solicita el estado actual en menos de 1 segundo.

### ❓ Una persona entra tarde a la charla
- **Solución:** El sistema está diseñado para entrada tardía transparente. Al conectarse, recibe de inmediato el slide activo del Host y los trazos/puntos históricos sin requerir reinicios.

### ❓ Se reinicia la sesión o el computador del expositor
- **Solución:** Al volver a abrir `http://localhost:5173/?mode=host`, el Host retoma el control; los celulares conectados continuarán sincronizados en el nuevo slide que elija el expositor.

---

**Fórum UPB · Centro de Eventos** — *Relevo Generacional: La ventaja que nadie está aprovechando.*

