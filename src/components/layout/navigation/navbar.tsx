"use client";
import Link from "next/link";
import { ThemeSwitcher } from "../themeswitch";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";

// New SafeLink Component to validate URLs and avoid redirection vulnerabilities.
interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}
function SafeLink({ href, children, ...props }: SafeLinkProps) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

interface NavigationMenuItemData {
  label: string;
  href: string;
  description: string;
}

function renderNavigationMenuContent(
  category: string,
  data: NavigationMenuItemData[]
) {
  return (
    <>
      <NavigationMenuTrigger>{category}</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[20vw] gap-3 p-4 md:w-[30vw] md:grid-cols-2 lg:grid-cols-[.75fr_1fr]">
          {data.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <SafeLink
                  href={item.href}
                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                  <div className="text-sm font-medium leading-none">
                    {item.label}
                  </div>
                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                    {item.description}
                  </p>
                </SafeLink>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  );
}

function renderMobileMenuSection(
  title: string,
  links: { href: string; label: string }[],
  toggleMenu: () => void
) {
  return (
    <div className="border-t pt-2">
      <p className="text-sm font-bold mb-2 text-muted-foreground px-2">
        {title}
      </p>
      {links.map((link) => (
        <SafeLink
          key={link.href}
          href={link.href}
          onClick={toggleMenu}
          className="text-lg font-medium hover:text-primary p-2 block"
        >
          {link.label}
        </SafeLink>
      ))}
    </div>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const gamesMenu: NavigationMenuItemData[] = [
    {
      label: "Douse Wildfire",
      href: "/games/dousewildfire/index.html",
      description: 'WildFire is a game which is made with only HTML,CSS,JAVA script. In this game the player has to save the aeorplane from the wildfire by pressing "Spacebar". And also to save the jungele from this wildfire by pressing "Down Arrow". But if the plane collides with the fire then thegame will be over. Also the score will be shown there.',
    },
    {
      label: "Car Run",
      href: "/games/carrun/index.html",
      description: "Car Run is a game which is made with only HTML,CSS,JAVA script. In this game the player has to move the car with ← →. Also you have to notice that your car doesn't collide with other cars else the game will end.",
    },
    {
      label: "TicTacToe",
      href: "/games/tictactoe/index.html",
      description:
        "TTic-tac-toe, noughts and crosses, or Xs and Os is a paper-and-pencil game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner. But here you can play it with your freinds as it is a two player game.",
    },
    {
      label: "Rock Paper Scissor",
      href: "/games/rps/index.html",
      description:
        'Rock Paper Scissors (also known by other orderings of the three items, with "rock" sometimes being called "stone", or as Rochambeau, roshambo, or ro-sham-bo) is a hand game, usually played between two people, in which each player simultaneously forms one of three shapes with an outstretched hand. These shapes are "rock" (a closed fist), "paper" (a flat hand), and "scissors" (a fist with the index finger and middle finger extended, forming a V). "Scissors" is identical to the two-fingered V sign (also indicating "victory" or "peace") except that it is pointed horizontally instead of being held upright in the air.This is an online version of this most popular game.',
    }
  ];
  const productMenu: NavigationMenuItemData[] = [
    {
      label: "Text Analyser",
      href: "https://textanalyserosc.netlify.app",
      description:
        "Our tool is a comprehensive solution for all your text editing and design needs. Whether you're crafting a professional document, styling creative content, or analyzing text for improvements, we’ve got you covered!",
    },
    {
      label: "ONotes",
      href: "https://github.com/abindent/ONotebook",
      description:
        "At Onotes, we believe that ideas flow better when barriers are removed. Our mission is to create a seamless note-taking experience that empowers teams to collaborate effectively, regardless of the content format.",
    },
    {
      label: "Nextcord Utility Bot",
      href: "https://github.com/abindent/Python-Utility-Bot",
      description:
        "A simple template for building a beautiful discord bot with discord.py. Here I have also implemented the buttons, discord modals and select menus along with slash commands. This project is under progress so you have to wait for some time to get your wanted features.",
    },
    {
      label: "More Projects",
      href: "https://github.com/abindent",
      description:
        "Explore more of my projects on GitHub. I am constantly working on new and exciting projects, so stay tuned for updates!",
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <SafeLink
                      href="/"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      Home
                    </SafeLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <SafeLink
                      href="/about"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      About Us
                    </SafeLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  {renderNavigationMenuContent("Games", gamesMenu)}
                </NavigationMenuItem>
                <NavigationMenuItem>
                  {renderNavigationMenuContent("Projects", productMenu)}
                </NavigationMenuItem>
                         <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <SafeLink
                      href="/contact"
                      className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                    >
                      Contact
                    </SafeLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button asChild variant="default">
                <SafeLink
                  href="https://www.patreon.com/c/OpenSourceCodes"
                  target="_blank"
                >
                  Purchase Premium
                </SafeLink>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <Drawer
          direction="right"
          open={isMenuOpen}
          onOpenChange={setIsMenuOpen}
        >
          <DrawerContent className="z-50 bg-gray-900">
            <DrawerHeader>
              <DrawerTitle className="flex items-center justify-between p-4">
                <Logo />
                <DrawerClose className="rounded-full border-[3.75px] border-white/20 p-[9px]">  
                  <X className="h-3.5 w-3.5 text-white" />
                </DrawerClose>
              </DrawerTitle>
            </DrawerHeader>
            <nav className="px-4 py-6 overflow-y-scroll">
              <SafeLink
                href="/"
                onClick={toggleMenu}
                className="block text-xl font-semibold text-white py-2 border-b border-transparent hover:border-white"
              >
                Home
              </SafeLink>
              <SafeLink
                href="/about"
                onClick={toggleMenu}
                className="block text-xl font-semibold text-white py-2 border-b border-transparent hover:border-white"
              >
                About Us
              </SafeLink>
               <SafeLink
                href="/contact"
                onClick={toggleMenu}
                className="block text-xl font-semibold text-white py-2 border-b border-transparent hover:border-white"
              >
                Contact Us
              </SafeLink>

              <div className="mt-4">
                <p className="text-lg font-bold text-gray-300 mb-2">Games</p>
                {gamesMenu.map((item) => (
                  <SafeLink
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    className="block text-lg text-white py-2 border-b border-transparent hover:border-white"
                  >
                    {item.label}
                  </SafeLink>
                ))}
              </div>

              <div className="mt-4">
                <p className="text-lg font-bold text-gray-300 mb-2">Projects</p>
                {productMenu.map((item) => (
                  <SafeLink
                    key={item.href}
                    href={item.href}
                    onClick={toggleMenu}
                    className="block text-lg text-white py-2 border-b border-transparent hover:border-white"
                  >
                    {item.label}
                  </SafeLink>
                ))}
              </div>

              <div className="mt-6">
                <Button asChild variant="default" className="w-full">
                  <SafeLink
                    href="https://www.patreon.com/c/OpenSourceCodes"
                    target="_blank"
                    onClick={toggleMenu}
                    className="text-lg font-semibold"
                  >
                    Purchase Premium
                  </SafeLink>
                </Button>
              </div>
            </nav>
          </DrawerContent>
        </Drawer>
      </header>
    </>
  );
}
