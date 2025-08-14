import { Button } from "@/components/ui/button";
import { Calendar, Heart, Menu, User } from "lucide-react";
import { useState } from "react";
import Auth from "@/pages/Auth"; // ton composant de connexion

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthOpen(true);
  };

  return (
    <>
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50 medical-shadow">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-foreground hover:text-primary transition-colors">
                Nos services
              </a>
              <a href="#doctors" className="text-foreground hover:text-primary transition-colors">
                Médecins
              </a>
              <a href="#about" className="text-foreground hover:text-primary transition-colors">
                À propos
              </a>
              <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <Button
                variant="ghost"
                className="text-foreground hover:text-primary"
                onClick={handleLoginClick}
              >
                <User className="w-4 h-4 mr-2" />
                Connexion
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <nav className="flex flex-col space-y-4">
                <a href="#services" className="text-foreground hover:text-primary transition-colors">
                  Nos services
                </a>
                <a href="#doctors" className="text-foreground hover:text-primary transition-colors">
                  Médecins
                </a>
                <a href="#about" className="text-foreground hover:text-primary transition-colors">
                  À propos
                </a>
                <a href="#contact" className="text-foreground hover:text-primary transition-colors">
                  Contact
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="justify-start text-foreground hover:text-primary"
                    onClick={handleLoginClick}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Connexion
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Modal de connexion */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative">
            <Auth onClose={() => setIsAuthOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};
