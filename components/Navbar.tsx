'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import UserMenuButton from './auth/UserMenu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import ListItem from "@/components/NavigationListItem"

const Navbar = () => {
  const router = useRouter()

  return (
    <nav className="bg-foreground/50 w-full z-50">
      <div className="w-full max-w-full px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center justify-between h-16 gap-40">
            <div
              onClick={() => { router.push('/') }}
              className="text-white text-3xl cursor-pointer"
            >
              🖌  PicturIA
            </div>
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>

                  <NavigationMenuTrigger
                    className="text-white bg-slate-500/50 text-lg font-medium"
                  >
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                      <li className="row-span-4">
                        <NavigationMenuLink asChild>
                          <div
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium">
                              GenAI Pictures Tools
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              A set of tools to generate images using AI
                            </p>
                          </div>
                        </NavigationMenuLink>
                      </li>
                      <ListItem href="/generate-image" title="Image Generator">
                        Generate images
                      </ListItem>
                      <ListItem href="/remove-background" title="Background remover">
                        Remove background from photos
                      </ListItem>
                      <ListItem href="/remove-objects" title="Objects remover">
                        Remove objects from photos
                      </ListItem>
                      <ListItem href="/try-on" title="Try on">
                        Try on a garment
                      </ListItem>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center">
            <UserMenuButton />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
