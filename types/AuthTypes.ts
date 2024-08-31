declare type LoginButtonProps = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

declare type AuthBackButtonProps = {
  label: string;
  href: string;
}

declare type ReloadButtonProps = {
  label: string;
}

declare type AuthCardWrapperProps = {
  children: React.ReactNode;
  headerLabel: string;
  backbuttonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
};

declare type AuthHeaderProps = {
  label: string;
};

declare interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

declare type AuthInfoMessageProps = {
  message: string;
  type: "error" | "success";
};

declare type AuthSignInProps = {
  email: string;
  password: string;
  twoFactorCode?: string;
}

declare type AuthSignInResponse = {
  twoFactorEnabled: boolean;
}

declare type AuthSignUpParams = {
  firstName: string;
  lastName: string;
  address1: string;
  city: string;
  postalCode: string;
  dateOfBirth: string;
  email: string;
  password: string;
};

declare type ResetPasswordProps = {
  email: string;
}

declare type NewPasswordProps = {
  newPassword: string;
  token?: string;
}

declare type AuthSignOutButtonProps = {
  children: React.ReactNode;
}

declare type DBUser = {
  id: string;
} & AuthSignUpParams;

declare enum AuthResultCode {
  InvalidCredentials = 'INVALID_CREDENTIALS',
  InvalidSubmission = 'INVALID_SUBMISSION',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  EmailNotVerified = 'EMAIL_NOT_VERIFIED',
  VerificationEmailSent = 'VERIFICATION_EMAIL_SENT',
  UnknownError = 'UNKNOWN_ERROR',
  UserCreated = 'USER_CREATED',
  UserLoggedIn = 'USER_LOGGED_IN'
}

declare enum VerificationTokenResultCode {
  TokenNotFound = 'TOKEN_NOT_FOUND',
  TokenHasExpired = 'TOKEN_HAS_EXPIRED',
  UserDoesNotExist = 'USER_DOES_NOT_EXIST',
  UserVerified = 'USER_VERIFIED'
}


