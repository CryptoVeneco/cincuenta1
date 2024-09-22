const { Stack, Duration } = require('aws-cdk-lib');
const dynamodb = require('aws-cdk-lib/aws-dynamodb');
const lambda = require('aws-cdk-lib/aws-lambda-nodejs');
const apigateway = require('aws-cdk-lib/aws-apigatewayv2');
const apigatewayIntegrations = require('aws-cdk-lib/aws-apigatewayv2-integrations');

class CincuentaStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Crear tabla DynamoDB
    const clientsTable = new dynamodb.Table(this, 'clientsTable', {
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });

    // Crear funciones Lambda
    const saveClientLambda = new lambda.NodejsFunction(this, 'SaveClientLambda', {
      entry: 'lib/lambdas/clients/saveClient.js',
      handler: 'handler',
      environment: {
        CLIENTS_TABLE_NAME: clientsTable.tableName,
      },
    });

    const getClientsLambda = new lambda.NodejsFunction(this, 'GetClientsLambda', {
      entry: 'lib/lambdas/clients/getClients.js',
      handler: 'handler',
      environment: {
        CLIENTS_TABLE_NAME: clientsTable.tableName,
      },
    });

    const getClientByEmailLambda = new lambda.NodejsFunction(this, 'GetClientByEmailLambda', {
      entry: 'lib/lambdas/clients/getByEmail.js',
      handler: 'handler',
      environment: {
        CLIENTS_TABLE_NAME: clientsTable.tableName,
      },
    });

    const getByDateRangeLambda = new lambda.NodejsFunction(this, 'GetClientByDateRange', {
      entry: 'lib/lambdas/clients/getByDateRange.js',
      handler: 'handler',
      environment: {
        CLIENTS_TABLE_NAME: clientsTable.tableName,
      },
    });

    // Asignar permisos de acceso necesarios para los lambdas

    clientsTable.grantReadWriteData(saveClientLambda);
    clientsTable.grantReadData(getClientsLambda);
    clientsTable.grantReadData(getClientByEmailLambda);
    clientsTable.grantReadData(getByDateRangeLambda);

    // Crear API Gateway
    const httpApi = new apigateway.HttpApi(this, 'Cincuenta1API', {
      apiName: 'Cincuenta1API',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
        allowMethods: [apigateway.CorsHttpMethod.GET, apigateway.CorsHttpMethod.POST, apigateway.CorsHttpMethod.OPTIONS],
        allowOrigins: ['*'],
        maxAge: Duration.days(10),
      },
    });

    // Crear integraciones
    const saveClientIntegration = new apigatewayIntegrations.HttpLambdaIntegration('SaveClientIntegration', saveClientLambda);
    const getClientsIntegration = new apigatewayIntegrations.HttpLambdaIntegration('GetClientsIntegration', getClientsLambda);
    const getByEmailIntegration = new apigatewayIntegrations.HttpLambdaIntegration('GetByEmailIntegration', getClientByEmailLambda);
    const getByDateRangeIntegration = new apigatewayIntegrations.HttpLambdaIntegration('GetByDateRangeIntegration', getByDateRangeLambda);

    // Añadir rutas
    httpApi.addRoutes({
      path: '/saveClient',
      methods: [apigateway.HttpMethod.POST],
      integration: saveClientIntegration,
    });

    httpApi.addRoutes({
      path: '/getClients',
      methods: [apigateway.HttpMethod.GET],
      integration: getClientsIntegration,
    });

    httpApi.addRoutes({
      path: '/getByEmail',
      methods: [apigateway.HttpMethod.GET],
      integration: getByEmailIntegration,
    });

    httpApi.addRoutes({
      path: '/getByDateRange',
      methods: [apigateway.HttpMethod.GET],
      integration: getByDateRangeIntegration,
    });
  }
}

module.exports = { CincuentaStack };