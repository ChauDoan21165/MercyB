import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function MeaningOfLife() {
  useEffect(() => {
    document.title = "Meaning of Life – Room Selector";
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
      <section className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Meaning of Life</h1>
          <p className="text-muted-foreground mt-1">Choose a tier to open the chat room.</p>
        </header>
        <Card className="p-4 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="default">
            <Link to="/chat/meaning-of-life-free">Open Free</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/chat/meaning-of-life-vip1">Open VIP1</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/chat/meaning-of-life-vip2">Open VIP2</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/chat/meaning-of-life-vip3">Open VIP3</Link>
          </Button>
        </Card>
      </section>
    </main>
  );
}
