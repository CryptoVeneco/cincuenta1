const { getClientsByDateRange } = require('../../utils/dynamodb');

exports.handler = async (event) => {
  try {
    const { startDate, endDate } = event.queryStringParameters || {};

    if (!startDate || !endDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Los parámetros startDate y endDate son requeridos' })
      };
    }

    const clients = await getClientsByDateRange(parseInt(startDate), parseInt(endDate));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Clientes obtenidos por rango de fecha',
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