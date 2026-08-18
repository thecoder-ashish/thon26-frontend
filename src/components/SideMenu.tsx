import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DropdownProfileMenu } from "@/components/admin/DropdownProfileMenu";
import { useAuth } from "@/components/auth/auth";

import {
  Sheet,
  SheetClose,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  // SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function SideMenu() {
  // render navbar only when user logged in details are fetched
  const { user, loading } = useAuth();
  if (loading) {
    return null; // or return a loading indicator, or keep your UI consistent while waiting.
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="sm:hidden" />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          {/* <SheetTitle>Menu</SheetTitle> */}
          {/* <SheetDescription>
            Navigate through the application.
          </SheetDescription> */}
        </SheetHeader>
        <div className="grid gap-4 mt-6 py-4">
          <SheetClose asChild>
            <Link to="/">
              <Button variant="outline" className="w-full font-raleway font-bold tracking-wide" type="button">
                HOME
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/leaderboard">
              <Button variant="outline" className="w-full font-raleway font-bold tracking-wide" type="button">
                LEADERBOARD
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/events">
              <Button variant="outline" className="w-full font-raleway font-bold tracking-wide" type="button">
                EVENTS
              </Button>
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/register">
              <Button variant="outline" className="w-full font-raleway font-bold tracking-wide" type="button">
                REGISTER
              </Button>
            </Link>
          </SheetClose>
          {user && (

          <SheetClose asChild>
            <DropdownProfileMenu />
          </SheetClose>
                  )}

        </div>

        <div className="flex justify-center mt-4">
          <ModeToggle />
        </div>
      </SheetContent>
    </Sheet>
  );
}
