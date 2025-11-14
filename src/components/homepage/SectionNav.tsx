import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: {
    en: string;
    vi: string;
  };
  accent_color: string;
}

interface SectionNavProps {
  sections: Section[];
  activeSection: string;
}

export const SectionNav = ({ sections, activeSection }: SectionNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for header height
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:scale-110 transition-transform lg:hidden"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Navigation menu */}
      <nav
        className={cn(
          "fixed right-6 z-40 transition-all duration-300",
          "lg:top-32 lg:opacity-100",
          isOpen 
            ? "bottom-24 opacity-100 animate-fade-in" 
            : "bottom-24 opacity-0 pointer-events-none lg:pointer-events-auto lg:opacity-100"
        )}
      >
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl p-2 space-y-1 max-w-[200px]">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200",
                  "hover:scale-105 hover:shadow-sm",
                  isActive
                    ? "font-semibold shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                )}
                style={
                  isActive
                    ? {
                        backgroundColor: section.accent_color + '20',
                        color: section.accent_color,
                        borderLeft: `3px solid ${section.accent_color}`,
                      }
                    : {}
                }
              >
                <div className="line-clamp-2">{section.title.en}</div>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
