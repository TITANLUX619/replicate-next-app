import React from 'react'
import { Card, CardFooter, CardHeader, CardContent } from '../ui/card'
import AuthCardHeader from './AuthCardHeader'
import Social from './Social'
import AuthBackButton from './AuthBackButton'

const AuthCardWrapper = (
  { children, headerLabel, backbuttonLabel, backButtonHref, showSocial }: AuthCardWrapperProps
) => {
  return (
    <Card className="auth-card-wrapper">
      <CardHeader>
        <AuthCardHeader label={headerLabel} />
      </CardHeader>

      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <AuthBackButton
          label={backbuttonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  )
}

export default AuthCardWrapper