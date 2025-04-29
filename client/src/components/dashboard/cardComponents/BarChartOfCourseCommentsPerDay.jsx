"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import DropdownMenuOfBarChart from "./DropdownMenuOfBarChart";
import { useEffect, useState } from "react";
import MonthPicker from "./MonthPicker";
import axios from "../../../api/axios.js";
import { formatDateTo_YYYY_MM_01, randomDataMaker } from "@/util/dashboardUtils";
import monthMapper from "@/non-changeable-data/englishToArabicMonths";

export default function BarChartOfCourseCommentsPerDay({ className }) {
  const [selectedMonth, setSelectedMonth] = useState({
    month: new Date().getMonth(),
    monthName: "Jan",
    year: new Date().getFullYear(),
  });
  const [coursesList, setCoursesList] = useState([
    {
      id: 89,
      name: "اتصالات وشبكات الحاسب - Computer Communications and Networks ",
      code: "CEN303",
      overview:
        "يُركز هذا المقرر على أساسيات الاتصالات والشبكات الحاسوبية، ويتناول أنظمة الشبكات، البروتوكولات، تقنيات الاتصال المختلفة، وتطبيقاتها في مجال تكنولوجيا المعلومات.",
      creditHours: 3,
      creatorId: 1,
      avgRating: "0",
      avgGrade: "0",
      numOfRaters: "0",
    },
  ]);
  const [selectedCourseId, setSelectedCourseId] = useState(coursesList[0].id);
  const [chartData, setChartData] = useState([{ day: 1, desktop: 13, mobile: 9 }]);

  const chartConfig = {
    desktop: {
      label: selectedMonth.monthName,
      color: "hsl(var(--chart-1))",
    },
  };

  useEffect(() => {
    getCoursesList(setCoursesList);
  }, []);
  useEffect(() => {
    getTheCommentsCountForTheMonthDays(
      selectedCourseId,
      formatDateTo_YYYY_MM_01(selectedMonth),
      setChartData
    );
  }, [selectedMonth, selectedCourseId]);

  return (
    <Card className={`rounded-2xl ${className}`}>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle className="text-blue-900">
            التعليقات على المقرر لشهر {monthMapper[selectedMonth.month - 1]}
          </CardTitle>
          <div className="flex ">
            <DropdownMenuOfBarChart {...{ coursesList, selectedCourseId, setSelectedCourseId }} />
            <MonthPicker {...{ secondMonth: selectedMonth, setSecondMonth: setSelectedMonth }} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="aspect-auto h-[250px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              reversed
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={90}>
              {/* <LabelList position="top" offset={4} className="fill-foreground" fontSize={12} /> */}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );

  async function getCoursesList(setCoursesList) {
    try {
      let result = await axios.get("auth/courses");
      console.log("result.data.courses :>> ", result.data.courses);
      setCoursesList(result.data.courses);
    } catch (error) {
      console.error(error);
    }
  }
  async function getTheCommentsCountForTheMonthDays(selectedCourseId, selectedMonth, setChartData) {
    const makeItRandom = true;
    // I put them currentMonth, secondMonth as params to make any next change easier
    try {
      const twoMonthsData = await axios.get("admin/dashboard/getCourseCommentsPerDay", {
        params: {
          selectedCourseId,
          selectedMonth,
        },
      });

      if (makeItRandom) {
        randomDataMaker(twoMonthsData.data.theCommentsCountForTheMonthDays);
      }
      setChartData(twoMonthsData.data.theCommentsCountForTheMonthDays);
    } catch (error) {
      console.error(error);
    }
  }
}
