export default function Header() {
  return (
    <header className="w-full border-b border-border bg-background text-foreground px-4 py-3 flex items-center justify-between">
      <div className="font-semibold text-lg">
        Form Builder
      </div>

      <nav className="flex gap-4 text-sm text-muted-foreground">
        <a href="/dashboard" className="hover:text-foreground">
          Dashboard
        </a>
        <a href="/templates" className="hover:text-foreground">
          Templates
        </a>
      </nav>
    </header>
  );
}