import { useState } from "react";
import { useLocation } from "react-router";
import { 
  HomeIcon, 
  InformationCircleIcon, 
  BriefcaseIcon, 
  PhoneIcon, 
  Bars3Icon, 
  XMarkIcon 
} from "@heroicons/react/24/outline";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"; // shadcn sheet
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/main/home", icon: <HomeIcon className="w-5 h-5" /> },
  { name: "About", path: "/about", icon: <InformationCircleIcon className="w-5 h-5" /> },
  { name: "Services", path: "/services", icon: <BriefcaseIcon className="w-5 h-5" /> },
  { name: "Contact", path: "/contact", icon: <PhoneIcon className="w-5 h-5" /> },
];

const Header = () => {
  const location = useLocation();

  const linkClass = (path) =>
    location.pathname === path
      ? "text-slate-600 border-b-2 border-slate-600 font-medium"
      : "text-gray-600 hover:text-slate-600";

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="text-lg font-semibold text-gray-800">Coupons</div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className={`flex items-center gap-1 transition-colors duration-200 pb-1 ${linkClass(link.path)}`}
              >
                {link.icon}
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">Menu</span>
                <Button variant="ghost" className="p-1">
                  <XMarkIcon className="w-6 h-6 text-gray-700" />
                </Button>
              </div>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    className={`flex items-center gap-2 transition-colors duration-200 ${linkClass(link.path)}`}
                  >
                    {link.icon}
                    {link.name}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
