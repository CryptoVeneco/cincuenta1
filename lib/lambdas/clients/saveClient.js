const { findClientByEmail, createClient } = require('../../utils/dynamodb')

exports.handler = async (event) => {
  try {
    const clientData = JSON.parse(event.body);

    // Validar que todos los campos requeridos estén presentes
    const requiredFields = ['nombre', 'apellido', 'email', 'ciudad'];
    for (const field of requiredFields) {
      if (!clientData[field]) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: `El campo ${field} es requerido` })
        };
      }
    }

    // Verificar si el cliente ya existe
    const existingClient = await findClientByEmail(clientData.email);
    if (existingClient) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: 'Ya existe un cliente con este email' })
      };
    }

    // Crear el nuevo cliente
    const newClient = await createClient({
      Nombre: clientData.nombre,
      Apellido: clientData.apellido,
      Email: clientData.email,
      Ciudad: clientData.ciudad
    });

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Cliente creado exitosamente',
        client: newClient
      })
    };
  } catch (error) {
    console.error('Error en la función Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' })
    };
  }
};