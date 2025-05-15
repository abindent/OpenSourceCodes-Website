"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Moon,
  Sun,
  Github,
  Code,
  Users,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-background to-secondary/10 px-4 py-12 sm:px-8 md:px-16 lg:px-24">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Code className="h-8 w-8" />
            </div>
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              OpenSourceCodes
            </span>
          </h1>
          <p className="mb-8 text-xl text-muted-foreground">
            A vibrant initiative, democratizing technology through accessible
            open-source tools and resources
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://discord.com/invite/n3q3HYMnkV"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                Join Our Community (Discord)
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/games">
              <Button size="lg" className="gap-2">
                Explore Games
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link
              href="https://github.com/abindent"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                View Projects
              </Button>
            </Link>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="mx-auto mt-20 max-w-3xl rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <h2 className="mb-4 text-center text-2xl font-bold">Our Mission</h2>
          <p className="text-center text-muted-foreground">
            To democratize technology by providing accessible, open-source tools
            and resources that empower individuals to enhance their skills and
            contribute to meaningful projects. We believe in the power of
            community-driven development and strive to foster an environment
            where knowledge is shared, and creativity thrives.
          </p>
        </div>

        {/* Features Section */}
        <div className="mx-auto mt-20 max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            What We Offer
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Code />}
              title="Open Source Projects"
              description="Contribute to meaningful projects that impact the developer community and beyond."
            />
            <FeatureCard
              icon={<Users />}
              title="Vibrant Community"
              description="Connect with like-minded developers, learners, and tech enthusiasts from around the world."
            />
            <FeatureCard
              icon={<BookOpen />}
              title="Learning Resources"
              description="Access tutorials, guides, and educational content to enhance your technical skills."
            />
          </div>
        </div>

        {/* Founder Section */}
        <div className="mx-auto mt-20 max-w-4xl">
          <div className="overflow-hidden rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 p-1 dark:from-blue-900/40 dark:to-purple-900/40">
            <div className="rounded-lg bg-card p-8">
              <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
                <div className="overflow-hidden rounded-full bg-muted">
                  <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                    <Image
                      src={"/sinchan.png"}
                      alt="Sinchan Maitra"
                      width={190}
                      height={190}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-bold">
                    Sinchan Maitra (aka Abindent)
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Founder, OpenSourceCodes
                  </p>
                  <p>
                    A passionate high school student from Jalpaiguri, West
                    Bengal, India. Inspired by the ethos of open-source and the
                    guidance of various mentors, Sinchan embarked on this
                    journey to create a collaborative platform for developers
                    and learners alike.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mx-auto mt-20 max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">
            Ready to Join the Movement?
          </h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Become part of our growing community and help shape the future of
            open-source.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="https://discord.com/invite/n3q3HYMnkV"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="gap-2">
                Start Contributing
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <br />
    </>
  );
}
