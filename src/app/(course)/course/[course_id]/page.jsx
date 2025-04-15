"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReactPlayer from "react-player";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        .select("id")
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
    <div className="flex flex-col md:flex-row bg-white">
      {/* Chap tomon */}
      <div className="flex-1 border-r">
        <div className="flex items-center justify-between md:justify-start md:gap-3 p-3">
          <Link
            href={`/`}
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
                <div className="">
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
                </div>
              </TabsContent>
              <TabsContent value="ppt">
                {/* PPTs ko'rsatish */}
                <div className="">
                  {selectedTopic.ppts && selectedTopic.ppts.length > 0 ? (
                    selectedTopic.ppts.map((ppt, i) => (
                      <a
                        key={i}
                        href={ppt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 underline"
                      >
                        {ppt.name || `PPT ${i + 1}`}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500">PPT mavjud emas</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="test">
                {/* Test link */}
                {test ? (
                  <Link
                    href={`/test/${test.id}`}
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg m-4 "
                  >
                    Testni boshlash
                  </Link>
                ) : (
                  <p className="text-gray-500">Test mavjud emas</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* O'ng tomon: Mavzular listi */}
      <div className="w-full md:w-1/4">
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
            <button
              key={topic.id}
              className={`w-full text-left px-4 py-2 border-t cursor-pointer line-clamp-1 ${
                selectedTopic?.id === topic.id
                  ? "bg-green-400 text-white"
                  : "bg-white text-black hover:bg-muted"
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              <span className="font-bold mr-2">{topic.order}.</span>
              {topic.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePage;
