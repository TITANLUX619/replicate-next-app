import * as React from 'react';

interface ResetEmailTemplate {
  resetLink: string;
}

export const ResetEmailTemplate: React.FC<Readonly<ResetEmailTemplate>> = ({
  resetLink,
}) => (
  <div>
    <h1>Welcome!</h1>
    <p>
      Please click the link below to reset your password.
    </p>
    <a href={resetLink}>Click here!</a>
  </div>
);
