import Contact from "@/components/pages/contact";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact us for more information.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <Contact />
    </div>
  );
}