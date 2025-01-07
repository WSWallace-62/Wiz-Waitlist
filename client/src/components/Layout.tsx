import { Link } from "wouter";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold text-primary">Veganize-iT</a>
          </Link>
          <nav>
            <Link href="/admin">
              <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Admin Dashboard
              </a>
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
