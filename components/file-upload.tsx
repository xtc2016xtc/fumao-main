'use client';
import React, { useState, useEffect, useRef } from 'react';
import useMdApi from '@/hooks/useMdApi';

type FileWithUrl = {
  value: string;
  url: string;
};
type FileUploadProps = {
  value: any;
  defaultValue: any,
  name: string;
  onChange: (value: FileWithUrl[]) => void;
  onRemove: (value: FileWithUrl) => void;
};

export default function FileUpload({
  value,
  name,
  onChange,
  defaultValue,
  onRemove
}: FileUploadProps) {
  // 使用useState来管理选中的文件列表
  const [files, setFiles] = useState<FileWithUrl[]>(defaultValue || []);
  const mdapi = useMdApi();
  // 基于value生成唯一ID，确保SSR和客户端渲染时id一致
  const inputId = useRef(`file-upload-${name}`); // 生成唯一ID
  

  useEffect(() => {
    // 当外部value变化时，更新内部状态
    // 确保value是一个数组
    console.log(value, 'value');
    setFiles(Array.isArray(value) ? value : []);
  }, [value]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      console.log(event.target.files, 'event.target.files');

      const newFiles = Array.from(event.target.files).map(async (file) => {
        const fileObj = { path: URL.createObjectURL(file), name: file.name };
        const res = await mdapi.local_uimage(fileObj) 
        return {
          value: res.imageId,
          url: res.downloadUrl
        };
      });
      const resoveFiles = await Promise.all(newFiles);
      console.log(resoveFiles, 'resoveFiles');
      setFiles([...files, ...resoveFiles]);
      onChange([...files, ...resoveFiles]); // 通知外部新的文件列表
    }
  };

  const handleRemoveFile = (fileToRemove: FileWithUrl) => {
    console.log(fileToRemove, 'fileToRemove', files);
    const updatedFiles = files.filter((file) => file.value != fileToRemove.value);
    console.log(updatedFiles, 'updatedFiles');
    setFiles(updatedFiles);
    onChange(updatedFiles); // 通知外部移除的文件
  };

  return (
    <div className="flex flex-wrap">
      {files.map((file, index) => (
        <div
          key={index}
          className="relative m-2 overflow-hidden rounded-md bg-muted"
        >
          <img
            src={file.url}
            alt={file.value}
            className="justify-left h-[120px] w-[120px] cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 object-cover"
          />

          <button
            type="button"
            className="absolute right-2 top-2 rounded-full bg-background/50 p-1 text-muted-foreground hover:bg-background/75 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => handleRemoveFile(file)}
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="justify-left m-2 flex h-[120px] w-[120px] flex-col items-center rounded-lg border-2 border-dashed border-gray-300">
        <input
          type="file"
          name="file"
          id={inputId.current} // 使用生成的唯一ID
          className="===h-[120px] relative hidden w-[120px]"
          accept="image/jpeg, image/png, image/gif, image/bmp, image/svg+xml"
          multiple={true} // 允许多选
          onChange={handleFileChange} // 处理文件变化
        />
        <label
          htmlFor={inputId.current}
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <UploadIcon className="h-4 w-4 text-gray-400" />
          <p className="mt-4 text-sm font-semibold">上传文件</p>
        </label>
      </div>
    </div>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="red" // 将 stroke 的颜色改为红色
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
