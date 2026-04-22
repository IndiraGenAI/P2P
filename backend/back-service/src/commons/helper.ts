import { CognitoIdentityServiceProvider, S3 } from 'aws-sdk';
import { commonConfig, SystemEnums } from './common';
import * as uuidv4 from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { extname } from 'path';
import * as csvParser from 'csv-parser';
import * as fs from 'fs';
import { Request } from 'express';






export async function GetCognitoUser(
  email: string,
): Promise<CognitoIdentityServiceProvider.Types.AdminGetUserResponse> {
  const userParameters: CognitoIdentityServiceProvider.Types.AdminGetUserRequest =
    {
      UserPoolId: commonConfig.aws.userPoolId,
      Username: email,
    };

  return new CognitoIdentityServiceProvider()
    .adminGetUser(userParameters)
    .promise();
}

export async function CreateCognitoUser(email: string): Promise<string> {
  const userParameters: CognitoIdentityServiceProvider.Types.AdminCreateUserRequest =
    {
      DesiredDeliveryMediums: ['EMAIL'],
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' },
      ],
      UserPoolId: commonConfig.aws.userPoolId,
      Username: email,
    };

  const cognitoUser = await new CognitoIdentityServiceProvider()
    .adminCreateUser(userParameters)
    .promise();
  return (cognitoUser.User && cognitoUser.User.Username) || '';
}

export async function EnableCognitoUser(email: string): Promise<void> {
  const userParameters: CognitoIdentityServiceProvider.Types.AdminEnableUserRequest =
    {
      UserPoolId: commonConfig.aws.userPoolId,
      Username: email,
    };

  await new CognitoIdentityServiceProvider()
    .adminEnableUser(userParameters)
    .promise();
}

export async function DisableCognitoUser(email: string): Promise<void> {
  const userParameters: CognitoIdentityServiceProvider.Types.AdminDisableUserRequest =
    {
      UserPoolId: commonConfig.aws.userPoolId,
      Username: email,
    };

  await new CognitoIdentityServiceProvider()
    .adminDisableUser(userParameters)
    .promise();
}

export async function DeleteCognitoUser(email: string): Promise<void> {
  await DisableCognitoUser(email);
  const userParameters: CognitoIdentityServiceProvider.Types.AdminDeleteUserRequest =
    {
      UserPoolId: commonConfig.aws.userPoolId,
      Username: email,
    };

  await new CognitoIdentityServiceProvider()
    .adminDeleteUser(userParameters)
    .promise();
}

export async function getPreSignedURL(
  file_name: string,
  mime_type: string,
  bucket_name: string,
  storage_path: string,
): Promise<Record<string, unknown>> {
  const prefixId = uuidv4.v4();
  const fileExtension: string[] = file_name.split('.');

  const generateFileName = `${prefixId}.${
    fileExtension[fileExtension.length - 1]
  }`;
  let s3Params = {
    Bucket: bucket_name,
    Key: `${storage_path}/${generateFileName}`,
    ContentType: mime_type,
    Expires: 300,
  } as Record<string, unknown>;

  if (await setACLPublicRead(bucket_name)) {
    s3Params = {
      ...s3Params,
      ACL: SystemEnums.ACL_PUBLIC_READ,
    };
  }
  const preSignedUrl = await new S3().getSignedUrlPromise(
    'putObject',
    s3Params,
  );
  return {
    fileName: `${storage_path}/${generateFileName}`,
    preSignedUrl,
  };
}

export async function setACLPublicRead(bucketName: string): Promise<boolean> {
  if (
    new RegExp([commonConfig.aws.s3ResourceBucket].join('|')).test(
      bucketName.toLocaleLowerCase(),
    ) &&
    commonConfig.aws.s3ResourceBucket
  ) {
    return true;
  }
  return false;
}

export const GetSortOrder = (prop: any, order: 'ASC' | 'DESC') => {
  return function (a: any, b: any) {
    if (order === 'ASC') {
      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
    } else if (order === 'DESC') {
      if (a[prop] > b[prop]) {
        return -1;
      } else if (a[prop] < b[prop]) {
        return 1;
      }
    }
    return 0;
  };
};

export const getZoneWiseSubZonesDataByZoneID = (
  _zone: unknown,
  _zone_id: number,
): number[] => {
  throw new BadRequestException(
    'getZoneWiseSubZonesDataByZoneID is not available: zones module not wired up.',
  );
};

export async function getBranchIds(
  _zoneIds: number[] | number,
): Promise<number[]> {
  throw new BadRequestException(
    'getBranchIds is not available: branches module not wired up.',
  );
}

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename?: string) => void,
) => {
  const name = file.originalname.split('.').slice(0, -1).join('.');
  const fileExtName = extname(file.originalname);
  if (fileExtName.match(/^.*\.(csv)$/)) {
    callback(null, `${name}${fileExtName}`);
  } else {
    callback(new BadRequestException('Only CSV file allow'));
  }
};

export const readCSV = (filepath: string): Promise<string[]> => {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filepath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
      })
      .on('error', (error) => reject(results))
      .on('end', () => {
        resolve(results);
      });
    return results;
  });
};
