"use client";

import { useStudent } from "@/app/context/StudentContext";
import getInitials from "@/app/hooks/getInitials";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfilePage = () => {
  const { user, student, loading } = useStudent();
  if (loading) return <Skeleton className="h-16 border-b"></Skeleton>;
  if (!student) return <div>No student data</div>;
  const av = getInitials(student?.fio);

  return (
    <div className="w-full max-w-xl mx-auto md:px-4">
      <div className="w-24 h-24 text-2xl font-medium mx-auto my-3 border-2 rounded-full bg-muted grid place-content-center">
        <p>{av}</p>
      </div>
      <h1 className="text-center font-medium text-lg sm:text-xl">
        {student.fio}
      </h1>
      <h1 className="text-center text-[#909090] text-sm sm:text-base">
        {user.email}
      </h1>
      <br />
      <div className="space-y-2">
        <div className="border-t flex items-center justify-between p-2 text-sm sm:text-base">
          <p className="font-medium">Auth ID:</p>
          <p className="text-right break-all">{user.id}</p>
        </div>
        <div className="border-t flex items-center justify-between p-2 text-sm sm:text-base">
          <p className="font-medium">Email pochta:</p>
          <p className="text-right break-all">{user.email}</p>
        </div>
        <div className="border-t flex items-center justify-between p-2 text-sm sm:text-base">
          <p className="font-medium">Talaba ID:</p>
          <p>{student.talaba_id}</p>
        </div>
        <div className="border-t flex items-center justify-between p-2 text-sm sm:text-base">
          <p className="font-medium">Pasport seria raqam:</p>
          <p>{student.seria}</p>
        </div>
        <div className="border-t flex items-center justify-between p-2 text-sm sm:text-base">
          <p className="font-medium">Kurs:</p>
          <p>{student.kurs}</p>
        </div>
        <div className="border-y flex items-center justify-between p-2 text-sm sm:text-base">
          <p className="font-medium">Guruh:</p>
          <p>{student.guruh}</p>
        </div>
      </div>
      <br />
    </div>
  );
};

export default ProfilePage;
