import { useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router";
import UserContext from "../Utility/UserContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // shadcn sheet
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  PhoneIcon,
  Bars3Icon,
  UserCircleIcon,
  ArrowLeftStartOnRectangleIcon,
  BanknotesIcon,
  TagIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", path: "/main/home", icon: <HomeIcon className="w-5 h-5" /> },
  {
    name: "About",
    path: "/main/about",
    icon: <InformationCircleIcon className="w-5 h-5" />,
  },
  {
    name: "Services",
    path: "/services",
    icon: <BriefcaseIcon className="w-5 h-5" />,
  },
  {
    name: "Contact",
    path: "/contact",
    icon: <PhoneIcon className="w-5 h-5" />,
  },
];

const Header = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  console.log("User in Header:", user);
  const linkClass = (path) =>
    location.pathname === path
      ? "text-slate-600 border-b-2 border-slate-600 font-medium"
      : "text-gray-600 hover:text-slate-600";

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-lg font-semibold text-gray-600 flex items-center gap-2">
            <TagIcon className="h-8 w-8" />
            Kup-ons
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 transition-colors duration-200 ${linkClass(
                  link.path
                )}`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {user?.user ? `Welcome, ${user.user.name}` : "Login"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      navigate(user?.user == null ? "/login" : "/main/profile")
                    }
                  >
                    <UserCircleIcon className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <BanknotesIcon className="w-4 h-4 mr-2" />
                    Billing
                  </DropdownMenuItem>

                  <DropdownMenuItem>
                    <SunIcon className="w-4 h-4 mr-2" />
                    Light Mode
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <ArrowLeftStartOnRectangleIcon className="w-4 h-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden p-2">
                <Bars3Icon className="w-6 h-6 text-gray-700" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800"></span>
              </div>
              <nav className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-2 transition-colors duration-200 ${linkClass(
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
                      {user?.user ? `Welcome, ${user.user.name}` : "Login"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() =>
                          navigate(
                            user?.user == null ? "/login" : "/main/profile"
                          )
                        }
                      >
                        <UserCircleIcon className="w-4 h-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BanknotesIcon className="w-4 h-4 mr-2" />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MoonIcon className="w-4 h-4 mr-2" />
                        Light Mode
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <ArrowLeftStartOnRectangleIcon className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
