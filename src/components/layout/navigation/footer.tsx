"use client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Github, Twitter, Instagram } from "lucide-react";
import { Logo } from "./logo";
import { subscribeNewsletter } from "@/lib/hooks/subscriber";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("email", email);
      await subscribeNewsletter(formData)
        .then((res) => {
          if (res.success) {
            toast.success("Subscribed successfully!");
            setEmail("");
          } else {
            toast.error(res.error || "Subscription failed.");
          }
        })
        .catch(() => {
          toast.error("Unexpected error. Please try again later.");
        });
    });
  };

  return (
    <footer className="border-t bg-background">
      <div className="container px-3 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Logo />
            <p className="text-sm text-muted-foreground">
              OpenSourceCodes is a website of different types of open-source
              projects. You will find many exciting and interesting projects
              here. Hope you will like them.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://github.com/abindent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link
                href="https://x.com/AbindentXtreme"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://www.instagram.com/itz_sinu_xtreme/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium">Games</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link
                    href="/games/dousewildfire/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Douse Wildfire
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games/carrun/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Car Run
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games/tictactoe/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Tic Tac Toe
                  </Link>
                </li>
                <li>
                  <Link
                    href="/games/rps/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Rock, Paper & Scissor
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Projects</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link
                    href="https://github.com/abindent/ONotebook"
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ONotes
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://textanalyserosc.netlify.app"
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Text Analyser
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/abindent"
                    target="_blank"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    For More...
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.patreon.com/c/OpenSourceCodes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Premium Access
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium">Subscribe to our newsletter</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Stay updated with our latest games and features.
            </p>
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex max-w-sm space-x-2"
            >
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} OpenSourceCodes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
