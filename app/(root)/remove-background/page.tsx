'use client';

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import useToast from "@/hooks/useToast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { removeBackground } from "@/actions/models/remove-bg-actions";
import { UploadDropzone } from "@/components/UploadthingComponent";

export default function RemoveBackgroundPage() {
  const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
  const [prediction, setPrediction] = useState<any>(undefined);
  const addToast = useToast();
  const [isPending, startTransition] = useTransition();

  const onUploadComplete = (res: any) => {
    console.log('onUploadComplete', res[0]);
    setUploadedImage(res[0].url);
  }

  const onUploadError = (error: Error) => {
    addToast({ message: error.message, type: 'error' });
  }

  const onSubmit = async () => {
    if (!uploadedImage) return;

    console.log('imageUrl', uploadedImage);

    startTransition(async () => {
      const result = await removeBackground({ image: uploadedImage });
      addToast({ message: result.message, type: result.type });
      setPrediction(result.data);
    });
  }

  const reload = () => {
    setUploadedImage(undefined);
    setPrediction(undefined);
  }

  return (
    <Card className="generate-image">
      <CardHeader>
        <h1 className="py-6 text-center font-bold text-2xl">
          Upload an image to remove its background:
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
          {uploadedImage && !prediction && (
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
          {!prediction && uploadedImage && (
            <Button
              disabled={!uploadedImage || isPending}
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
    </Card>
  );
}
