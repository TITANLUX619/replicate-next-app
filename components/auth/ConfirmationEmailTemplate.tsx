import * as React from 'react';

interface ConfirmationEmailTemplateProps {
  confirmLink: string;
}

export const ConfirmationEmailTemplate: React.FC<Readonly<ConfirmationEmailTemplateProps>> = ({
  confirmLink,
}) => (
  <div>
    <h1>Welcome!</h1>
    <p>
      Please click the link below to confirm your email address.
    </p>
    <a href={confirmLink}>Click here!</a>
  </div>
);
