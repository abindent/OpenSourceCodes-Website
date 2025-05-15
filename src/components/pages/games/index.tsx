"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Gamepad2 } from "lucide-react";

interface GameMenuItemData {
  label: string;
  href: string;
  description: string;
}

export default function GamesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const gamesMenu: GameMenuItemData[] = [
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
        "Tic-tac-toe, noughts and crosses, or Xs and Os is a paper-and-pencil game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner. But here you can play it with your freinds as it is a two player game.",
    },
    {
      label: "Rock Paper Scissor",
      href: "/games/rps/index.html",
      description:
        'Rock Paper Scissors (also known by other orderings of the three items, with "rock" sometimes being called "stone", or as Rochambeau, roshambo, or ro-sham-bo) is a hand game, usually played between two people, in which each player simultaneously forms one of three shapes with an outstretched hand. These shapes are "rock" (a closed fist), "paper" (a flat hand), and "scissors" (a fist with the index finger and middle finger extended, forming a V). "Scissors" is identical to the two-fingered V sign (also indicating "victory" or "peace") except that it is pointed horizontally instead of being held upright in the air. This is an online version of this most popular game.',
    }
  ];

  // Filter games based on search query
  const filteredGames = gamesMenu.filter(game => 
    game.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 size={36} className="text-primary" />
          <h1 className="text-4xl font-bold">Browse Games</h1>
        </div>
        <p className="text-muted-foreground text-center max-w-2xl">
          Explore our collection of web-based games built with HTML, CSS, and JavaScript.
          Each game offers a unique experience with simple controls and engaging gameplay.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md mx-auto mb-12">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search games..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredGames.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No games found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredGames.map((game, index) => (
            <Card key={index} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-2xl">{game.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CardDescription className="text-sm text-muted-foreground line-clamp-4 mb-4">
                  {game.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-end bg-muted/20 p-4">
                <Button asChild>
                  <a href={game.href}>Play Now</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}