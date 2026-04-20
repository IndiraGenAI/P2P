import { ConfigModule } from "@nestjs/config";
ConfigModule.forRoot();

const {
    AWS_REGION,
    AWS_USERPOOLID,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  } = process.env;

export interface AWSConfig {
region: string;
userPoolId: string;
accessKeyId: string;
secretAccessKey: string;
s3ResourceBucket: string;
}

export const SystemEnums = Object.freeze({
  SUPER_USER_ROLE: 'Super User',
  ACL_PUBLIC_READ: 'public-read'
});

export interface CommonConfig {
    aws : AWSConfig
}

export const commonConfig: CommonConfig = {
    aws: {
      region: AWS_REGION || '',
      userPoolId: AWS_USERPOOLID || '',
      accessKeyId: AWS_ACCESS_KEY_ID || '',
      secretAccessKey: AWS_SECRET_ACCESS_KEY || '',
      s3ResourceBucket: '',
    }
}

export enum ErrorType{
  TokenExpiredError = 'TokenExpiredError'
}