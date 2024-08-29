'use server'

import bcryptjs from 'bcryptjs';
import { signIn as authSignIn, signOut as authSignOut } from '@/auth/auth';
import { AuthError } from "next-auth";
import { generateVerificationToken } from "./verification-token-actions";
import { Resend } from "resend";
import { ConfirmationEmailTemplate } from "@/components/auth/ConfirmationEmailTemplate";
import { validateFormFields } from '@/lib/utils';
import { authFormSchema, newPasswordFormSchema, resetPasswordFormSchema } from '@/schemas';
import { ResetEmailTemplate } from '@/components/auth/ResetEmailTemplate';
import { deletePasswordResetTokenById, generateResetPasswordToken, getPasswordResetTokenByToken } from './reset-token-actions';
import { TwoFactorTokenEmailTemplate } from '@/components/auth/TwoFactorTokenEmailTemplate';
import { delete2FATokenById, generate2FAToken, get2FATokenByEmail } from './two-factor-token-actions';
import { delete2FAConfirmationById, generate2FAConfirmation, get2FAConfirmationByUserId } from './two-factor-confirmation';
import { baseURL } from '@/lib/constants/routes';
import prisma from '@/lib/db';
import { getUserByEmail } from './user-actions';

export const signIn = async (formData: AuthSignInProps): ServerActionResult<AuthSignInResponse> => {

  const { email, password, twoFactorCode } = formData;

  const validFields = validateFormFields({ email, password }, authFormSchema('sign-in'));

  if (!validFields) return { type: 'error', message: 'Invalid fields!' };

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { type: 'error', message: 'Invalid credentials!' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);
  }

  if (existingUser.twoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      const existing2FAToken = await get2FATokenByEmail(email);

      if (!existing2FAToken || existing2FAToken.token !== twoFactorCode) {
        return { type: 'error', message: 'Invalid 2FA code!' };
      }

      const hasExpired = new Date() > new Date(existing2FAToken.expires);

      if (hasExpired) {
        return { type: 'error', message: '2FA code has expired!' };
      }

      await delete2FATokenById(existing2FAToken.id);

      const existingConfirmation = await get2FAConfirmationByUserId(existingUser.id);

      if (existingConfirmation) delete2FAConfirmationById(existingConfirmation.id);

      await generate2FAConfirmation(existingUser.id);

    } else {
      const new2FAToken = await generate2FAToken(existingUser.email);
      await sendTwoFactorTokenEmail(existingUser.email, new2FAToken.token);

      return { type: 'info', message: 'Two factor token sent!', data: { twoFactorEnabled: true } };
    }
  }

  try {
    await authSignIn('credentials', {
      email,
      password,
      redirect: false,
    });

    return { type: 'success', message: 'Signed in!' };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { type: 'error', message: 'Invalid credentials!' };
        default:
          console.log(error);
          return { type: 'error', message: 'Something went wrong, please try again!' };
      }
    } else return { type: 'error', message: 'Something went wrong, please try again!' };
  }
}

export const signUp = async (formData: AuthSignUpParams): ServerActionResult<null> => {
  const { firstName, lastName, address1, city, postalCode, dateOfBirth, email, password } = formData;

  const validFields = validateFormFields(formData, authFormSchema('sign-in'));

  if (!validFields) return { type: 'error', message: 'Invalid fields!' };

  try {
    // insert a prisma database user
    const hasshedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { type: 'error', message: 'User already exists, please sign in!' };
    }

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        address1,
        city,
        postalCode,
        dateOfBirth: new Date(dateOfBirth),
        email,
        password: hasshedPassword
      }
    })

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { type: 'info', message: 'Verification email sent!' };
  } catch (error) {
    console.log(error);
    return { type: 'error', message: 'Something went wrong, please try again!' };

  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${baseURL}/new-verification?token=${token}`;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email address',
      react: ConfirmationEmailTemplate({ confirmLink }),
    });
  } catch (error) {
    console.log(error);
  }
}

export const resetPassword = async (formData: ResetPasswordProps): ServerActionResult<null> => {
  const { email } = formData;

  if (!email) {
    return { type: 'error', message: 'Missing email!' };
  }

  const validFields = validateFormFields(formData, resetPasswordFormSchema);

  if (!validFields) return { type: 'error', message: 'Invalid fields!' };

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { type: 'error', message: 'User not found!' };
  }

  const passwordResetToken = await generateResetPasswordToken(email);

  await sendResetPasswordEmail(passwordResetToken.email, passwordResetToken.token);

  return { type: 'info', message: 'Password reset email sent!' };
}

export const sendResetPasswordEmail = async (
  email: string,
  token: string
) => {
  const resetLink = `${baseURL}/new-password?token=${token}`;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email address',
      react: ResetEmailTemplate({ resetLink }),
    });
  } catch (error) {
    console.log(error);
  }
}

export const setNewPassword = async ({ newPassword, token }: NewPasswordProps): ServerActionResult<null> => {
  if (!newPassword || !token) {
    return { type: 'error', message: 'Missing token' };
  }

  const validFields = validateFormFields({ newPassword }, newPasswordFormSchema);

  if (!validFields) return { type: 'error', message: 'Invalid fields!' };

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { type: 'error', message: 'Invalid token!' };
  }

  const hasExpired = new Date() > new Date(existingToken.expires);

  if (hasExpired) {
    return { type: 'error', message: 'Token has expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { type: 'error', message: 'User not found!' };
  }

  const hashedPassword = await bcryptjs.hash(newPassword, 10);

  await prisma.user.update({
    where: { email: existingToken.email },
    data: { password: hashedPassword }
  });

  await deletePasswordResetTokenById(existingToken.id);

  return { type: 'success', message: 'Password reset!' };
}

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Confirm your email address',
      react: TwoFactorTokenEmailTemplate({ token }),
    });
  } catch (error) {
    console.log(error);
  }
}

