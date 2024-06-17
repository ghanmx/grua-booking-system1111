# grua-booking-system



La página está diseñada para permitir a los usuarios reservar un servicio de grúa. Aquí está un desglose detallado del comportamiento y funcionamiento de la página:

### Objetivo

La página permite a los usuarios:
1. Seleccionar un tipo de servicio de grúa.
2. Proporcionar información personal y detalles del vehículo.
3. Seleccionar puntos de recogida y destino en un mapa.
4. Calcular la distancia y el costo del servicio de grúa.
5. Reservar el servicio y recibir una confirmación.

### Componentes Clave

1. **Formulario de Reserva (`BookingForm`)**:
   - **Campos de Entrada**:
     - Tipo de servicio (Remolque, Plataforma, Asistencia en Carretera).
     - Nombre del usuario.
     - Número de teléfono.
     - Marca y modelo del vehículo.
     - Tamaño del vehículo (Pequeño, Mediano, Grande).
     - Información adicional.
     - Fecha y hora de la recogida.
   - **Validación**: Verifica que todos los campos requeridos estén completados antes de permitir la reserva.
   - **Redirección**: Una vez validado el formulario, redirige al usuario a una página de confirmación de la reserva.

2. **Mapa de Google (`GoogleMapsRoute`)**:
   - **Seleccionar Ubicaciones**: Permite a los usuarios seleccionar puntos de recogida y destino haciendo clic en el mapa.
   - **Calcular Ruta y Distancia**: Calcula la distancia total desde un punto de origen fijo hasta el punto de recogida y luego al destino. Utiliza la API de Google Maps para obtener la distancia y calcular el precio del servicio.
   - **Mostrar Direcciones**: Muestra la ruta en el mapa utilizando la API de direcciones de Google.

### Flujo de Trabajo

1. **Llenado del Formulario**:
   - El usuario selecciona el tipo de servicio y llena los detalles personales y del vehículo.
   - El usuario selecciona una fecha y hora para el servicio.

2. **Interacción con el Mapa**:
   - El usuario selecciona el punto de recogida haciendo clic en el mapa.
   - El usuario selecciona el destino haciendo clic en el mapa.
   - La página calcula automáticamente la distancia total y muestra el costo estimado del servicio basado en la distancia.

3. **Validación y Reserva**:
   - Al hacer clic en "Reservar", el sistema valida que todos los campos obligatorios estén completos.
   - Si falta algún dato, se muestra un mensaje de error.
   - Si todos los datos son válidos, el usuario es redirigido a una página de confirmación de la reserva con todos los detalles.

### Tecnologías Utilizadas

- **Next.js**: Para la construcción del sitio web y la navegación entre páginas.
- **Chakra UI**: Para el diseño y los componentes de la interfaz de usuario.
- **React Hooks**: Para gestionar el estado y los efectos secundarios en los componentes funcionales.
- **Google Maps API**: Para la visualización del mapa, selección de ubicaciones y cálculo de rutas y distancias.
- **Toast Notifications**: Para mostrar mensajes de error y confirmación.

### Comportamiento

- La página es interactiva y responsiva, proporcionando feedback inmediato al usuario sobre sus acciones (por ejemplo, selección de ubicaciones y cálculo de distancias).
- Utiliza validación del lado del cliente para asegurar que todos los campos obligatorios están completados antes de permitir la reserva.
- Integra servicios de terceros (Google Maps) para ofrecer funcionalidades avanzadas de mapas y cálculo de rutas.

### Propósito

Esta página está diseñada para facilitar a los usuarios la reserva de servicios de grúa, proporcionando una experiencia de usuario intuitiva y eficiente, desde la selección del tipo de servicio y el llenado de detalles hasta la selección de ubicaciones en un mapa y el cálculo del costo total del servicio.Integración del Mapa Interactivo
Para la integración de un mapa interactivo, hay varios pasos clave que debes seguir:

Selección del Servicio de Mapas:
Elige un servicio de mapas como Google Maps, Mapbox, OpenStreetMap, etc. Estos servicios ofrecen APIs que te permiten agregar mapas interactivos a tu aplicación web o móvil.

Configuración del Mapa:
Configura el mapa en tu aplicación para permitir a los usuarios hacer clic y seleccionar ubicaciones. Los datos de latitud y longitud se pueden obtener de estos clics y luego almacenarlos en la base de datos.

Trazado de Rutas:
Usa las APIs de rutas de estos servicios de mapas para calcular y mostrar la ruta desde la ubicación de tu empresa hasta el origen y destino del usuario.

Ejemplo de Código para Integración con Google Maps
HTML y JavaScript para el Mapa Interactivo
Aquí hay un ejemplo básico de cómo podrías integrar Google Maps en una página web y capturar las coordenadas de un clic.

html
Copiar código
<!DOCTYPE html>
<html>
<head>
    <title>Mapa Interactivo</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    <script>
        let map;
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.603722, lng: -58.381592},
                zoom: 12
            });

            map.addListener('click', function(event) {
                placeMarker(event.latLng);
            });
        }

        function placeMarker(location) {
            new google.maps.Marker({
                position: location,
                map: map
            });

            document.getElementById('lat').value = location.lat();
            document.getElementById('lng').value = location.lng();
        }
    </script>
</head>
<body>
    <div id="map" style="height: 500px; width: 100%;"></div>
    <form action="submit_location.php" method="POST">
        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="lng" name="lng">
        <button type="submit">Guardar Ubicación</button>
    </form>
</body>
</html>
PHP para Guardar la Ubicación en la Base de Datos
Suponiendo que usas PHP para manejar el backend, aquí tienes un ejemplo de cómo podrías guardar las coordenadas en la base de datos.

php
Copiar código
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $usuario_id = 1; // Suponiendo que ya tienes el ID del usuario

    // Conexión a la base de datos
    $conn = new mysqli('localhost', 'root', '', 'tu_base_de_datos');

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Insertar la ubicación en la base de datos
    $sql = "INSERT INTO Ubicaciones (usuario_id, tipo, latitud, longitud) VALUES ($usuario_id, 'origen', $lat, $lng)";
    if ($conn->query($sql) === TRUE) {
        echo "Ubicación guardada con éxito";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
Trazado de Rutas
Para trazar la ruta desde tu empresa hasta el origen y destino del usuario, puedes usar la API de Directions de Google Maps.

Ejemplo de JavaScript para Obtener la Ruta
html
Copiar código
<!DOCTYPE html>
<html>
<head>
    <title>Ruta desde Empresa</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    <script>
        function initMap() {
            const empresa = {lat: -34.615852, lng: -58.433298};
            const origen = {lat: -34.603722, lng: -58.381592}; // Ejemplo, obtén estas coordenadas de tu base de datos
            const destino = {lat: -34.609722, lng: -58.377592}; // Ejemplo, obtén estas coordenadas de tu base de datos

            const map = new google.maps.Map(document.getElementById('map'), {
                center: empresa,
                zoom: 12
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            const request = {
                origin: empresa,
                destination: destino,
                waypoints: [{location: origen}],
                travelMode: 'DRIVING'
            };

            directionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    directionsRenderer.setDirections(result);
                }
            });
        }
    </script>
</head>
<body>
    <div id="map" style="height: 500px; width: 100%;"></div>
</body>
</html>
Conclusión
Con esta estructura de base de datos y los ejemplos de integración con un map

Tow
Aplicación Web de Reserva de Servicios de Grúa
Introducción
Este proyecto es una aplicación web para la reserva de servicios de grúa, que permite a los usuarios solicitar y reservar servicios de grúa a través de un mapa interactivo y un formulario. La aplicación está construida utilizando el framework NestJS para el backend y un conjunto de servicios y módulos que facilitan la gestión de eventos, usuarios, y comunicación por correo electrónico.

Arquitectura General
La aplicación está estructurada en varios módulos que manejan diferentes aspectos de la funcionalidad del sistema:

Módulo de Usuarios: Gestiona la información y autenticación de los usuarios.
Módulo de Correos Electrónicos: Maneja el envío de correos electrónicos para diversas notificaciones.
Módulo de Eventos: Emite y maneja eventos del sistema, como registro de usuarios, solicitudes de restablecimiento de contraseña, etc.
Módulo de Localización: Integra un mapa interactivo para la selección de ubicaciones y visualización de grúas disponibles.
Módulo de Tarifas: Calcula el costo del servicio de grúa en base a la distancia recorrida y otros factores como peajes.
Descripción de los Módulos
Módulo de Usuarios (UserModule)

Gestiona el registro, autenticación y gestión de los usuarios.
Incluye servicios para la creación de usuarios (UserService) y controladores para manejar las peticiones HTTP (UserController).
Módulo de Correos Electrónicos (EmailModule)

Proporciona funcionalidades para el envío de correos electrónicos de bienvenida, restablecimiento de contraseña y verificación de correo.
Incluye servicios como EmailService que encapsulan la lógica de envío de correos utilizando algún proveedor de servicios de correo electrónico.
Módulo de Eventos (EventModule)

Utiliza EventEmitter2 para manejar la emisión y recepción de eventos del sistema.
Define constantes de eventos (EVENT_KEYS) y manejadores de eventos (EventHandlers) para realizar acciones específicas en respuesta a eventos, como enviar correos electrónicos o registrar logs.
Módulo de Localización (LocationModule)

Integra un mapa interactivo (por ejemplo, Google Maps o Leaflet) para que los usuarios puedan seleccionar ubicaciones para la solicitud de grúas.
Gestiona la visualización de las grúas disponibles en tiempo real.
Permite a los usuarios marcar la ubicación de inicio y destino de la grúa.
Módulo de Tarifas (PricingModule)

Calcula el costo del servicio de grúa en base a la distancia recorrida y otros factores.
La tarifa base es de 558 unidades monetarias.
El costo adicional por kilómetro es de 19 unidades monetarias.
Si hay peajes, se cobra 380 unidades monetarias ida y vuelta.
Funcionalidades Clave
Registro y Autenticación de Usuarios

Los usuarios pueden registrarse en la aplicación proporcionando su correo electrónico y contraseña.
La aplicación enviará un correo de bienvenida tras el registro exitoso.
Autenticación de usuarios mediante JWT.
Solicitud de Servicios de Grúa

Los usuarios pueden seleccionar una ubicación en el mapa interactivo para solicitar una grúa.
Un formulario permitirá a los usuarios proporcionar detalles adicionales sobre su solicitud, como el tipo de vehículo y la naturaleza de la avería.
Los usuarios pueden marcar la ubicación de inicio (coordenadas fijas: @26.509672, -100.0095504) y destino en el mapa.
El sistema calculará la distancia entre el punto de inicio y el destino, y generará un resumen del servicio con el costo total.
Gestión de Eventos

El sistema emitirá eventos para diversas acciones como el registro de usuarios, inicio de sesión, solicitud de restablecimiento de contraseña, etc.
Los manejadores de eventos realizarán acciones como el envío de correos electrónicos de notificación y la creación de registros de logs.
Notificaciones por Correo Electrónico

Envío de correos electrónicos de bienvenida, restablecimiento de contraseña y verificación de correo.
Notificaciones a los usuarios sobre el estado de su solicitud de grúa.
Mapa Interactivo

Integración de un mapa interactivo que permite a los usuarios seleccionar la ubicación exacta donde necesitan el servicio de grúa.
Los usuarios pueden seleccionar un destino en el mapa.
El sistema calculará la ruta desde el punto de inicio a las coordenadas seleccionadas por el usuario y mostrará el costo estimado en el resumen del servicio.
Cálculo de Tarifas

Tarifa base de 558 unidades monetarias.
Costo adicional de 19 unidades monetarias por kilómetro.
Costo adicional por peajes de 380 unidades monetarias (ida y vuelta).
Diagrama de Flujo
Registro de Usuario

Usuario completa el formulario de registro.
Sistema emite el evento USER_REGISTERED.
EventHandlers maneja el evento y envía un correo de bienvenida.
Solicitud de Grúa

Usuario selecciona una ubicación en el mapa y completa el formulario de solicitud.
Sistema guarda la solicitud y notifica al operador de grúas más cercano.
Usuario selecciona el destino en el mapa.
Sistema calcula la distancia y el costo total, incluyendo la tarifa base, costo por kilómetro y peajes si aplica.
Se genera un resumen del servicio con la información detallada.
Restablecimiento de Contraseña

Usuario solicita el restablecimiento de su contraseña.
Sistema emite el evento PASSWORD_RESET_REQUESTED.
EventHandlers maneja el evento y envía un correo con el token de restablecimiento.
Tecnologías Utilizadas
Backend: NestJS, TypeScript, EventEmitter2
Base de Datos: PostgreSQL / MySQL
Autenticación: JWT (JSON Web Tokens)
Correo Electrónico: Servicio de correo electrónico (SendGrid, Mailgun, etc.)
Mapa Interactivo: Google Maps API / Leaflet

You're short on marbles...
You can top up your account to create new projects or improve your existing ones in Preview mode.

Top up
Overview
Hosting
Zone

America
Workspace

You have no more deployment time left.
Add more time here

Launch Workspace
Codebase

Give access to your codebase
Github username

Invite

Codebase

ghanmx


 Project ID
orfe9t-tow

 API Key
xdfvmtFFaOQkr2guguBDFCDnQJVfsp86

Delete Project
Marblism
Description
Data model
Pages
This page is included by default and cannot be removed
#1
Home
/home

User Stories

As a user, I can select start and end locations on an interactive map so that I can specify where I need the tow service.


As a user, I can provide vehicle and issue details so that the tow operator knows what kind of help I need.


As a user, I can view a summary of the service cost so that I can review the charges before making a payment.


As a user, I can confirm the service summary so that I can proceed to payment.


As a user, I can complete the payment so that I can finalize the tow service request.


Add User Story
#2
Tow Service Request
/tow-request

User Stories


As a system, I save the calculated distance in the database so that it can be used for cost calculation.


As a system, I send the tow service request to the backend and save it in the database so that the request is logged.


As a system, I emit an event to notify the nearest tow operator so that they can respond to the service request.


Add User Story
#3
Route and Price Calculation
/route-price-calculation

User Stories


As a system, I calculate the distance between start and end locations using the Google Maps API so that I can determine the route.


As a system, I calculate the total service cost including base fee, cost per kilometer, and tolls if applicable so that the user knows the price.


As a system, I save the total cost in the database so that it can be referenced later.


Add User Story
This page is included by default and cannot be modified
#4
Authentication
/

User Stories
As a user, I can login to the application.
As a user, I can register so that I can access the application.
As a user, I can reset my password so that I can recover my account.
This page is included by default and cannot be modified
#5
Notifications
/notifications

User Stories
As a user, I can check my notifications to keep up to date with the latest events.
This page is included by default and cannot be modified
#6
Profile
/profile


Toggle User Stories

Next
Marblism### Process Flow from Form Submission to Service Payment

1. **User Registration and Authentication:**
   - **User Story:** As a user, I can register and log in to the application to access the services.
   - The user completes the registration form, and the information is saved in the database.
   - A welcome email is sent, and the user logs in to receive a JWT.

2. **Tow Service Request:**
   - **User Stories:**
     - As a user, I can select start and end locations on an interactive map to specify where I need the tow service.
     - As a user, I can provide vehicle and issue details so that the tow operator knows what kind of help I need.
     - As a system, I send the tow service request to the backend and save it in the database so that the request is logged.
     - As a system, I emit an event to notify the nearest tow operator so that they can respond to the service request.
   - The user selects start and end locations on the map and provides necessary details.
   - The request is saved in the database, and an event notifies the nearest tow operator.

3. **Route and Price Calculation:**
   - **User Stories:**
     - As a system, I calculate the distance between start and end locations using the Google Maps API to determine the route.
     - As a system, I calculate the total service cost, including base fee, cost per kilometer, and tolls if applicable, so that the user knows the price.
     - As a user, I can view a summary of the service cost to review the charges before making a payment.
     - As a system, I save the total cost in the database so that it can be referenced later.
   - The system calculates the route and distance, then computes the total cost.
   - The total cost and summary are saved in the database and displayed to the user.

4. **Service Payment:**
   - **User Stories:**
     - As a user, I can confirm the service summary to proceed to payment.
     - As a user, I can complete the payment to finalize the tow service request.
   - The user confirms the service summary and completes payment details.
   - Payment information is processed, saved in the database, and a confirmation event is emitted.
   - The request status is updated in the database.

5. **Real-Time Update and Completion:**
   - **User Story:** As a user, I can track the tow truck in real-time via the interactive map.
   - The user tracks the tow truck in real-time.
   - Upon service completion, the request status is updated, and a completion event is emitted to notify the user.

### Ensuring Process Integrity

1. **Validation at Each Step:**
   - Validate fields on the frontend and data on the backend before proceeding.

2. **Database Transactions:**
   - Ensure related operations are completed successfully or fully rolled back.

3. **State Management:**
   - Maintain user state and progress using JWT or sessions.
   - Save process state in the database.

4. **Chained Controllers and Services:**
   - Structure controllers and services to depend on the successful completion of the previous step.

5. **Automated Testing:**
   - Implement automated tests to ensure all steps complete correctly.

### Data Model

- **User:** Stores user information and authentication details.
- **TowRequest:** Stores tow service request details, including start and end locations, vehicle details, and issue description.
- **Payment:** Stores payment details and confirmation status.
- **Event:** Tracks events like user registration, tow requests, and payment confirmations.

### Pages

1. **Home (/home):** 
   - Displays the main interface for the user, including the map for selecting tow service locations.
   
2. **Tow Service Request (/tow-request):**
   - Allows users to request a tow service by selecting locations and providing details.
   
3. **Route and Price Calculation (/route-price-calculation):**
   - Calculates and displays the route and price for the tow service.
   
4. **Authentication (/):**
   - Handles user login, registration, and password reset.
   
5. **Notifications (/notifications):**
   - Displays notifications to the user about the status of their tow service requests.
   
6. **Profile (/profile):**
   - Allows users to update their account information.

### Technologies Used

- **Backend:** NestJS, TypeScript, EventEmitter2
- **Database:** PostgreSQL / MySQL
- **Authentication:** JWT
- **Email Service:** SendGrid, Mailgun, etc.
- **Interactive Map:** Google Maps API / Leaflet

This streamlined process ensures a reliable workflow from service request to payment, maintaining data integrity and proper component functionality.

La página está diseñada para permitir a los usuarios reservar un servicio de grúa. Aquí está un desglose detallado del comportamiento y funcionamiento de la página:

### Objetivo

La página permite a los usuarios:
1. Seleccionar un tipo de servicio de grúa.
2. Proporcionar información personal y detalles del vehículo.
3. Seleccionar puntos de recogida y destino en un mapa.
4. Calcular la distancia y el costo del servicio de grúa.
5. Reservar el servicio y recibir una confirmación.

### Componentes Clave

1. **Formulario de Reserva (`BookingForm`)**:
   - **Campos de Entrada**:
     - Tipo de servicio (Remolque, Plataforma, Asistencia en Carretera).
     - Nombre del usuario.
     - Número de teléfono.
     - Marca y modelo del vehículo.
     - Tamaño del vehículo (Pequeño, Mediano, Grande).
     - Información adicional.
     - Fecha y hora de la recogida.
   - **Validación**: Verifica que todos los campos requeridos estén completados antes de permitir la reserva.
   - **Redirección**: Una vez validado el formulario, redirige al usuario a una página de confirmación de la reserva.

2. **Mapa de Google (`GoogleMapsRoute`)**:
   - **Seleccionar Ubicaciones**: Permite a los usuarios seleccionar puntos de recogida y destino haciendo clic en el mapa.
   - **Calcular Ruta y Distancia**: Calcula la distancia total desde un punto de origen fijo hasta el punto de recogida y luego al destino. Utiliza la API de Google Maps para obtener la distancia y calcular el precio del servicio.
   - **Mostrar Direcciones**: Muestra la ruta en el mapa utilizando la API de direcciones de Google.

### Flujo de Trabajo

1. **Llenado del Formulario**:
   - El usuario selecciona el tipo de servicio y llena los detalles personales y del vehículo.
   - El usuario selecciona una fecha y hora para el servicio.

2. **Interacción con el Mapa**:
   - El usuario selecciona el punto de recogida haciendo clic en el mapa.
   - El usuario selecciona el destino haciendo clic en el mapa.
   - La página calcula automáticamente la distancia total y muestra el costo estimado del servicio basado en la distancia.

3. **Validación y Reserva**:
   - Al hacer clic en "Reservar", el sistema valida que todos los campos obligatorios estén completos.
   - Si falta algún dato, se muestra un mensaje de error.
   - Si todos los datos son válidos, el usuario es redirigido a una página de confirmación de la reserva con todos los detalles.

### Tecnologías Utilizadas

- **Next.js**: Para la construcción del sitio web y la navegación entre páginas.
- **Chakra UI**: Para el diseño y los componentes de la interfaz de usuario.
- **React Hooks**: Para gestionar el estado y los efectos secundarios en los componentes funcionales.
- **Google Maps API**: Para la visualización del mapa, selección de ubicaciones y cálculo de rutas y distancias.
- **Toast Notifications**: Para mostrar mensajes de error y confirmación.

### Comportamiento

- La página es interactiva y responsiva, proporcionando feedback inmediato al usuario sobre sus acciones (por ejemplo, selección de ubicaciones y cálculo de distancias).
- Utiliza validación del lado del cliente para asegurar que todos los campos obligatorios están completados antes de permitir la reserva.
- Integra servicios de terceros (Google Maps) para ofrecer funcionalidades avanzadas de mapas y cálculo de rutas.

### Propósito

Esta página está diseñada para facilitar a los usuarios la reserva de servicios de grúa, proporcionando una experiencia de usuario intuitiva y eficiente, desde la selección del tipo de servicio y el llenado de detalles hasta la selección de ubicaciones en un mapa y el cálculo del costo total del servicio.Integración del Mapa Interactivo
Para la integración de un mapa interactivo, hay varios pasos clave que debes seguir:

Selección del Servicio de Mapas:
Elige un servicio de mapas como Google Maps, Mapbox, OpenStreetMap, etc. Estos servicios ofrecen APIs que te permiten agregar mapas interactivos a tu aplicación web o móvil.

Configuración del Mapa:
Configura el mapa en tu aplicación para permitir a los usuarios hacer clic y seleccionar ubicaciones. Los datos de latitud y longitud se pueden obtener de estos clics y luego almacenarlos en la base de datos.

Trazado de Rutas:
Usa las APIs de rutas de estos servicios de mapas para calcular y mostrar la ruta desde la ubicación de tu empresa hasta el origen y destino del usuario.

Ejemplo de Código para Integración con Google Maps
HTML y JavaScript para el Mapa Interactivo
Aquí hay un ejemplo básico de cómo podrías integrar Google Maps en una página web y capturar las coordenadas de un clic.

html
Copiar código
<!DOCTYPE html>
<html>
<head>
    <title>Mapa Interactivo</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    <script>
        let map;
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: -34.603722, lng: -58.381592},
                zoom: 12
            });

            map.addListener('click', function(event) {
                placeMarker(event.latLng);
            });
        }

        function placeMarker(location) {
            new google.maps.Marker({
                position: location,
                map: map
            });

            document.getElementById('lat').value = location.lat();
            document.getElementById('lng').value = location.lng();
        }
    </script>
</head>
<body>
    <div id="map" style="height: 500px; width: 100%;"></div>
    <form action="submit_location.php" method="POST">
        <input type="hidden" id="lat" name="lat">
        <input type="hidden" id="lng" name="lng">
        <button type="submit">Guardar Ubicación</button>
    </form>
</body>
</html>
PHP para Guardar la Ubicación en la Base de Datos
Suponiendo que usas PHP para manejar el backend, aquí tienes un ejemplo de cómo podrías guardar las coordenadas en la base de datos.

php
Copiar código
<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $usuario_id = 1; // Suponiendo que ya tienes el ID del usuario

    // Conexión a la base de datos
    $conn = new mysqli('localhost', 'root', '', 'tu_base_de_datos');

    // Verificar la conexión
    if ($conn->connect_error) {
        die("Conexión fallida: " . $conn->connect_error);
    }

    // Insertar la ubicación en la base de datos
    $sql = "INSERT INTO Ubicaciones (usuario_id, tipo, latitud, longitud) VALUES ($usuario_id, 'origen', $lat, $lng)";
    if ($conn->query($sql) === TRUE) {
        echo "Ubicación guardada con éxito";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
Trazado de Rutas
Para trazar la ruta desde tu empresa hasta el origen y destino del usuario, puedes usar la API de Directions de Google Maps.

Ejemplo de JavaScript para Obtener la Ruta
html
Copiar código
<!DOCTYPE html>
<html>
<head>
    <title>Ruta desde Empresa</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>
    <script>
        function initMap() {
            const empresa = {lat: -34.615852, lng: -58.433298};
            const origen = {lat: -34.603722, lng: -58.381592}; // Ejemplo, obtén estas coordenadas de tu base de datos
            const destino = {lat: -34.609722, lng: -58.377592}; // Ejemplo, obtén estas coordenadas de tu base de datos

            const map = new google.maps.Map(document.getElementById('map'), {
                center: empresa,
                zoom: 12
            });

            const directionsService = new google.maps.DirectionsService();
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            const request = {
                origin: empresa,
                destination: destino,
                waypoints: [{location: origen}],
                travelMode: 'DRIVING'
            };

            directionsService.route(request, function(result, status) {
                if (status == 'OK') {
                    directionsRenderer.setDirections(result);
                }
            });
        }
    </script>
</head>
<body>
    <div id="map" style="height: 500px; width: 100%;"></div>
</body>
</html>
Conclusión
Con esta estructura de base de datos y los ejemplos de integración con un map

Tow
Aplicación Web de Reserva de Servicios de Grúa
Introducción
Este proyecto es una aplicación web para la reserva de servicios de grúa, que permite a los usuarios solicitar y reservar servicios de grúa a través de un mapa interactivo y un formulario. La aplicación está construida utilizando el framework NestJS para el backend y un conjunto de servicios y módulos que facilitan la gestión de eventos, usuarios, y comunicación por correo electrónico.

Arquitectura General
La aplicación está estructurada en varios módulos que manejan diferentes aspectos de la funcionalidad del sistema:

Módulo de Usuarios: Gestiona la información y autenticación de los usuarios.
Módulo de Correos Electrónicos: Maneja el envío de correos electrónicos para diversas notificaciones.
Módulo de Eventos: Emite y maneja eventos del sistema, como registro de usuarios, solicitudes de restablecimiento de contraseña, etc.
Módulo de Localización: Integra un mapa interactivo para la selección de ubicaciones y visualización de grúas disponibles.
Módulo de Tarifas: Calcula el costo del servicio de grúa en base a la distancia recorrida y otros factores como peajes.
Descripción de los Módulos
Módulo de Usuarios (UserModule)

Gestiona el registro, autenticación y gestión de los usuarios.
Incluye servicios para la creación de usuarios (UserService) y controladores para manejar las peticiones HTTP (UserController).
Módulo de Correos Electrónicos (EmailModule)

Proporciona funcionalidades para el envío de correos electrónicos de bienvenida, restablecimiento de contraseña y verificación de correo.
Incluye servicios como EmailService que encapsulan la lógica de envío de correos utilizando algún proveedor de servicios de correo electrónico.
Módulo de Eventos (EventModule)

Utiliza EventEmitter2 para manejar la emisión y recepción de eventos del sistema.
Define constantes de eventos (EVENT_KEYS) y manejadores de eventos (EventHandlers) para realizar acciones específicas en respuesta a eventos, como enviar correos electrónicos o registrar logs.
Módulo de Localización (LocationModule)

Integra un mapa interactivo (por ejemplo, Google Maps o Leaflet) para que los usuarios puedan seleccionar ubicaciones para la solicitud de grúas.
Gestiona la visualización de las grúas disponibles en tiempo real.
Permite a los usuarios marcar la ubicación de inicio y destino de la grúa.
Módulo de Tarifas (PricingModule)

Calcula el costo del servicio de grúa en base a la distancia recorrida y otros factores.
La tarifa base es de 558 unidades monetarias.
El costo adicional por kilómetro es de 19 unidades monetarias.
Si hay peajes, se cobra 380 unidades monetarias ida y vuelta.
Funcionalidades Clave
Registro y Autenticación de Usuarios

Los usuarios pueden registrarse en la aplicación proporcionando su correo electrónico y contraseña.
La aplicación enviará un correo de bienvenida tras el registro exitoso.
Autenticación de usuarios mediante JWT.
Solicitud de Servicios de Grúa

Los usuarios pueden seleccionar una ubicación en el mapa interactivo para solicitar una grúa.
Un formulario permitirá a los usuarios proporcionar detalles adicionales sobre su solicitud, como el tipo de vehículo y la naturaleza de la avería.
Los usuarios pueden marcar la ubicación de inicio (coordenadas fijas: @26.509672, -100.0095504) y destino en el mapa.
El sistema calculará la distancia entre el punto de inicio y el destino, y generará un resumen del servicio con el costo total.
Gestión de Eventos

El sistema emitirá eventos para diversas acciones como el registro de usuarios, inicio de sesión, solicitud de restablecimiento de contraseña, etc.
Los manejadores de eventos realizarán acciones como el envío de correos electrónicos de notificación y la creación de registros de logs.
Notificaciones por Correo Electrónico

Envío de correos electrónicos de bienvenida, restablecimiento de contraseña y verificación de correo.
Notificaciones a los usuarios sobre el estado de su solicitud de grúa.
Mapa Interactivo

Integración de un mapa interactivo que permite a los usuarios seleccionar la ubicación exacta donde necesitan el servicio de grúa.
Los usuarios pueden seleccionar un destino en el mapa.
El sistema calculará la ruta desde el punto de inicio a las coordenadas seleccionadas por el usuario y mostrará el costo estimado en el resumen del servicio.
Cálculo de Tarifas

Tarifa base de 558 unidades monetarias.
Costo adicional de 19 unidades monetarias por kilómetro.
Costo adicional por peajes de 380 unidades monetarias (ida y vuelta).
Diagrama de Flujo
Registro de Usuario

Usuario completa el formulario de registro.
Sistema emite el evento USER_REGISTERED.
EventHandlers maneja el evento y envía un correo de bienvenida.
Solicitud de Grúa

Usuario selecciona una ubicación en el mapa y completa el formulario de solicitud.
Sistema guarda la solicitud y notifica al operador de grúas más cercano.
Usuario selecciona el destino en el mapa.
Sistema calcula la distancia y el costo total, incluyendo la tarifa base, costo por kilómetro y peajes si aplica.
Se genera un resumen del servicio con la información detallada.
Restablecimiento de Contraseña

Usuario solicita el restablecimiento de su contraseña.
Sistema emite el evento PASSWORD_RESET_REQUESTED.
EventHandlers maneja el evento y envía un correo con el token de restablecimiento.
Tecnologías Utilizadas
Backend: NestJS, TypeScript, EventEmitter2
Base de Datos: PostgreSQL / MySQL
Autenticación: JWT (JSON Web Tokens)
Correo Electrónico: Servicio de correo electrónico (SendGrid, Mailgun, etc.)
Mapa Interactivo: Google Maps API / Leaflet

You're short on marbles...
You can top up your account to create new projects or improve your existing ones in Preview mode.

Top up
Overview
Hosting
Zone

America
Workspace

You have no more deployment time left.
Add more time here

Launch Workspace
Codebase

Give access to your codebase
Github username

Invite

Codebase

ghanmx


 Project ID
orfe9t-tow

 API Key
xdfvmtFFaOQkr2guguBDFCDnQJVfsp86

Delete Project
Marblism
Description
Data model
Pages
This page is included by default and cannot be removed
#1
Home
/home

User Stories

As a user, I can select start and end locations on an interactive map so that I can specify where I need the tow service.


As a user, I can provide vehicle and issue details so that the tow operator knows what kind of help I need.


As a user, I can view a summary of the service cost so that I can review the charges before making a payment.


As a user, I can confirm the service summary so that I can proceed to payment.


As a user, I can complete the payment so that I can finalize the tow service request.


Add User Story
#2
Tow Service Request
/tow-request

User Stories


As a system, I save the calculated distance in the database so that it can be used for cost calculation.


As a system, I send the tow service request to the backend and save it in the database so that the request is logged.


As a system, I emit an event to notify the nearest tow operator so that they can respond to the service request.


Add User Story
#3
Route and Price Calculation
/route-price-calculation

User Stories


As a system, I calculate the distance between start and end locations using the Google Maps API so that I can determine the route.


As a system, I calculate the total service cost including base fee, cost per kilometer, and tolls if applicable so that the user knows the price.


As a system, I save the total cost in the database so that it can be referenced later.


Add User Story
This page is included by default and cannot be modified
#4
Authentication
/

User Stories
As a user, I can login to the application.
As a user, I can register so that I can access the application.
As a user, I can reset my password so that I can recover my account.
This page is included by default and cannot be modified
#5
Notifications
/notifications

User Stories
As a user, I can check my notifications to keep up to date with the latest events.
This page is included by default and cannot be modified
#6
Profile
/profile


Toggle User Stories

Next
Marblism### Process Flow from Form Submission to Service Payment

1. **User Registration and Authentication:**
   - **User Story:** As a user, I can register and log in to the application to access the services.
   - The user completes the registration form, and the information is saved in the database.
   - A welcome email is sent, and the user logs in to receive a JWT.

2. **Tow Service Request:**
   - **User Stories:**
     - As a user, I can select start and end locations on an interactive map to specify where I need the tow service.
     - As a user, I can provide vehicle and issue details so that the tow operator knows what kind of help I need.
     - As a system, I send the tow service request to the backend and save it in the database so that the request is logged.
     - As a system, I emit an event to notify the nearest tow operator so that they can respond to the service request.
   - The user selects start and end locations on the map and provides necessary details.
   - The request is saved in the database, and an event notifies the nearest tow operator.

3. **Route and Price Calculation:**
   - **User Stories:**
     - As a system, I calculate the distance between start and end locations using the Google Maps API to determine the route.
     - As a system, I calculate the total service cost, including base fee, cost per kilometer, and tolls if applicable, so that the user knows the price.
     - As a user, I can view a summary of the service cost to review the charges before making a payment.
     - As a system, I save the total cost in the database so that it can be referenced later.
   - The system calculates the route and distance, then computes the total cost.
   - The total cost and summary are saved in the database and displayed to the user.

4. **Service Payment:**
   - **User Stories:**
     - As a user, I can confirm the service summary to proceed to payment.
     - As a user, I can complete the payment to finalize the tow service request.
   - The user confirms the service summary and completes payment details.
   - Payment information is processed, saved in the database, and a confirmation event is emitted.
   - The request status is updated in the database.

5. **Real-Time Update and Completion:**
   - **User Story:** As a user, I can track the tow truck in real-time via the interactive map.
   - The user tracks the tow truck in real-time.
   - Upon service completion, the request status is updated, and a completion event is emitted to notify the user.

### Ensuring Process Integrity

1. **Validation at Each Step:**
   - Validate fields on the frontend and data on the backend before proceeding.

2. **Database Transactions:**
   - Ensure related operations are completed successfully or fully rolled back.

3. **State Management:**
   - Maintain user state and progress using JWT or sessions.
   - Save process state in the database.

4. **Chained Controllers and Services:**
   - Structure controllers and services to depend on the successful completion of the previous step.

5. **Automated Testing:**
   - Implement automated tests to ensure all steps complete correctly.

### Data Model

- **User:** Stores user information and authentication details.
- **TowRequest:** Stores tow service request details, including start and end locations, vehicle details, and issue description.
- **Payment:** Stores payment details and confirmation status.
- **Event:** Tracks events like user registration, tow requests, and payment confirmations.

### Pages

1. **Home (/home):** 
   - Displays the main interface for the user, including the map for selecting tow service locations.
   
2. **Tow Service Request (/tow-request):**
   - Allows users to request a tow service by selecting locations and providing details.
   
3. **Route and Price Calculation (/route-price-calculation):**
   - Calculates and displays the route and price for the tow service.
   
4. **Authentication (/):**
   - Handles user login, registration, and password reset.
   
5. **Notifications (/notifications):**
   - Displays notifications to the user about the status of their tow service requests.
   
6. **Profile (/profile):**
   - Allows users to update their account information.

### Technologies Used

- **Backend:** NestJS, TypeScript, EventEmitter2
- **Database:** PostgreSQL / MySQL
- **Authentication:** JWT
- **Email Service:** SendGrid, Mailgun, etc.
- **Interactive Map:** Google Maps API / Leaflet

This streamlined process ensures a reliable workflow from service request to payment, maintaining data integrity and proper component functionality.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/grua-booking-system.git
cd grua-booking-system
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
