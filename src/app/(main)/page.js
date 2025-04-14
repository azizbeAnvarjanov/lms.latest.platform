"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useStudent } from "../context/StudentContext";

import TestNotification from "@/components/TestNotification";

export default function PrivatePage() {
  const { user, student, loading } = useStudent();

  if (loading) return <Skeleton className="h-16 border-b"></Skeleton>;
  if (!student) return <div>No student data</div>;

  return (
    <p>
      Hello {student.fio} <TestNotification />
    </p>
  );
}
