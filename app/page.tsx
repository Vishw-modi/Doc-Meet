import Header from "@/components/Header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="pt-16">
        <h1>Home</h1>
        <Button>Button</Button>
      </div>
    </div>
  );
}
