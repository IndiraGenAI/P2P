import { S3 } from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import { commonConfig, SystemEnums } from './common';
import { extname } from 'path';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { Request } from 'express';

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

/**
 * Permanently delete an object from S3. Used when a user replaces or
 * removes their profile image (and other future "swap a file" flows).
 * Note: S3 `deleteObject` is idempotent — it returns 204 even if the
 * key doesn't exist, so callers don't need to pre-check.
 */
export async function deleteS3File(
  bucket_name: string,
  file_key: string,
): Promise<void> {
  if (!bucket_name || !file_key) {
    throw new BadRequestException(
      'bucket_name and file_key are required to delete an S3 object.',
    );
  }
  await new S3()
    .deleteObject({ Bucket: bucket_name, Key: file_key })
    .promise();
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

// ---------------------------------------------------------------------------
// Bulk-upload helpers (CSV)
// Used by master modules (Item, Vendor, ...) to accept a CSV file via Multer
// and stream-parse it into an array of row objects keyed by the header row.
// ---------------------------------------------------------------------------

export const editFileName = (
  _req: Request,
  file: Express.Multer.File,
  callback: (error: Error | null, filename?: string) => void,
): void => {
  const name = file.originalname.split('.').slice(0, -1).join('.');
  const fileExtName = extname(file.originalname);
  if (fileExtName.toLowerCase() === '.csv') {
    const safeName = `${name}-${Date.now()}${fileExtName}`;
    callback(null, safeName);
  } else {
    callback(new BadRequestException('Only CSV file is allowed'));
  }
};

export const readCSV = (filepath: string): Promise<Record<string, string>[]> => {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    fs.createReadStream(filepath)
      .pipe(csvParser())
      .on('data', (data: Record<string, string>) => results.push(data))
      .on('error', (err) => reject(err))
      .on('end', () => resolve(results));
  });
};

export interface IBulkUploadResult<T = unknown> {
  totalRows: number;
  successCount: number;
  failureCount: number;
  inserted: T[];
  errors: { row: number; message: string; data?: Record<string, string> }[];
}
