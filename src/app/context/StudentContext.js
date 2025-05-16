"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const StudentContext = createContext(null);

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStudent() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setUser(user);
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

  return (
    <StudentContext.Provider value={{ user, student, loading }}>
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
