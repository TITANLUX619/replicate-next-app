import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import * as z from "zod"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const validateFormFields = <T extends z.ZodSchema>(fields: unknown, schema: T): boolean => {
  const result = schema.safeParse(fields);

  if (!result.success) {
    return false;
  }

  return true;
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const defaultAuthFormValues = {
  firstName: "",
  lastName: "",
  address1: "",
  city: "",
  state: "",
  postalCode: "",
  dateOfBirth: "1990-05-17",
  ssn: "",
  email: "",
  password: "",
  twoFactorCode: "",
}
