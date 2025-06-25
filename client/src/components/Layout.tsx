import { Link } from "wouter";
import CopyUrlButton from "./CopyUrlButton";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link href="/">
            <a className="flex items-center gap-2">
              <img 
                src="/avo-friend.png" 
                alt="The Vegan Wiz Mascot" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-xl font-bold text-primary">The Wiz</span>
            </a>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <CopyUrlButton />
            <nav>
              <Link href="/admin">
                <a className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Admin
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}