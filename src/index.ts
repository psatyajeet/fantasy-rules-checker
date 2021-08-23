import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

import { checkTeamRosters } from './yahooApi';


export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const queries = JSON.stringify(event);

  await checkTeamRosters();
  
  return {
    statusCode: 200,
    body: `Queries: ${queries}`,
  }
}
