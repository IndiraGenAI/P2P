import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { commonConfig, SystemEnums } from './common';

export async function getPreSignedURL(
  file_name: string,
  mime_type: string,
  bucket_name: string,
  storage_path: string,
): Promise<Record<string, unknown>> {
  const prefixId = uuidv4();
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
