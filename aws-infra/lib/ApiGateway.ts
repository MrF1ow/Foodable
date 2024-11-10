import { Construct } from 'constructs';
import { LambdaIntegration, RestApi, RestApiProps } from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

/*
* ApiGateway class
* @class
* @classdesc This class extends the RestApi class from the aws-cdk-lib/aws-apigateway module
* */
export class ApiGateway extends RestApi {
    constructor(scope: Construct, id: string, props: RestApiProps) {
        super(scope, id, props);
    }

    /*
    * Add a new method to the API Gateway
    *
    *  @param method - The HTTP method to add to the API Gateway
    * @param path - The path to add to the API Gateway
    * @param lambdaFunction - The Lambda function to integrate with the API Gateway
    * @returns void
    * */
    addIntegration(method: string, path: string, lambdaFunction: IFunction) {
        const resource = this.root.addResource(path);
        const integration = new LambdaIntegration(lambdaFunction);
        resource.addMethod(method, integration);
    }
}

/*

potential props for ApiGateway

{
  restApiName: string
  description?: string
  defaultCorsPreflightOptions?: CorsOptions
},
deployOptions?: {
    stageName: StageOptions ( "dev", "prod", "test" )
}

*/