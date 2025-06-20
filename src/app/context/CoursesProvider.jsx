"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const CoursesContext = createContext(null);

export function CoursesProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses_duplicate")
        .select("id, course_id, banner_url, name")
        .eq("status", "TRUE")
        .order("created_at", { ascending: true });

      if (!error) {
        setCourses(data);
      } else {
        console.error("Error fetching courses:", error.message);
      }

      setLoading(false);
    };

    fetchCourses();
  }, []);

  return (
    <CoursesContext.Provider value={{ loading, courses }}>
      {children}
    </CoursesContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CoursesContext);
  if (context === undefined) {
    throw new Error("useCourses must be used within a StudentProvider");
  }
  return context;
}
