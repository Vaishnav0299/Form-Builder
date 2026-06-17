import { Outlet } from "react-router-dom";
import Header from "src/components/Header";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}