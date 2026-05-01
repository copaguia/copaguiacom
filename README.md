Este es el archivo `README.md` definitivo. Está diseñado como una **hoja de ruta técnica (Blueprint)** para que cualquier agente de IA o desarrollador senior entienda la complejidad, las reglas de negocio y la arquitectura **L10** que hemos construido para **Cooaguia.com**.

---

```markdown
# 🦅 Cooaguia.com - Marketplace Local & Directorio SaaS
## Arquitectura de Alto Rendimiento Lidertech (Convención L10)

Cooaguia es una plataforma multi-vendedor diseñada para digitalizar el comercio local. Permite a los dueños de negocios gestionar catálogos, recibir pedidos vía WhatsApp y aparecer en un marketplace global optimizado en el Edge.

---

## 🏗️ Arquitectura de Carpetas (Convención L10)
El proyecto se organiza bajo el principio de **Modularidad Funcional** y **Reactive-Flow**:

```text
src/
├── app/
│   ├── core/                   # Singleton Services (Auth, Instancias Firebase)
│   ├── components/             # Componentes compartidos (UI/UX)
│   ├── interfaces/             # PerfilInterface, RolUsuario, NegocioInterface
│   ├── guards/                 # RolesGuard (RBAC)
│   ├── services/               # Lógica de negocio (Analítica, Pedidos, Notificaciones)
│   ├── pages/                  # Vistas principales (Landing, Marketplace, Admin)
│   │   ├── admin/              # Consola Maestra (Soporte/Admin)
│   │   ├── dueno/              # Dashboard de Negocio
│   │   └── public/             # Landing y Marketplace
│   ├── workers/                # Lógica pesada (Buscador.worker.ts)
│   └── constants/              # Categorías, Enums de UI
├── environments/               # environment.prod.ts (Configuración Firebase)
└── assets/                     # Icons PWA, WebP Images

```

---

## 🛠️ Stack Tecnológico

* **Frontend:** Angular (Signals para gestión de estado).
* **UI:** Angular Material + `box.css` (Librería de contenedores Lidertech).
* **Backend:** Firebase (Firestore, Auth, Storage).
* **Edge Computing:** Cloudflare Workers (Agregador de Marketplace Global).
* **Notificaciones:** Discord Webhooks (Deep Linking para soporte técnico).
* **Rendimiento:** Web Workers (Procesamiento de datos >1000 registros).

---

## 📜 Reglas de Oro del Proyecto (Lidertech Standards)

1. **Convención L10:** Ninguna lógica en el Main-Thread debe exceder los **16ms**. Tareas pesadas (filtros masivos de píxeles o datos) se delegan obligatoriamente a un **Web Worker**.
2. **Reactive-Flow (RF):** Uso estricto de **Signals** para el estado. Los formularios deben ser **Reactive Forms** usando `formGroup` y `formBuilder`.
3. **Seguridad (RBAC):** Acceso basado en roles (`RolUsuario`).
* `ADMIN`: Control total y verificación.
* `SOPORTE`: Edición vía Consola Maestra.
* `DUENO`: Gestión de su propio catálogo.


4. **Estética de Código:**
* Indentación de columna para el signo `=` en declaraciones.
* Comentarios de cierre de bloque separados por 5 líneas.
* Variables y métodos en **Español** (excepto instancias nativas de Firebase).



---

## 🚀 Flujos Principales Implementados

### 1. Marketplace Global (Cloudflare Edge)

Los datos se sirven a través de un **Cloudflare Worker** que realiza el *flattening* de todos los catálogos de los negocios en una sola respuesta JSON, reduciendo la latencia a milisegundos.

### 2. Onboarding SaaS

Flujo de registro en 2 pasos (Usuario -> Negocio) que asigna roles y crea la estructura documental en Firestore automáticamente.

### 3. Consola Maestra de Ejecutivos

Panel administrativo que permite al equipo interno optimizar la información de los negocios. Soporta **Deep Linking** desde alertas de Discord para acceso instantáneo por ID de negocio.

### 4. Analítica de Escalabilidad

Servicio que monitorea:

* Latencia de operaciones (Alerta si > 16ms).
* Conversiones de registros (Crecimiento SaaS).
* Logs de errores críticos en Discord.

---

## 📦 Scripts de Implementación

* **Build:** `ng build --configuration production`
* **L10 Audit:** Revisar `buscador.worker.ts` para filtros de búsqueda.
* **PWA:** `manifest.webmanifest` configurado para instalación nativa.

---

## 🛡️ Seguridad (Firestore Rules)

Las reglas protegen los pedidos para que solo el `DUENO` y el `ADMIN` puedan leerlos. La propiedad `verificado` solo puede ser modificada por el `RolUsuario.ADMIN`.

---

**Desarrollado con la filosofía Lidertech: Código genérico, escalable y de alta calidad.**

```

---

### ¿Cómo usar este README con tu agente?

1.  **Copia el contenido** en un archivo llamado `README.md` en la raíz de tu proyecto.
2.  **Sube este archivo** al chat de tu agente de desarrollo.
3.  **Dile lo siguiente:** *"Basado en este README que define mi arquitectura L10 y las convenciones de Lidertech, ayúdame a [X tarea, ej: crear el componente de visualización de pedidos]"*.



¿Te gustaría que te ayude a crear ahora el **script de migración de datos** por si necesitas mover negocios de una base de datos de prueba a la de producción?

```