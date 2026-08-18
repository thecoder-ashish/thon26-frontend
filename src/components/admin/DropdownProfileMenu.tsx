"use client";


import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/auth"

import {

  LogOut,

  Plus,
  Trash,
  Users,
} from "lucide-react"
// import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu";
// type Checked = DropdownMenuCheckboxItemProps["checked"];

export function DropdownProfileMenu() {
 // Destructure the logout function from the useAuth hook
 const { logout } = useAuth();
 const navigate = useNavigate();

 return (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" className="font-raleway font-bold tracking-wide">DASHBOARD</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
    <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Crosslinks NSUT</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

      <DropdownMenuItem onSelect={() => navigate('/admin/dashboard?tab=1')}>
        <Users className="mr-2 h-4 w-4" />
        <span>Users List</span>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => navigate('/admin/dashboard?tab=2')}>
        <Plus className="mr-2 h-4 w-4" />
        <span>New Event</span>
      </DropdownMenuItem>
      <DropdownMenuItem onSelect={() => navigate('/admin/dashboard?tab=3')}>
        <Trash className="mr-2 h-4 w-4" />
        <span>Manage Events</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600" onSelect={logout}>
        <LogOut className="mr-2 h-4 w-4" />
        <span className="">Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);
}