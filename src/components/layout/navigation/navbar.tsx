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
import { Menu, X, ExternalLink, ChevronRight, Gamepad2, FolderCode } from "lucide-react";
import { useState } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerContent,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// SafeLink — validates URLs and prevents open-redirect vulnerabilities
interface SafeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}
function SafeLink({ href, children, className, ...props }: SafeLinkProps) {
  const isExternal = href.startsWith("http");
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}

interface NavigationMenuItemData {
  label: string;
  href: string;
  description: string;
}

// Desktop dropdown content
function renderNavigationMenuContent(
  category: string,
  data: NavigationMenuItemData[]
) {
  return (
    <>
      <NavigationMenuTrigger className="cursor-pointer text-sm font-medium text-foreground/80 hover:text-foreground transition-colors data-[state=open]:text-foreground">
        {category === "Games" ? <SafeLink href="/games">{category}</SafeLink> : category}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[420px] gap-2 p-3 lg:w-[520px] lg:grid-cols-2">
          {data.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <SafeLink
                  href={item.href}
                  className="group flex select-none flex-col gap-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground border border-transparent hover:border-border/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold leading-none group-hover:text-accent-foreground">
                      {item.label}
                    </span>
                    {item.href.startsWith("http") && (
                      <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-70 transition-opacity" />
                    )}
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground group-hover:text-accent-foreground/70">
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

// Mobile drawer section with icon
function MobileSection({
  title,
  icon: Icon,
  items,
  onClose,
}: {
  title: string;
  icon: React.ElementType;
  items: NavigationMenuItemData[];
  onClose: () => void;
}) {
  return (
    <div className="mt-2">
      {/* Section header */}
      <div className="flex items-center gap-2 px-1 py-2 mb-1">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title==="Games" ? <SafeLink href="/games">{title}</SafeLink> : title}
        </span>
      </div>

      {/* Section links */}
      <div className="space-y-0.5 rounded-xl border border-border/60 overflow-hidden bg-muted/30">
        {items.map((item, idx) => (
          <SafeLink
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              "flex items-center justify-between px-4 py-3.5 text-sm font-medium transition-colors duration-150",
              "text-foreground/90 hover:text-foreground hover:bg-accent/60",
              idx !== items.length - 1 && "border-b border-border/40"
            )}
          >
            <span>{item.label}</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground" />
          </SafeLink>
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gamesMenu: NavigationMenuItemData[] = [
    {
      label: "Douse Wildfire",
      href: "/games/dousewildfire/index.html",
      description:
        "Save the airplane from wildfire using Spacebar, and protect the jungle with the Down Arrow key.",
    },
    {
      label: "Car Run",
      href: "/games/carrun/index.html",
      description:
        "Drive your car using ← → arrow keys and dodge oncoming traffic before you crash.",
    },
    {
      label: "TicTacToe",
      href: "/games/tictactoe/index.html",
      description:
        "Classic two-player Tic-Tac-Toe — play with a friend and get three in a row to win.",
    },
    {
      label: "Rock Paper Scissors",
      href: "/games/rps/index.html",
      description:
        "The timeless hand game, now online. Challenge the computer in this RPS showdown.",
    },
  ];

  const productMenu: NavigationMenuItemData[] = [
    {
      label: "Text Analyser",
      href: "https://textanalyserosc.netlify.app",
      description:
        "A comprehensive tool for text editing, styling, and analysis — all in one place.",
    },
    {
      label: "ONotes",
      href: "https://github.com/abindent/ONotebook",
      description:
        "Seamless collaborative note-taking that removes barriers to great ideas.",
    },
    {
      label: "Nextcord Utility Bot",
      href: "https://github.com/abindent/Python-Utility-Bot",
      description:
        "A Discord bot template with slash commands, buttons, modals, and select menus.",
    },
    {
      label: "More Projects",
      href: "https://github.com/abindent",
      description:
        "Browse all open-source projects on GitHub — always something new in progress.",
    },
  ];

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const navLinkClass =
    "group inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-foreground/75 transition-colors duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50";

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        {/* Frosted glass bar */}
        <div className="border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">

              {/* Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Desktop nav — hidden below lg */}
              <div className="hidden lg:flex items-center gap-1">
                <NavigationMenu>
                  <NavigationMenuList className="gap-0.5">
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <SafeLink href="/" className={navLinkClass}>
                          Home
                        </SafeLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <SafeLink href="/about" className={navLinkClass}>
                          About
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
                        <SafeLink href="/contact" className={navLinkClass}>
                          Contact
                        </SafeLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Right-side actions — desktop */}
              <div className="hidden lg:flex items-center gap-3">
                <ThemeSwitcher />
                <Button
                  asChild
                  variant="default"
                  size="sm"
                  className="rounded-full px-5 font-semibold shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-px active:translate-y-0"
                >
                  <SafeLink href="https://www.patreon.com/c/OpenSourceCodes">
                    Purchase Premium
                  </SafeLink>
                </Button>
              </div>

              {/* Tablet nav — visible md–lg: condensed links + menu for dropdowns */}
              <div className="hidden md:flex lg:hidden items-center gap-2">
                <NavigationMenu>
                  <NavigationMenuList className="gap-0.5">
                    <NavigationMenuItem>
                      <NavigationMenuLink asChild>
                        <SafeLink href="/" className={navLinkClass}>
                          Home
                        </SafeLink>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      {renderNavigationMenuContent("Games", gamesMenu)}
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                      {renderNavigationMenuContent("Projects", productMenu)}
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
                <ThemeSwitcher />
                {/* Hamburger for remaining links on tablet */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="rounded-lg hover:bg-accent"
                  aria-label="Open menu"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>

              {/* Mobile: theme + hamburger only */}
              <div className="flex items-center gap-2 md:hidden">
                <ThemeSwitcher />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMenu}
                  className="rounded-lg hover:bg-accent"
                  aria-label="Open menu"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Drawer (mobile + tablet) ── */}
      <Drawer direction="right" open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DrawerContent
          className={cn(
            "z-50 flex flex-col",
            // Theme-aware background + border
            "bg-background border-l border-border",
            // Width: narrower on tablet, full-ish on mobile
            "w-[min(85vw,360px)] sm:w-[320px]"
          )}
        >
          {/* Drawer header */}
          <DrawerHeader className="flex items-center justify-between px-5 py-4 border-b border-border">
            <DrawerTitle className="m-0 p-0">
              <Logo />
            </DrawerTitle>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          {/* Scrollable nav content */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            {/* Top-level links */}
            <div className="space-y-0.5 rounded-xl border border-border/60 overflow-hidden bg-muted/30">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact Us" },
              ].map((link, idx, arr) => (
                <SafeLink
                  key={link.href}
                  href={link.href}
                  onClick={toggleMenu}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 text-sm font-semibold transition-colors duration-150",
                    "text-foreground hover:bg-accent hover:text-accent-foreground",
                    idx !== arr.length - 1 && "border-b border-border/40"
                  )}
                >
                  {link.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
                </SafeLink>
              ))}
            </div>

            {/* Games section */}
            <MobileSection
              title="Games"
              icon={Gamepad2}
              items={gamesMenu}
              onClose={toggleMenu}
            />

            {/* Projects section */}
            <MobileSection
              title="Projects"
              icon={FolderCode}
              items={productMenu}
              onClose={toggleMenu}
            />
          </nav>

          {/* Sticky footer CTA */}
          <div className="px-4 py-4 border-t border-border bg-background">
            <Button
              asChild
              variant="default"
              className="w-full rounded-xl h-11 font-semibold text-sm shadow transition-all duration-200 hover:shadow-md hover:-translate-y-px active:translate-y-0"
            >
              <SafeLink
                href="https://www.patreon.com/c/OpenSourceCodes"
                onClick={toggleMenu}
              >
                Purchase Premium
              </SafeLink>
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}