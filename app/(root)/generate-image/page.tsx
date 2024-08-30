'use client';

import * as z from "zod";
import { useState, useTransition } from "react";
import Image from "next/image";
import { sendPrompt } from "@/actions/flux-dev-actions";
import useToast from "@/hooks/useToast";
import { Prediction } from "replicate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { promptFormSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [prediction, setPrediction] = useState<Prediction | undefined>(undefined);
  const addToast = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof promptFormSchema>>({
    resolver: zodResolver(promptFormSchema),
    defaultValues: {
      prompt: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof promptFormSchema>) => {
    const promptValue = values.prompt;

    startTransition(async () => {
      const result = await sendPrompt({ prompt: promptValue || "" });

      addToast({ message: result.message, type: result.type });

      setPrediction(result.data);
    })
  }

  return (
    <Card className="settings">
      <CardHeader>
        <h1 className="py-6 text-center font-bold text-2xl">
          Describe a picture:
        </h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="w-full flex flex-row justify-between items-end gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="A picture of a cat eating a cookie"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button
                disabled={isPending}
                type="submit"
                className="min-w-[120px]"
              >
                {isPending ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> &nbsp;
                    Loading...
                  </>
                ) : 'Send'}
              </Button>
            </div>

          </form>
        </Form>
        {prediction && (
          <>
            {isPending
              ? <p className="py-3 text-sm opacity-50">status: {prediction.status}</p>
              : <div className="r-image-wrapper mt-5">
                <Image
                  src={prediction.output[prediction.output.length - 1]}
                  alt="output"
                  sizes="100vw"
                  height={768}
                  width={768}
                />
              </div>
            }

          </>
        )}
      </CardContent>
    </Card>
  );
}
