"use client";
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { createClient } from "@/utils/supabase/client";

import clsx from "clsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays, Eye } from "lucide-react";
import Image from "next/image";
import { useStudent } from "@/app/context/StudentContext";

const statusColors = {
  Yuborildi: "bg-blue-500",
  "Ko'rib chiqilmoqda": "bg-yellow-500",
  "Bekor qilindi": "bg-red-500",
  "Muvaffaqiyatli tugatildi": "bg-green-500",
};

const ApplicationPage = () => {
  const supabase = createClient();
  const { user, student, loading } = useStudent();

  const [applicationText, setApplicationText] = useState("");
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("arizalar")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Arizalarni olishda xatolik yuz berdi");
    } else {
      console.log(data);

      setApplications(data);
    }
  };

  const handleSubmit = async () => {
    if (!applicationText.trim()) {
      toast.error("Ariza matnini kiriting");
      return;
    }

    const newApplication = {
      student_id: user.id,
      student_application: applicationText,
      status: "Yuborildi",
      status_history: [
        {
          time: new Date().toISOString(),
          comment: "Ariza kelib tushdi",
          student: student.fio,
        },
      ],
      bajaruvchilar: [
        {
          id: 10,
          student: "Registrator Ofis",
        },
      ],
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("arizalar").insert([newApplication]);

    if (error) {
      toast.error("Arizani yuborishda xatolik yuz berdi");
      console.error(error);
    } else {
      toast.success("Ariza muvaffaqiyatli yuborildi");
      sendToTelegram(student?.fio, applicationText);
      setApplicationText("");
      fetchApplications();
    }
  };

  const sendToTelegram = async (studentName, applicationText) => {
    const token = "7849058559:AAE9exbdwx13H0XJ_0ePqUxGlJ7o4DSIDf8"; // O'zingizning bot tokeningizni qo'ying
    const chat_id = "-4691710080"; // O'zingizning guruh chat ID'ingizni qo'ying
    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    const message = `
📢 *Yangi ariza kelib tushdi!* 📝

👤 *Talaba:* ${studentName}
📄 *Ariza matni:* ${applicationText}
📅 *Vaqt:* ${new Date().toLocaleString()}

🔗 *Batafsil ko‘rish uchun tizimga kiring. learn.impulsmi.uz*
`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat_id,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (!response.ok) {
        throw new Error("Telegram API xatosi");
      }

      console.log("Telegramga xabar yuborildi!");
    } catch (error) {
      console.error("Telegram xabari yuborilmadi:", error);
    }
  };
  console.log(user);

  return (
    <div>
      <div className="md:max-w-[70%] gap-5 mx-auto p-4 grid md:grid-cols-2">
        <div>
          <h2 className="text-xl font-bold mb-4">Ariza Yuborish</h2>
          <Textarea
            placeholder="Ariza matnini kiriting..."
            value={applicationText}
            onChange={(e) => setApplicationText(e.target.value)}
            className="w-full mb-4 h-[20vh]"
          />
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Yuborilgan Arizalar</h2>
          <div className="mt-4 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">⏳ Yuklanmoqda...</p>
            ) : applications.length === 0 ? (
              <p className="text-center text-gray-500">❌ Arizalar topilmadi</p>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="border p-3 rounded-lg shadow-md flex items-center justify-between gap-2"
                >
                  <div className="flex items-start">
                    <div className="min-w-[50px] min-h-[50px] relative">
                      <Image
                        src={"/doc.png"}
                        fill
                        alt=""
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <div className="line-clamp-1 text-gray-800">
                        {app.student_application}
                      </div>
                      <p className="text-sm text-gray-600 flex gap-1 items-center mt-1">
                        <CalendarDays size={17} />
                        {new Date(app.created_at).toLocaleString()}
                      </p>{" "}
                    </div>
                  </div>
                  <br />
                  {/* Dialog Trigger */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-[40px] h-[40px] bg-[#2196f3] rounded-xl"
                        onClick={() => setSelectedApplication(app)}
                      >
                        <Eye />
                      </Button>
                    </DialogTrigger>

                    {/* Dialog Content */}
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="max-w-[500px] mx-auto text-2xl">
                          Ariza Tafsilotlari
                        </DialogTitle>
                      </DialogHeader>

                      {selectedApplication && (
                        <div className="space-y-4">
                          <div className="md:flex items-center justify-between">
                            <p className="text-sm text-gray-600 flex gap-1 items-center mt-1">
                              <CalendarDays size={17} />
                              {new Date(app.created_at).toLocaleString()}
                            </p>{" "}
                            <div
                              className={clsx(
                                "inline-block mt-2 text-white px-3 py-1 rounded-full text-sm",
                                statusColors[selectedApplication.status] ||
                                  "bg-gray-500"
                              )}
                            >
                              {selectedApplication.status}
                            </div>
                          </div>
                          <div className="mt-2 text-gray-800 text-left">
                            {selectedApplication.student_application}
                          </div>
                          <p className="mt-2"></p>
                          <div className="text-gray-800 text-left">
                            <strong>Ariza natijasi: </strong>
                            {selectedApplication.result_application}
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
