import { useRef, useState } from 'react';
import { Download, Loader2, Upload } from 'lucide-react';
import { message } from 'antd';

interface IBulkUploadButtonProps {
  label?: string;
  sampleFileName: string;
  sampleHeaders: string[];
  onUpload: (file: File) => Promise<unknown>;
  onUploaded?: () => void;
}

const downloadCsv = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

export const BulkUploadButton = ({
  label = 'Bulk Upload',
  sampleFileName,
  sampleHeaders,
  onUpload,
  onUploaded,
}: IBulkUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleSampleDownload = () => {
    const csv = sampleHeaders.join(',') + '\r\n';
    downloadCsv(sampleFileName, csv);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      message.error('Please select a .csv file');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
      onUploaded?.();
    } catch {
      // Error surfaced via the page's redux toast effect; nothing to do here.
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={handleSampleDownload}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 soft-btn"
      >
        <Download size={14} />
        Sample CSV
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Upload size={14} />
        )}
        {label}
      </button>
    </>
  );
};

export default BulkUploadButton;
