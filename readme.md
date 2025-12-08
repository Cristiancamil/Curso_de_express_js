# 🚀 InvoFlow Backend

El backend del sistema **InvoFlow**, diseñado para la gestión integral de **inventarios, compras y facturación**.
Construido con **Node.js** y **Express**, sigue una arquitectura modular y orientada a servicios, optimizada para la escalabilidad y el mantenimiento.

## 📌 Características Destacadas

* **Arquitectura Limpia y Modular**: Implementa el patrón **Controlador-Servicio-Modelo (CSM)** para una clara separación de responsabilidades.
* **API RESTful**: Endpoints estructurados y verbos HTTP adecuados para las operaciones **CRUD** (Crear, Leer, Actualizar, Eliminar).
* **Autenticación Preparada**: Estructura lista para la integración con **JSON Web Tokens (JWT)** para la seguridad.
* **Configuración para Producción**: Incluye `.env` y configuración de entorno para un despliegue rápido.
* **Módulos Base**: Implementación inicial del módulo de **Productos** (base para el inventario).

---

## 🛠️ Tecnologías y Dependencias

Este proyecto utiliza el siguiente *stack*:

| Categoría | Tecnología/Paquete | Uso |
| :--- | :--- | :--- |
| **Backend** | **Node.js** | Entorno de ejecución del servidor. |
| **Framework** | **Express** | Framework principal para la construcción de la API. |
| **Desarrollo** | **Nodemon** | Reinicio automático del servidor en modo desarrollo. |
| **Variables** | **dotenv** | Gestión de variables de entorno. |
| **Middleware** | **errorHandler** | Gestión de solicitudes HTTP que se hacen al backend |
| **Middleware** | **LogguerMiddleware** | Gestión de errores |
| **Seguridad** | **CORS** | Configuración de políticas de acceso cruzado. |

---

## ▶️ Instalación y Ejecución

Sigue estos pasos para poner el backend en funcionamiento en tu entorno local.

### 1. Requisitos

Asegúrate de tener **Node.js** (v14 o superior) y **npm** instalados.

### 2. Pasos Iniciales

1.  **Clonar el Repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/invoflow-backend.git](https://github.com/tu-usuario/invoflow-backend.git)
    cd invoflow-backend
    ```
2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```
3.  **Configurar Variables de Entorno:**
    Crea un archivo llamado **`.env`** en la raíz del proyecto y añade las siguientes variables:
    ```bash
    # Variables del Servidor
    PORT=3000
    
    # Ejemplo de conexión a DB (Ajustar según tu base de datos)
    # DB_HOST=localhost
    # DB_PORT=5432
    # DB_USER=myuser
    # DB_PASS=mypassword
    ```

### 3. Ejecución

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor con **Nodemon** para desarrollo (con auto-recarga). |
| `npm start` | Inicia el servidor para **producción**. |

---

## 🌐 Endpoints de la API

Los endpoints base comienzan en la ruta `/api` (ajusta según tu configuración de `app.js`).

### 1. Estado del Servidor

| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| **GET** | `/api` | Verifica la conexión y el estado del backend. |


**Respuesta Exitosa:**
```json
{
  "message": "InvoFlow API funcionando..."
}

## Estructura del proyecto

invoflow-backend/
│
├── src/
│   ├── app.js               # Configuración principal de Express y middlewares.
│   ├── index.js             # Punto de entrada y levantamiento del servidor.
│   ├── routes/              # Define las rutas y mapea a los controladores.
│   │   ├── index.routes.js  # Rutas de estado.
│   │   └── productos.routes.js
│   ├── controllers/         # Lógica de la petición (procesa entrada/salida).
│   │   └── productos.controller.js
│   ├── services/            # Lógica de negocio (manejo de datos, cálculos).
│   │   └── productos.service.js
│   ├── models/              # Definición de la estructura de datos (esquemas DB).
│   │   └── productos.model.js
│   ├── middlewares/         # Funciones que se ejecutan antes del controlador (ej. JWT, validación).
│   └── config/              # Archivos de configuración de la aplicación.
│       └── database.js      # Conexión y configuración de la base de datos.
│
├── .env                     # Variables de entorno.
├── .gitignore               # Archivos a ignorar por Git.
└── package.json             # Dependencias y scripts de Node.