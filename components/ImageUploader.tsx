import React, { useState, useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileSelect: (file: File | null) => void;
  previewUrl: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileSelect, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileSelect(file);
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={handleAreaClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer h-48 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
        ) : (
          <div className="space-y-1 text-center">
            <UploadIcon />
            <div className="flex text-sm text-gray-600">
              <p className="pl-1">클릭하여 업로드하거나 드래그 앤 드롭하세요</p>
            </div>
            <p className="text-xs text-gray-500">최대 10MB의 PNG, JPG, GIF 파일</p>
          </div>
        )}
      </div>
      <input
        id={id}
        name={id}
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="sr-only"
        accept="image/*"
      />
    </div>
  );
};

export default ImageUploader;