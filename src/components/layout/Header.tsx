import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Mail } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/portuguese', label: 'Português', color: 'text-portuguese' },
  { path: '/math', label: 'Matemática', color: 'text-math' },
  { path: '/english', label: 'English', color: 'text-english' },
  { path: '/geo', label: 'Geografia', color: 'text-geo' },
  { path: '/science', label: 'Ciência', color: 'text-science' },
  { path: '/arts', label: 'Artes', color: 'text-arts' },
  { path: '/contact', label: 'Contato', color: 'text-muted-foreground ' },
];
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="section-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/*  <Link to="/" className="flex items-center gap-2 hover:text-primary transition-colors">
            <span className="text-xl font-bold  text-gradient ">
              <img className="w-32 h-32" src='' />
            </span>
          </Link> */}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link 
                  ${location.pathname === link.path ? 'text-muted-foreground' : link.color}
                  ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="mailto:tisiqueiradev@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block py-2 ${location.pathname === link.path
                      ? 'text-primary'
                      : 'text-muted-foreground'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <a
                    href="mailto:dev@example.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};
