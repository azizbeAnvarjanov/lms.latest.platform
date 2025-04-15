"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  AlignJustify,
  BookOpenCheck,
  Paperclip,
  RefreshCcw,
  Video,
} from "lucide-react";
import { DialogTitle } from "./ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Image from "next/image";
export default function TopicsSheet({
  topics,
  selectedTopic,
  setSelectedTopic,
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline">
            <AlignJustify />
          </Button>
        </SheetTrigger>
        <DialogTitle className="hidden"></DialogTitle>
        <SheetContent side="right" className="overflow-y-scroll">
          <div className="flex items-center justify-between p-2">
            <strong className="text-lg">Mavzular</strong>
          </div>
          <div>
            <div className="">
              {topics.map((topic) => (
                <div
                  key={topic.id}
                  className={`w-full text-left px-4 py-2 border-t cursor-pointer line-clamp-1 overflow-hidden ${
                    selectedTopic?.id === topic.id
                      ? "bg-green-400 text-white"
                      : "text-black hover:bg-muted"
                  }`}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setOpen(false);
                  }}
                >
                  <p className="line-clamp-1">
                    {topic.order}. {topic.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
