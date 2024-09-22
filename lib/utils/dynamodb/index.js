const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const findClientByEmail = async (email) => {
  const params = {
    TableName: process.env.CLIENTS_TABLE_NAME,
    KeyConditionExpression: 'Email = :email',
    ExpressionAttributeValues: {
      ':email': email
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
      ...clientData,
      Fecha: Date.now()
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
      TableName: process.env.CLIENTS_TABLE_NAME
    };
  
    try {
      const result = await dynamoDB.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('Error scanning DynamoDB:', error);
      throw error;
    }
  };

module.exports = {
  findClientByEmail,
  createClient,
  getAllClients
};