import {
  BoltIcon,
  BookOpenIcon,
  ChevronDownIcon,
  FileText,
  GraduationCap,
  Layers2Icon,
  LayoutDashboard,
  LogOutIcon,
  PinIcon,
  UserPenIcon,
  UserRoundCog,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { logout } from "@/app/(login)/login/actions";
import Link from "next/link";

import getInitials from "@/app/hooks/getInitials";

export default function AvatarNavbar({ user, student }) {
  const av = getInitials(student.fio);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="flex items-center justify-center bg-muted border-2 text-sm">
            <div className="">{av}</div>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-96">
        <DropdownMenuLabel className="flex min-w-0 flex-col bg-muted text-center rounded-sm pointer-events-none">
          <div className="bg-white border-2 w-[50px] h-[50px] rounded-full grid place-content-center text-xl mx-auto my-4">
            {/* {av} */}
            <GraduationCap />
          </div>
          <span className="text-foreground truncate text-sm font-medium">
            {student.fio}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center">
              <UserRoundCog
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Mening profilim</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/" className="flex items-center">
              <LayoutDashboard
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Asosiy sahifa</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/courses" className="flex items-center">
              <BookOpenIcon
                size={16}
                className="opacity-60"
                aria-hidden="true"
              />
              <span>Fan baza</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/applications" className="flex items-center">
              <FileText size={16} className="opacity-60" aria-hidden="true" />
              <span>Ariza topshirish</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Tizimdan chiqish</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
