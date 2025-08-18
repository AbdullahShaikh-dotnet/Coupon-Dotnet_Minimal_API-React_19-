import { useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import UserContext from "../Utility/UserContext";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Home,
  Info,
  Briefcase,
  Phone,
  Menu,
  User,
  LogOut,
  CreditCard,
  Tag,
  Sun,
  Moon,
} from "lucide-react";

const navLinks = [
  { name: "Home", path: "/main/home", icon: <Home className="w-5 h-5" /> },
  { name: "About", path: "/main/about", icon: <Info className="w-5 h-5" /> },
  {
    name: "Services",
    path: "/services",
    icon: <Briefcase className="w-5 h-5" />,
  },
  { name: "Contact", path: "/contact", icon: <Phone className="w-5 h-5" /> },
];

const Header = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const linkClass = (path) =>
    location.pathname === path
      ? "text-slate-600 border-b-2 border-slate-500 font-medium rounded-md bg-slate-100"
      : "text-gray-600 hover:text-slate-600";

  return (
    <header className="bg-white border-b fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
          <div className="p-2 bg-slate-100 rounded-xl">
            <Tag className="h-6 w-6 text-slate-600" />
          </div>
          Kup-ons
        </div>

        {/* Desktop Nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.path}>
                <NavigationMenuLink asChild>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 ${linkClass(
                      link.path
                    )}`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* User Dropdown */}
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {user?.user ? `${user.user.name}` : "Login"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() =>
                    navigate(user?.user == null ? "/login" : "/main/profile")
                  }
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Sun className="w-4 h-4 mr-2" />
                  Light Mode
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden p-2">
              <Menu className="w-6 h-6 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
              {user?.user ? `${user.user.name}` : "Login"}
            </div>

            <nav className="flex flex-col gap-4 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-2 py-1 ${linkClass(
                    link.path
                  )}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          user?.user == null ? "/login" : "/main/profile"
                        )
                      }
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Billing
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Moon className="w-4 h-4 mr-2" />
                      Dark Mode
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
