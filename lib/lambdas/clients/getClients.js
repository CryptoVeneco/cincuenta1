const { getAllClients } = require('../../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const clients = await getAllClients();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Clientes obtenidos exitosamente',
        clients: clients
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