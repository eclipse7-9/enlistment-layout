# Manual de Usuario - Proyecto “Pet-Health Services”

## Introducción

### Bienvenida
Bienvenido al manual de usuario de **Pet-Health Services**, la aplicación web diseñada para simplificar la gestión de citas veterinarias para tus mascotas y animales de granja.

### Propósito del Software
Pet-Health Services permite a los propietarios de animales programar, cancelar y reprogramar citas veterinarias de manera intuitiva, optimizando el tiempo tanto de los dueños como de los profesionales veterinarios.

### Público Objetivo
Este manual está dirigido a:

- **Propietarios**: Dueños de mascotas y animales que necesitan gestionar sus citas veterinarias
- **Personal Administrativo**: Empleados de clínicas veterinarias que utilizan el sistema para gestionar citas
- **Usuarios Principales**: Cualquier persona que necesite utilizar el sistema de gestión de citas veterinarias

## Convenciones Usadas

En este manual utilizamos las siguientes convenciones para facilitar la comprensión:

- **Texto en Negrita**: Indica **nombres de botones**, **opciones de menú** o elementos importantes de la interfaz
- **Texto en Código**: Indica `nombres de archivos`, `comandos` o elementos técnicos
- **Elementos de Interfaz**: `[Nombre del Botón]` - Representa elementos clickeables

> **Nota**: Proporciona información adicional relevante o consejos útiles

> **Advertencia**: Indica posibles problemas o acciones que requieren precaución especial

> **Tip**: Ofrece sugerencias prácticas para un uso más eficiente del sistema

## Primeros Pasos / Inicio Rápido

Sigue esta guía concisa para comenzar a usar Pet-Health Services rápidamente:

### 1. Acceder al Sistema
Abre tu navegador y navega a la dirección de Pet-Health Services.

> **Tip**: Si es tu primera vez, la aplicación se abrirá automáticamente en la página principal

### 2. Revisar Citas Existentes
En la página principal, podrás ver todas las citas programadas.

```
[Captura de pantalla de la página principal]
```

### 3. Programar tu Primera Cita
Haz clic en `[Registrar Cita]` y completa el formulario con los datos de tu mascota.

### 4. Confirmar la Cita
Revisa los datos y haz clic en `[Guardar Cita]` para confirmar.

> **Nota**: Recibirás una confirmación visual cuando la cita se haya registrado correctamente

## Descripción de la Interfaz de Usuario

### Página Principal (Dashboard)
La página principal muestra un resumen completo de tus citas veterinarias:

- **Lista de Citas**: Visualiza todas las citas programadas con información detallada de cada una
- **Acciones Rápidas**: Botones para `[Cancelar]` y `[Reprogramar]` citas directamente
- **Navegación Principal**: Acceso rápido a todas las funcionalidades del sistema

### Elementos de Navegación
**Barra de Navegación Superior** contiene los enlaces principales:

```
[Inicio] | [Registrar Cita] | [Cancelar Cita] | [Reprogramar Cita]
```

### Estructura del Proyecto
```
PET-HEALTH-SERVICES/
│
├── index.html                 # Página principal
├── registrar.html             # Registro de citas
├── cancelar.html              # Cancelación de citas
├── reprogramar.html           # Reprogramación
├── styles.css                 # Estilos visuales
├── script.js                  # Funcionalidades
└── manual_usuario.html        # Este manual
```

## Funcionalidades Principales

### Registrar Nueva Cita

#### 1. Acceder al Formulario
Haz clic en `[Registrar Cita]` en la barra de navegación.

#### 2. Completar Información
Llena todos los campos requeridos:

- **Nombre de la mascota**
- **Veterinario asignado**
- **Fecha de la cita**
- **Hora de la cita**
- **Motivo de la visita**

#### 3. Confirmar Registro
Haz clic en `[Guardar Cita]` para finalizar el proceso.

> **Tip**: Puedes programar múltiples citas para la misma mascota en diferentes fechas

### Cancelar Cita Existente

#### 1. Seleccionar Cita
Desde la página principal, localiza la cita que deseas cancelar.

#### 2. Iniciar Cancelación
Haz clic en el botón `[Cancelar]` correspondiente a la cita.

#### 3. Confirmar Acción
Confirma la cancelación en el diálogo de confirmación que aparecerá.

> **Advertencia**: Una vez cancelada, la cita no se puede recuperar. Asegúrate antes de confirmar

### Reprogramar Cita

#### 1. Seleccionar Cita a Reprogramar
Encuentra la cita que necesitas modificar en la página principal.

#### 2. Acceder a Reprogramación
Haz clic en `[Reprogramar]` para la cita seleccionada.

#### 3. Seleccionar Nueva Fecha/Hora
Elige la nueva fecha y hora para la cita en el calendario.

#### 4. Confirmar Cambios
Haz clic en `[Actualizar Cita]` para guardar los cambios.

## Manejo de Errores y Solución de Problemas

### Error: "No se puede guardar la cita"

**Causas posibles:**
- Campos obligatorios sin completar
- Fecha u hora inválida
- Problemas de conexión (si usa backend)

**Solución:**
1. Verifica que todos los campos marcados como obligatorios estén completos
2. Asegúrate de que la fecha seleccionada sea futura
3. Revisa tu conexión a internet

### Error: "La página no carga correctamente"

**Causas posibles:**
- Navegador desactualizado
- JavaScript deshabilitado
- Problemas con los archivos locales

**Solución:**
1. Actualiza tu navegador a la última versión
2. Habilita JavaScript en la configuración de tu navegador
3. Verifica que todos los archivos estén en la misma carpeta

### Error: "No se pueden cargar las citas existentes"

**Causas posibles:**
- Problemas con el almacenamiento local
- Datos corruptos
- Backend no disponible

**Solución:**
1. Limpia el almacenamiento local del navegador
2. Verifica que el servidor esté ejecutándose (si aplica)
3. Contacta al soporte técnico si el problema persiste

### Mensajes de Error Comunes

- **"Complete todos los campos"**: Significa que hay campos obligatorios vacíos en el formulario
- **"Fecha u hora inválida"**: Indica que la fecha seleccionada es anterior a la actual o la hora no es válida
- **"Cita no encontrada"**: Aparece cuando intentas acceder a una cita que no existe o fue eliminada

## Preguntas Frecuentes (FAQ)

### ¿Puedo registrar citas para diferentes tipos de animales?
Sí, Pet-Health Services está diseñado para gestionar citas de todo tipo de mascotas y animales de granja.

### ¿Dónde se almacenan mis datos de citas?
En la versión frontend, los datos se almacenan localmente en tu navegador. En la versión con backend, se guardan en una base de datos segura.

### ¿Puedo usar la aplicación en mi teléfono móvil?
Sí, la aplicación es completamente responsive y se adapta a diferentes tamaños de pantalla, incluyendo smartphones y tablets.

### ¿Con qué frecuencia debo actualizar la aplicación?
La aplicación se actualiza automáticamente. Si usas la versión local, se recomienda descargar las actualizaciones cuando estén disponibles.

### ¿Pueden múltiples usuarios usar la misma instalación?
En la versión local, los datos son específicos de cada navegador y usuario. En la versión con backend, se puede configurar acceso múltiple.

## Glosario

- **Frontend**: Parte del software con la que interactúa directamente el usuario, incluyendo interfaces y elementos visuales
- **Backend**: Parte del software que procesa datos y ejecuta la lógica de negocio, generalmente en un servidor
- **Responsive**: Diseño que se adapta automáticamente a diferentes tamaños de pantalla y dispositivos
- **Almacenamiento Local**: Tecnología que permite a las aplicaciones web almacenar datos directamente en el navegador del usuario
- **UI (Interfaz de Usuario)**: Conjunto de elementos visuales que permiten la interacción entre el usuario y el software

## Soporte y Contacto

### Canales de Soporte

- **Correo Electrónico**: `soporte@pethealthservices.com` (Respuesta en 24-48 horas)
- **Teléfono**: `+1-800-PET-CARE` (Lunes a Viernes, 9:00 - 18:00)
- **Documentación Online**: `docs.pethealthservices.com` (Manuales y tutoriales actualizados)

### Información para Reportar Problemas
Cuando contactes al soporte técnico, por favor incluye:

- Descripción detallada del problema
- Pasos para reproducir el error
- Capturas de pantalla (si es posible)
- Navegador y versión que estás usando
- Sistema operativo


# Manual de Instalación – Proyecto “Pet-Health Services”
1. Introducción
Este manual describe cómo instalar y ejecutar la aplicación web “Pet-Health Services”, desarrollada en React + Vite + Tailwind.
2. Requisitos del sistema
Sistema operativo: Windows 10 / Ubuntu 20.04+
Node.js v18+
Git
Navegador web moderno
3. Preparación del entorno
Bash

## Instalar Node.js
https://nodejs.org/

## Verificar instalación
Terminal: 
node -v
npm -v
git -v

4. Clonar el repositorio
Bash
git clone https://github.com/usuario/MiAppWeb.git
cd MiAppWeb
5. Instalar dependencias
Bash
npm install
6. Configuración Crear un archivo .env con el siguiente contenido:
PORT=3000
DB_URL=mongodb://localhost:27017/miapp
7. Ejecutar la aplicación
Bash
npm start
8. Verificación Abrir el navegador en http://localhost:3000 y verificar que la página de inicio cargue correctamente.
9. Problemas comunes
- Error: “Cannot find module…” → Ejecutar npm install nuevamente.
- Puerto en uso → Cambiar el valor de PORT en .env.