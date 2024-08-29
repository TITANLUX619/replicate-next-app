import * as React from 'react';

interface TwoFactorTokenEmailTemplate {
  token: string;
}

export const TwoFactorTokenEmailTemplate: React.FC<Readonly<TwoFactorTokenEmailTemplate>> = ({
  token,
}) => (
  <div>
    <h1>Welcome!</h1>
    <p>
      This is your 2FA token: {token}
    </p>
  </div>
);
