import Games from "@/components/pages/games";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Games",
  description: "Explore our collection of web-based games built with HTML, CSS, and JavaScript.",
};

export default function GamesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Games />
    </div>
  );
}