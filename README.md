# Proyecto Cincuenta

Este proyecto utiliza AWS CDK para desplegar una aplicación serverless que incluye una tabla DynamoDB, funciones Lambda y un API Gateway. El API permito añadir clientes, buscar un cliente particular (por email), y obtener la lista de todos los clientes guardados.

## Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

1. Node.js (versión 18.x o superior)
2. AWS CLI
3. AWS CDK
4. Docker (Debido al uso de lambda.NodejsFunction)

## Configuración

### Configurar AWS CLI

1. Abre una terminal y ejecuta:

`aws configure`

2. Ingresa tu AWS Access Key ID y Secret Access Key cuando se te solicite.
3. Especifica tu región predeterminada.

### Instalar dependencias del proyecto

En la raíz del proyecto, ejecuta:

`npm install`


### Sintetizar el stack de CDK

Para verificar que tu aplicación CDK esté correctamente configurada, ejecuta:

`cdk synth`

Esto generará un template CloudFormation sin realizar ningún cambio en tu cuenta AWS.

### Desplegar el stack

Para desplegar la aplicación en tu cuenta AWS, ejecuta:

`cdk deploy`

Sigue las instrucciones en la terminal para confirmar el despliegue.

## Uso de la API

Después del despliegue, CDK mostrará la URL de tu API Gateway. Puedes usar esta URL para hacer solicitudes a tu API.

### Endpoints disponibles:

1. Guardar un cliente:
   - Método: POST
   - Ruta: /saveClient
   - Cuerpo de la solicitud: JSON con los datos del cliente (nombre, apellido, email, ciudad).

2. Obtener clientes:
   - Método: GET
   - Ruta: /getClients

3. Buscar cliente por email:
   - Método: GET
   - Ruta: /getByEmail

4. Buscar cliente por fecha de creacion
   - Método: GET
   - Ruta: /getByDateRange

Ejemplo de uso con curl:

# Guardar un cliente
curl --location --request POST 'https://vcpyoz4m52.execute-api.us-east-1.amazonaws.com/saveClient' \
--header 'Content-Type: text/plain' \
--data-raw '{
    "nombre": "David",
    "apellido": "Pensa",
    "email": "medicenpensa@gmail.com",
    "ciudad": "Santiago de Chile"
}'

# Obtener clientes
curl --location --request GET 'https://vcpyoz4m52.execute-api.us-east-1.amazonaws.com/getClients'

# Buscar cliente por email

curl --location --request GET 'https://vcpyoz4m52.execute-api.us-east-1.amazonaws.com/getByEmail?email=medicenpensa@gmail.com'

# Buscar cliente por fecha

curl --location --request GET 'https://vcpyoz4m52.execute-api.us-east-1.amazonaws.com/getByDateRange?startDate=1727047509595&endDate=1727047509599'