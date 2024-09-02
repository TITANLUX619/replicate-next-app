import {
  generateUploadDropzone,
} from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

const UploadDropzoneComponent = generateUploadDropzone<OurFileRouter>();

export const UploadDropzone = ({ endpoint, onClientUploadComplete, onUploadError }: UploadDropzoneComponentProps) => {
  return <UploadDropzoneComponent
    endpoint="imageUploader"
    onClientUploadComplete={onClientUploadComplete}
    onUploadError={onUploadError}
    className="border-2 border-dashed border-border"
  />;
}