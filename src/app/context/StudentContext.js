"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  const [user, setUser] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStudent() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
            setUser(user)
          const { data: studentData, error } = await supabase
            .from("talabalar")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching student:", error);
          } else {
            setStudent(studentData);
          }
        }
      } catch (error) {
        console.error("Error in fetchStudent:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, []);


  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, course_id, banner_url, name")
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
    <StudentContext.Provider value={{ user, student, loading, courses }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  const context = useContext(StudentContext);
  if (context === undefined) {
    throw new Error("useStudent must be used within a StudentProvider");
  }
  return context;
}
