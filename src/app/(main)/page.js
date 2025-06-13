"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useStudent } from "../context/StudentContext";
import { CoursesProvider } from "../context/CoursesProvider";
import CoursesPageComponent from "@/components/CoursesPageComponent";

export default function PrivatePage() {
  const { user, student, loading } = useStudent();

  if (loading) return <Skeleton className="h-16 border-b"></Skeleton>;
  if (!student) return <div>No student data</div>;

  return (
    <CoursesProvider>
      <CoursesPageComponent />
    </CoursesProvider>
  );
}
