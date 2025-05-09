"use client";

import { useState, useEffect } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import MonthPicker from "./MonthPicker";
import monthMapper from "../../../non-changeable-data/englishToArabicMonths.js";
import {
  formatDateTo_YYYY_MM_01,
  randomDataMaker,
} from "../../../util/dashboardUtils.js";
import axios from "../../../api/axios";

export default function TwoMonthsComparison({ className }) {
  const [chartData, setChartData] = useState([
    { date: "2020-04-01", desktop: 5, mobile: 5 },
    { date: "2020-05-01", desktop: 5, mobile: 5 },
  ]);
  const [currentMonth, setCurrentMonth] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [currentAlreadySet, setCurrentAlreadySet] = useState(false);

  const [secondMonth, setSecondMonth] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    desktop: {
      label: "الشهر الحالي",
      color: "hsl(var(--chart-1))",
    },
    mobile: {
      label: monthMapper[secondMonth.month - 1],
      color: "hsl(var(--chart-2))",
    },
  };
  // console.log("Array.from(chartData) :>> ", Array.from(chartData));

  useEffect(() => {
    if (
      new Date(formatDateTo_YYYY_MM_01(secondMonth)) <
      new Date(formatDateTo_YYYY_MM_01(currentMonth))
    ) {
      console.log("secondMonth :>> ", formatDateTo_YYYY_MM_01(secondMonth));
      getTwoMonthsComparison(
        formatDateTo_YYYY_MM_01(currentMonth),
        formatDateTo_YYYY_MM_01(secondMonth),
        currentAlreadySet,
        setCurrentAlreadySet
      );
    }
  }, [secondMonth]);

  return (
    <div dir="rtl" className="rounded-lg">
      <Card className={`rounded-2xl ${className}`}>
        <CardHeader className="flex items-stretch gap-2 space-y-0 border-b py-5 sm:flex-row">
          <div className=" flex justify-between items-center w-full text-center sm:text-right">
            <CardTitle className="text-blue-900" align={"start"}>
              عدد التعليقات للشهر الحالي وشهر{" "}
              {monthMapper[secondMonth.month - 1]}
            </CardTitle>
            <MonthPicker {...{ secondMonth, setSecondMonth }} />
          </div>
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select> */}
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[380px] w-full"
          >
            <AreaChart data={Array.from(chartData)}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                type="category"
                interval={0}
                reversed={true}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  return value;
                  const date = new Date(
                    `${secondMonth.year}-${secondMonth.month}`
                  );
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return monthMapper[secondMonth.month - 1];
                      return new Date(
                        `${secondMonth.year}-${secondMonth.month}`
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
              />
              <Area
                dataKey="desktop"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
  async function getTwoMonthsComparison(
    currentMonth,
    secondMonth,
    currentAlreadySet,
    setCurrentAlreadySet
  ) {
    const makeItRandom = true;
    // I put them currentMonth, secondMonth as params to make any next change easier
    try {
      const twoMonthsData = await axios.get(
        "admin/dashboard/getTwoMonthsComparison",
        {
          params: {
            currentMonth,
            secondMonth,
          },
        }
      );

      if (makeItRandom) {
        randomDataMaker(twoMonthsData.data.chartData);
      }
      twoMonthsData.data.chartData=twoMonthsData.data.chartData.map(day=>{day.date+=1
        return day
      })
      setChartData((prev) => {
        
        if (currentAlreadySet) {
          twoMonthsData.data.chartData.map((day, i) => {
            // console.log(`prev[${i}].desktop :>> `, prev[i]?.desktop);
            day.desktop = prev[i]?prev[i].desktop:day.desktop ;
          });
        }else{
          setCurrentAlreadySet(true);
        }
        return twoMonthsData.data.chartData;
      });
    } catch (error) {
      console.error(error);
    }
  }
}
