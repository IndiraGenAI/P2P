import axios from 'axios';
import config from '@/utils/config';
import request from '@/axios/request';
import { ENV } from '@/common/config';
import { StoragePath } from '@/utils/constants/constant';
import type {
  IPresignParams,
  IPresignedUrlData,
  IS3UploadResult,
} from './common.model';

const HTTP_STATUS_BAD_REQUEST = 400;

const isCSV = (fileName: string): boolean =>
  fileName.toLowerCase().endsWith('.csv');

class CommonService {
  ENDPOINT = config.baseApiMasters + '/common';

  /**
   * Ask the back-service for a pre-signed PUT URL. The browser then uploads
   * the file directly to S3 using that URL — the file never travels through
   * our API. Mirrors the WEB project's commonModule.service.
   */
  getPresignedURL = (params: IPresignParams) => {
    const url = `${this.ENDPOINT}/presigned-url`;
    return request<{ data: IPresignedUrlData }>({
      url,
      method: 'GET',
      params,
    });
  };

  /**
   * Upload a single File to S3 via a pre-signed URL.
   * Returns { data: { fileUrl }, status } where fileUrl is the S3 object key
   * (e.g. "ProfileImages/<uuid>.png") to be persisted on the entity.
   */
  s3FileUpload = async (
    file: File,
    type: StoragePath | string,
    bucket?: string,
  ): Promise<IS3UploadResult> => {
    if (!file) {
      return { data: { fileUrl: null }, status: HTTP_STATUS_BAD_REQUEST };
    }
    const params: IPresignParams = {
      file_name: file.name,
      mime_type: file.type,
      bucket_name: bucket ?? ENV.aws.s3PublicBucket,
      storage_path: type,
    };
    if (params.mime_type === '' && isCSV(file.name)) {
      params.mime_type = 'text/csv';
    }

    try {
      const response = await this.getPresignedURL(params);
      const data = response.data?.data;
      const signedRequest = data?.preSignedUrl;
      const fileUrl = data?.fileName ?? null;

      if (signedRequest) {
        const options = { headers: { 'Content-Type': params.mime_type } };
        const s3response = await axios.put(signedRequest, file, options);
        return { data: { fileUrl }, status: s3response.status };
      }
      return { data: { fileUrl: null }, status: HTTP_STATUS_BAD_REQUEST };
    } catch (error: unknown) {
      const status =
        (error as { response?: { status?: number } })?.response?.status ??
        HTTP_STATUS_BAD_REQUEST;
      return { data: { fileUrl: null }, status };
    }
  };

  /**
   * Walk an arbitrary form value and replace every `File` instance with the
   * S3 object key returned by `s3FileUpload`. Useful when a payload mixes
   * scalar fields with one or more file inputs (e.g. profile image, vendor
   * documents). Mirrors the WEB project's helper.
   */
  uploadFileFromFormData = async <T = unknown>(
    valuesData: T,
    storagePath: StoragePath | string = StoragePath.DEFAULT,
  ): Promise<T> => {
    if (valuesData instanceof File) {
      const fileData = await this.s3FileUpload(valuesData, storagePath);
      if (fileData.data?.fileUrl) {
        return fileData.data.fileUrl as unknown as T;
      }
      throw new Error('Failed to upload file. Please try again later.');
    }
    if (Array.isArray(valuesData)) {
      const result = [...valuesData];
      for (let i = 0; i < result.length; i += 1) {
        result[i] = await this.uploadFileFromFormData(result[i], storagePath);
      }
      return result as unknown as T;
    }
    if (
      valuesData !== null &&
      typeof valuesData === 'object' &&
      !(valuesData instanceof Date)
    ) {
      const obj = valuesData as Record<string, unknown>;
      const result: Record<string, unknown> = { ...obj };
      for (const key of Object.keys(obj)) {
        result[key] = await this.uploadFileFromFormData(
          obj[key],
          storagePath,
        );
      }
      return result as unknown as T;
    }
    return valuesData;
  };

  /**
   * Permanently delete an object from S3 via the back-service. Used when
   * a user replaces or removes an uploaded file (or when the parent
   * record is deleted). Resolves with `true` on success, `false` on
   * failure — callers may want to ignore failures so they don't block
   * the main DB write.
   */
  deleteS3File = async (
    fileKey?: string | null,
    bucket?: string,
  ): Promise<boolean> => {
    if (!fileKey) return false;
    if (/^https?:\/\//i.test(fileKey)) return false;
    const params = {
      bucket_name: bucket ?? ENV.aws.s3PublicBucket,
      file_key: fileKey,
    };
    if (!params.bucket_name) return false;
    try {
      await request({
        url: `${this.ENDPOINT}/file`,
        method: 'DELETE',
        params,
      });
      return true;
    } catch {
      return false;
    }
  };

  /** Build the public URL for a stored S3 object key. */
  resolvePublicUrl = (fileKey?: string | null): string | null => {
    if (!fileKey) return null;
    if (/^https?:\/\//i.test(fileKey)) return fileKey;
    const base = ENV.aws.s3PublicBaseUrl?.replace(/\/$/, '');
    if (!base) return fileKey;
    const key = fileKey.replace(/^\//, '');
    return `${base}/${key}`;
  };
}

export default new CommonService();
