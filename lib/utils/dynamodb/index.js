const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const findClientByEmail = async (email) => {
    const params = {
      TableName: process.env.CLIENTS_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `c#Clients`,
        ':sk': `sk#${email}`
      }
    };
  
    try {
      const result = await dynamoDB.query(params).promise();
      return result.Items.length > 0 ? result.Items[0] : null;
    } catch (error) {
      console.error('Error querying DynamoDB:', error);
      throw error;
    }
};

const createClient = async (clientData) => {
    const params = {
      TableName: process.env.CLIENTS_TABLE_NAME,
      Item: {
        PK: 'c#Clients',
        SK: `sk#${clientData.Email}`,
        Email: clientData.Email,
        Nombre: clientData.Nombre,
        Apellido: clientData.Apellido,
        Ciudad: clientData.Ciudad,
        FechaCreacion: Date.now(),
      }
    };
  
    try {
      await dynamoDB.put(params).promise();
      return params.Item;
    } catch (error) {
      console.error('Error creating client in DynamoDB:', error);
      throw error;
    }
};

const getAllClients = async () => {
    const params = {
        TableName: process.env.CLIENTS_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': 'c#Clients'
        }
    };

    try {
        const result = await dynamoDB.query(params).promise();
    return result.Items;
    } catch (error) {
        console.error('Error querying DynamoDB:', error);
        throw error;
    }
};

const getClientsByDateRange = async (startDate, endDate) => {
    const params = {
      TableName: process.env.CLIENTS_TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      FilterExpression: 'FechaCreacion BETWEEN :startDate AND :endDate',
      ExpressionAttributeValues: {
        ':pk': 'c#Clients',
        ':startDate': startDate,
        ':endDate': endDate
      }
    };
  
    try {
      const result = await dynamoDB.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error querying DynamoDB:', error);
      throw error;
    }
  };
  

module.exports = {
  findClientByEmail,
  createClient,
  getAllClients,
  getClientsByDateRange
};