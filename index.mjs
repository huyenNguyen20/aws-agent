import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

// 1. Create a DynamoDB client
const client = new DynamoDBClient({ region: "us-east-1" });

export const handler  = async (event, context) => {
  try {
    // 2. Print the event and extract the email
    console.log(`This is input from agent: ${JSON.stringify(event)}`);
    const email = event.parameters[0].value;

    // 3. Create a request to retrieve data from DynamoDB
    const params = {
      TableName: "employees",
      Key: {
        email: { S: email },
      },
    };

    const response = await client.send(new GetItemCommand(params));

    // 4. Print the response
    console.log(response);

    // 5. Format the response as per Bedrock Agent Action Group
    const responseBody = {
      "application/json": {
        body: JSON.stringify(response),
      },
    };

    const actionResponse = {
      actionGroup: event.actionGroup,
      apiPath: event.apiPath,
      httpMethod: event.httpMethod,
      httpStatusCode: 200,
      responseBody,
    };

    const apiResponse = {
      messageVersion: "1.0",
      response: actionResponse,
      sessionAttributes: event.sessionAttributes,
      promptSessionAttributes: event.promptSessionAttributes,
    };

    // 6. Print and return the final response
    console.log(apiResponse);

    return apiResponse;
  } catch (error) {
    console.error("Error processing Lambda function:", error);
    throw new Error("Internal Server Error");
  }
};

