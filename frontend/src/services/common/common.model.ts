import type { StoragePath } from '@/utils/constants/constant';

export interface IPresignParams {
  file_name: string;
  mime_type: string;
  bucket_name: string;
  storage_path: StoragePath | string;
}

export interface IPresignedUrlData {
  fileName: string;
  preSignedUrl: string;
}

export interface IS3UploadResult {
  data: { fileUrl: string | null };
  status: number;
}
