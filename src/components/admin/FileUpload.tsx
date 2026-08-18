import React, { useState, useEffect, ChangeEvent } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface Props {
  onFileSelect: (file: File | null) => void;
}

const FileUpload: React.FC<Props> = ({ onFileSelect }) => {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    onFileSelect(file);
  }, [file]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  return (
    <div className="w-full">
      <div className="grid w-full items-center gap-1.5">
        <Label className="font-bold text-xs" htmlFor="event-banner">
          Event Banner Image (1:1 Ratio)
        </Label>
        <Input
          id="event-banner"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default FileUpload;