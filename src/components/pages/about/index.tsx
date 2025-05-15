"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Github, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Define values
const values = [
  {
    title: "Open Collaboration",
    description:
      "We believe in the power of community-driven development where everyone's contribution matters.",
    icon: <Users className="h-6 w-6" />,
  },
  {
    title: "Accessible Learning",
    description:
      "Making technology learning resources available to everyone regardless of background.",
    icon: <Code className="h-6 w-6" />,
  },
  {
    title: "Innovation",
    description:
      "Pushing boundaries and exploring new possibilities through creative problem-solving.",
    icon: <Globe className="h-6 w-6" />,
  },
];

// Define projects
const projects = [
  {
    title: "Python Utility Bot",
    description:
      "A simple template for building a beautiful discord bot with discord.py. Here I have also implemented the buttons, discord modals and select menus along with slash commands. This project is under progress so you have to wait for some time to get your wanted features.",
    tags: ["python", "discord", "bot", "utility"],
    href: "https://github.com/abindent/Python-Utility-Bot",
    status: "Active",
  },
  {
    title: "Text Analyser",
    description:
      "Interactive platform for learning operating system concepts with visual simulations and exercises.",
    tags: ["text styling", "text analysis", "React"],
    href: "https://textanalyserosc.netlify.app",
    status: "Active",
  },
  {
    title: "ONotes",
    description:
      "At Onotes, we believe that ideas flow better when barriers are removed. Our mission is to create a seamless note-taking experience that empowers teams to collaborate effectively, regardless of the content format.",
    tags: ["react", "typescript", "web app", "notes", "collaboration", "team"],
    href: "https://github.com/abindent/ONotebook",
    status: "In Development",
  },
  {
    title: "JagaranNewsApp",
    description:
      "garanNews provides you daily news bites in your laptop. It is made using React.",
    tags: ["javascript", "react", "news"],
    href: "https://github.com/abindent/JagaranNewsApp",
    status: "Active",
  },
];

const About = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen w-full py-12 px-4 md:px-6 lg:px-8 bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="inline-block rounded-full bg-primary/10 p-2 mb-4">
            <Code className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            About <span className="text-primary">OpenSourceCodes</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A vibrant initiative led by students for students, creating a
            collaborative platform where developers, learners, and tech
            enthusiasts build the future together.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
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
            <Link
              href="https://github.com/abindent"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="h-4 w-4" />
                Explore Projects
              </Button>
            </Link>
          </div>
        </section>

        {/* Our Story */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Our Story</h2>
            <p className="text-muted-foreground">How it all began</p>
          </div>
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 space-y-4">
              <p className="text-lg">
                OpenSourceCodes was born from the passion of Sinchan Maitra, a
                high school student from Jalpaiguri, West Bengal, India.
                Inspired by the open-source community and guided by mentors,
                Sinchan envisioned a platform where technology is democratized
                and accessible to all.
              </p>
              <p className="text-lg">
                What started as a personal project quickly evolved into a
                community-driven initiative. Today, OpenSourceCodes stands as a
                testament to the belief that when knowledge is shared,
                innovation thrives.
              </p>
              <Badge variant="outline" className="text-sm mt-2">
                Founded in 2021
              </Badge>
            </div>
            <div className="md:col-span-2">
              <div className="aspect-square rounded-lg bg-muted/30 flex items-center justify-center overflow-hidden">
                <div className="relative w-full h-full">
                  <div className="rounded-lg flex items-center justify-center">
                    <Image alt="_work_" width={320} height={320} src={"/work-culture.png"} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Our Mission */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-muted-foreground">What drives us forward</p>
          </div>
          <div className="border border-border rounded-lg p-6 bg-card">
            <p className="text-xl font-medium text-center italic">
              "To democratize technology by providing accessible, open-source
              tools and resources that empower individuals to enhance their
              skills and contribute to meaningful projects. We aim to build a
              community where knowledge flows freely, innovation is encouraged,
              and everyone has the opportunity to grow as developers."
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center text-primary mb-4">
                    {value.icon}
                  </div>
                  <CardTitle>{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Our Projects</h2>
            <p className="text-muted-foreground">
              Building tools that make a difference
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <Badge
                      variant={
                        project.status === "Active" ? "default" : "outline"
                      }
                    >
                      {project.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="w-full">
                      <Github className="mr-2 h-4 w-4" />
                      View Project
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="https://github.com/abindent"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="link" className="text-primary">
                View All Projects
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Join Us CTA */}
        <section className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Join Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're a seasoned developer or just starting your journey,
              there's a place for you at OpenSourceCodes. Join us in building a
              more accessible and innovative tech ecosystem.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
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
        </section>
      </div>
    </div>
  );
};

export default About;
