"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useStudent } from "@/app/context/StudentContext";

const AllCourses = () => {
  const [search, setSearch] = useState("");
  const { user, student, loading, courses } = useStudent();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-medium">All courses</h1>
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[500px] bg-white"
        />
      </div>

      {loading ? (
        <p>Loading courses...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {courses
            .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
            .map((course) => (
              <Link
                href={`/course/${course.course_id}`}
                key={course.id}
                className="rounded-xl border overflow-hidden shadow-md bg-white max-w-sm"
              >
                <div className="w-full h-48 overflow-hidden relative border-b border-gray-300">
                  <img
                    src={course.banner_url || "/placeholder.jpg"}
                    alt={course.name}
                    className="rounded-t-xl object-contain w-full h-full"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <div className="font-medium">{course.name}</div>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
