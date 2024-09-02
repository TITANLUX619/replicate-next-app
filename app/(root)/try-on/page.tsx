'use client';

import { useState, useTransition, FormEvent, Suspense } from "react";
import Image from "next/image";
import useToast from "@/hooks/useToast";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { UploadDropzone } from "@/components/UploadthingComponent";
import { tryOn } from "@/actions/models/idm-vton-actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"; // Importar componentes de Select

export default function TryOnPage() {
  const [humanImage, setHumanImage] = useState<string | undefined>(undefined);
  const [garmImage, setGarmImage] = useState<string | undefined>(undefined);
  const [garmDescription, setGarmDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("upper_body"); // Estado para el tipo de prenda
  const [prediction, setPrediction] = useState<any>(undefined);
  const addToast = useToast();
  const [isPending, startTransition] = useTransition();

  const onUploadComplete = (res: any, type: 'human' | 'garm') => {
    if (type === 'human') {
      setHumanImage(res[0].url);
    } else if (type === 'garm') {
      setGarmImage(res[0].url);
    }
  }

  const onUploadError = (error: Error) => {
    addToast({ message: error.message, type: 'error' });
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGarmDescription(event.target.value);
  }

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!humanImage || !garmImage || !garmDescription || !category) return;

    startTransition(async () => {
      try {
        const result = await tryOn({ humanImage, garmImage, garmDescription, category });
        addToast({ message: result.message, type: result.type });
        setPrediction(result.data);
      } catch (error) {
        addToast({ message: 'Error processing the image', type: 'error' });
      }
    });
  }

  const reload = () => {
    setHumanImage(undefined);
    setGarmImage(undefined);
    setGarmDescription("");
    setCategory("upper_body");
    setPrediction(undefined);
  }

  return (
    <Card className="generate-image">
      <CardHeader>
        <h1 className="py-6 text-center font-bold text-2xl">
          Upload images to try on a garment:
        </h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="w-full flex flex-col justify-center items-center gap-4">
          <div className="w-full flex flex-row gap-4 items-start">
            {!prediction && (
              <>
                <div className="flex flex-col w-[70%]">
                  <p>Selfie:</p>
                  {!humanImage && (
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => onUploadComplete(res, 'human')}
                      onUploadError={onUploadError}
                    />
                  )}
                  {humanImage && garmImage && (
                    <div className="w-[70%]">
                      <Image
                        src={humanImage}
                        alt="uploaded human"
                        sizes="100vw"
                        height={768}
                        width={768}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col w-[30%]">
                  <p>Garment:</p>
                  {!garmImage && (
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) => onUploadComplete(res, 'garm')}
                      onUploadError={onUploadError}
                    />
                  )}
                  {garmImage && !prediction && (
                    <Image
                      src={garmImage}
                      alt="uploaded garment"
                      sizes="100vw"
                      height={400}
                      width={400}
                    />
                  )}
                  <div className="mt-4">
                    <Label htmlFor="garmDescription">Garment Description</Label>
                    <Input
                      id="garmDescription"
                      value={garmDescription}
                      onChange={handleDescriptionChange}
                      placeholder="Enter a brief description of the garment"
                      disabled={isPending}
                      required
                      className="mt-2"
                    />
                  </div>

                  <div className="mt-4">
                    <Label htmlFor="category">Select Garment Type</Label>
                    <Select onValueChange={handleCategoryChange} defaultValue="upper_body">
                      <SelectTrigger id="category" className="mt-2">
                        <SelectValue placeholder="Select a garment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upper_body">Upper Body</SelectItem>
                        <SelectItem value="lower_body">Lower Body</SelectItem>
                        <SelectItem value="dresses">Dress</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
          </div>

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

          {/* Botón de submit */}
          {!prediction && humanImage && garmImage && (
            <Button
              disabled={!humanImage || !garmImage || !garmDescription || !category || isPending}
              type="submit"
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Processing...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          )}

          {/* Botón para recargar la página */}
          {prediction && (
            <Button
              className="min-w-[120px]"
              onClick={reload}
            >
              Upload Another Image
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
