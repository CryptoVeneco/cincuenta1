const { findClientByEmail } = require('../../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const email = event.queryStringParameters?.email;

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'El parámetro email es requerido' })
      };
    }

    const client = await findClientByEmail(email);

    if (client) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Cliente encontrado',
          client: client
        })
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Cliente no encontrado' })
      };
    }
  } catch (error) {
    console.error('Error en la función Lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error interno del servidor' })
    };
  }
};