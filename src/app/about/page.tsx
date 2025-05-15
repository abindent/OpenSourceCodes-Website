import AboutPage from "@/components/pages/about"
import { type Metadata } from "next"

export const metadata: Metadata = {
    title: "About OpenSourceGames - Free HTML, CSS & JavaScript Games",
    description:
        "A free source of opensourced projects for your enjoyment and creativity.",
};

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center w-full">
            <AboutPage />
        </div>
    )
}

