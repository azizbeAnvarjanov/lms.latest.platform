import { CoursesProvider } from "@/app/context/CoursesProvider";
import CoursesPageComponent from "@/components/CoursesPageComponent";
const AllCourses = () => {
  return (
    <CoursesProvider>
      <CoursesPageComponent />
    </CoursesProvider>
  );
};

export default AllCourses;
