"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft, TimerReset } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DocViewerPage from "@/components/DocViewerPage";
import PptViewerTabs from "@/components/PptViewer";

const CoursePage = () => {
  const { course_id } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [test, setTest] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select(
          "id, name, banner_url, topics (id, name, description, video_link, topic_id, ppts, notes, order)"
        )
        .eq("course_id", course_id)
        .single();

      if (error) {
        console.error("Kursni olishda xatolik:", error);
      } else {
        // Order bo'yicha sort
        const sortedTopics = [...(data.topics || [])].sort(
          (a, b) => a.order - b.order
        );
        setCourse({ ...data, topics: sortedTopics });
        if (sortedTopics.length > 0) {
          setSelectedTopic(sortedTopics[0]);
        }
      }
      setLoading(false);
    };

    fetchCourse();
  }, [course_id]);

  useEffect(() => {
    const fetchTest = async () => {
      if (!selectedTopic) return;
      const { data, error } = await supabase
        .from("tests")
        .select("id, name")
        .eq("topic_id", selectedTopic.topic_id)
        .single();

      if (error) {
        setTest(null);
      } else {
        setTest(data);
      }
    };

    fetchTest();
  }, [selectedTopic]);

  if (loading) return <div>Yuklanmoqda...</div>;
  if (!course) return <div>Kurs topilmadi</div>;

  const filteredTopics = course.topics.filter((topic) =>
    topic.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="player-thumb flex flex-col md:flex-row bg-white overflow-y-scroll scrollbar-hide max-h-screen">
      {/* Chap tomon */}
      <div className="flex-1 border-r md:w-[75%] overflow-y-scroll scrollbar-hide max-h-screen">
        <div className="flex items-center justify-between md:justify-start md:gap-3 p-3">
          <Link
            href={`/courses`}
            className="bg-white border flex items-center justify-center hover:bg-muted w-[40px] h-[40px] rounded-xl"
          >
            <ChevronLeft />
          </Link>
          <h1 className="font-bold text-[15px] md:text-2xl">{course?.name}</h1>
        </div>

        {selectedTopic && (
          <div className="space-y-4">
            {selectedTopic.video_link && (
              <div className="aspect-video">
                <ReactPlayer
                  url={selectedTopic.video_link}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            )}

            <div className="px-3">
              <h1 className="pl-3 pb-2 md:text-2xl">
                Mavzu: <strong>{selectedTopic?.name}</strong>
              </h1>
              <div className="border bg-muted p-5 rounded-lg">
                <h1 className="font-bold">Mavzu tafsivi</h1>
                {selectedTopic?.description}{" "}
              </div>
            </div>

            <Tabs defaultValue="pdf" className="w-[98%] mx-auto">
              <TabsList>
                <TabsTrigger value="pdf">Note</TabsTrigger>
                <TabsTrigger value="ppt">Prizentatsiya</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>
              <TabsContent value="pdf">
                <div className="min-h-screen">
                  {selectedTopic.notes && selectedTopic.notes.length > 0 ? (
                    selectedTopic.notes.map((note, i) => (
                      <Link
                        key={i}
                        href={note.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline"
                      >
                        {note.name || `Note ${i + 1}`}
                      </Link>
                    ))
                  ) : (
                    <p className="text-gray-500">Note mavjud emas</p>
                  )}
                  {selectedTopic.notes && selectedTopic.notes.length > 0 ? (
                    <DocViewerPage docsarr={selectedTopic?.notes} />
                  ) : (
                    <p className="text-gray-500">Note mavjud emas</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="ppt">
                {/* PPTs ko'rsatish */}
                <div className="">
                  {selectedTopic.ppts && selectedTopic.ppts.length > 0 ? (
                    <PptViewerTabs notes={selectedTopic?.ppts} />
                  ) : (
                    <p className="text-gray-500">PPT mavjud emas</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="test">
                {/* Test link */}
                <div className="min-h-screen">
                  {test ? (
                    <div className="p-4 rounded-lg border w-full flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TimerReset size={35} />
                        <p>{test.name}</p>
                      </div>
                      <Link
                        href={`/course/${course_id}/${test.id}`}
                        className="bg-blue-400 py-1 px-4 rounded-full text-white"
                      >
                        Testni boshlash
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-500">Test mavjud emas</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* O'ng tomon: Mavzular listi */}
      <div className="w-full md:w-[25%] border-l overflow-y-scroll scrollbar-hide max-h-screen">
        <div className="p-2">
          <Input
            type="text"
            placeholder="Mavzu nomi bo'yicha qidirish"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2.5 border rounded-lg"
          />
        </div>
        <div className="">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className={`w-full text-left px-4 py-2 border-t cursor-pointer line-clamp-1 overflow-hidden ${
                selectedTopic?.id === topic.id
                  ? "bg-green-400 text-white"
                  : "text-black hover:bg-muted"
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              <p className="line-clamp-1">
                {topic.order}. {topic.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
