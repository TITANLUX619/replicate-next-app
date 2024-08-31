'use client';

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import useToast from "@/hooks/useToast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MaskGenerator from "@/components/MaskGenerator"; // Cambiar nombre del componente si es necesario
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { removeObjects } from "@/actions/models/remove-objects-actions"; // Asegúrate de tener esta acción implementada
import { UploadDropzone } from "@/components/UploadthingComponent";

export default function RemoveObjectsPage() {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [prediction, setPrediction] = useState<any>(undefined);
  const addToast = useToast();
  const [isPending, startTransition] = useTransition();
  const [maskUrl, setMaskUrl] = useState<string | null>(null);

  const onUploadComplete = (res: any) => {
    setUploadedImage(res[0].url);
  }

  const onUploadError = (error: Error) => {
    addToast({ message: error.message, type: 'error' });
  }

  const onSubmit = async () => {
    if (!uploadedImage || !maskUrl) return;

    startTransition(async () => {
      try {
        const result = await removeObjects({ image: uploadedImage, mask: maskUrl as string });
        addToast({ message: result.message, type: result.type });
        setPrediction(result.data);
      } catch (error) {
        addToast({ message: 'Error processing the image', type: 'error' });
      }
    });
  }

  const reload = () => {
    setUploadedImage(undefined);
    setPrediction(undefined);
    setMaskUrl(null);
  }

  return (
    <Card className="generate-image">
      <CardHeader>
        <h1 className="py-6 text-center font-bold text-2xl">
          Upload an image and draw on areas to remove:
        </h1>
      </CardHeader>
      <CardContent>
        <div className="w-full flex flex-col justify-center items-center gap-4">
          <div className="w-full flex flex-col gap-4">
            {!uploadedImage && (
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  onUploadComplete(res);
                }}
                onUploadError={(error: Error) => {
                  onUploadError(error);
                }}
              />
            )}
          </div>
          {uploadedImage && !maskUrl && (
            <MaskGenerator imageUrl={uploadedImage} onMaskComplete={setMaskUrl} />
          )}
          {uploadedImage && maskUrl && !prediction && (
            <div className="r-image-wrapper mt-5">
              <Image
                src={uploadedImage}
                alt="uploaded"
                sizes="100vw"
                height={768}
                width={768}
              />
            </div>
          )}
          {prediction && (
            <div className="r-image-wrapper mt-5">
              <Image
                src={prediction.output}
                alt="output"
                sizes="100vw"
                height={768}
                width={768}
              />
            </div>
          )}
          {!prediction && uploadedImage && maskUrl && (
            <Button
              disabled={!uploadedImage || !maskUrl || isPending}
              type="submit"
              className="min-w-[120px]"
              onClick={prediction ? () => reload() : () => onSubmit()}
            >
              {isPending && (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Processing...
                </>
              )}
              {!isPending && (
                prediction ? 'Upload another image' : 'Submit')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card >
  );
}
