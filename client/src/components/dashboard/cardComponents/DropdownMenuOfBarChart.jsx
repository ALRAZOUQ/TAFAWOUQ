"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CodeSquare, LandPlot, Shapes } from "lucide-react";

export default function DropdownMenuOfBarChart({ selectedCourseId, setSelectedCourseId, coursesList }) {
  //   console.log("{ selectedCourseId, setSelectedCourseId, coursesList } :>> ", {
  //     selectedCourseId,
  //     setSelectedCourseId,
  //     coursesList,
  //   });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Shapes className="m-3 text-blue-950" strokeWidth={1.75} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-full ">
        <DropdownMenuLabel className="text-center pr-2">حدد مقررًا</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={selectedCourseId} onValueChange={setSelectedCourseId}>
          {coursesList.map((course) => (
            <DropdownMenuRadioItem key={course.id} value={course.id}>
              {course.code}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
