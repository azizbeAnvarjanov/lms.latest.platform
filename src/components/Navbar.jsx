"use client";

import { logout } from "@/app/(login)/login/actions";
import { useStudent } from "@/app/context/StudentContext";
import AvatarNavbar from "./AvatarNavbar";
import { Skeleton } from "./ui/skeleton";

export default function Navbar() {
  const { user, student, loading } = useStudent();

  if (loading) return <Skeleton className="h-16 border-b"></Skeleton>;
  if (!student) return <div>No student data</div>;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">ClinikApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            <AvatarNavbar user={user} student={student} />
          </div>
        </div>
      </div>
    </nav>
  );
}
