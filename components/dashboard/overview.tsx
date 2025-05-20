"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Expense } from "@/lib/types/expense"
import type { Category } from "@/lib/types/category"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { addDays, format, startOfMonth, startOfWeek, startOfYear, subMonths, subWeeks, subYears } from "date-fns"

interface OverviewProps {
  expenses: Expense[]
  categories: Category[]
}

interface ChartData {
  name: string
  total: number
  date: Date
}

type TimePeriod = "week" | "month" | "year"

export function Overview({ expenses, categories }: OverviewProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("week")

  useEffect(() => {
    // Process expenses based on selected time period
    const processExpenses = () => {
      // Define start date based on time period
      const now = new Date()
      let startDate: Date
      let dateFormat: string
      let groupByFormat: string

      switch (timePeriod) {
        case "week":
          startDate = startOfWeek(subWeeks(now, 1))
          dateFormat = "EEE" // Mon, Tue, etc.
          groupByFormat = "yyyy-MM-dd"
          break
        case "month":
          startDate = startOfMonth(subMonths(now, 1))
          dateFormat = "MMM dd" // Jan 01, Feb 02, etc.
          groupByFormat = "yyyy-MM-dd"
          break
        case "year":
          startDate = startOfYear(subYears(now, 1))
          dateFormat = "MMM" // Jan, Feb, etc.
          groupByFormat = "yyyy-MM"
          break
        default:
          startDate = startOfWeek(subWeeks(now, 1))
          dateFormat = "EEE"
          groupByFormat = "yyyy-MM-dd"
      }

      // Filter expenses by date range
      const filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= startDate
      })

      // Group expenses by date
      const groupedExpenses: Record<string, number> = {}

      // Initialize all dates in the range with zero values
      if (timePeriod === "week") {
        for (let i = 0; i < 7; i++) {
          const date = addDays(startDate, i)
          const dateKey = format(date, groupByFormat)
          groupedExpenses[dateKey] = 0
        }
      } else if (timePeriod === "month") {
        const daysInMonth = 30 // Approximate
        for (let i = 0; i < daysInMonth; i++) {
          const date = addDays(startDate, i)
          if (date <= now) {
            const dateKey = format(date, groupByFormat)
            groupedExpenses[dateKey] = 0
          }
        }
      } else if (timePeriod === "year") {
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), i, 1)
          const dateKey = format(date, groupByFormat)
          groupedExpenses[dateKey] = 0
        }
      }

      // Sum expenses for each date
      filteredExpenses.forEach((expense) => {
        const expenseDate = new Date(expense.date)
        const dateKey = format(expenseDate, groupByFormat)

        if (groupedExpenses[dateKey] !== undefined) {
          groupedExpenses[dateKey] += expense.amount
        } else {
          groupedExpenses[dateKey] = expense.amount
        }
      })

      // Convert to chart data format
      const data: ChartData[] = Object.entries(groupedExpenses).map(([dateKey, total]) => {
        let date: Date

        if (timePeriod === "year") {
          const [year, month] = dateKey.split("-")
          date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
        } else {
          const [year, month, day] = dateKey.split("-")
          date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
        }

        return {
          name: format(date, dateFormat),
          total,
          date,
        }
      })

      // Sort by date
      data.sort((a, b) => a.date.getTime() - b.date.getTime())

      setChartData(data)
    }

    processExpenses()
  }, [expenses, timePeriod])

  const getPeriodTitle = () => {
    switch (timePeriod) {
      case "week":
        return "Last 7 Days"
      case "month":
        return "Last 30 Days"
      case "year":
        return "This Year"
      default:
        return "Expense Overview"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Expense Overview</CardTitle>
          <CardDescription>{getPeriodTitle()}</CardDescription>
        </div>
        <Tabs defaultValue="week" value={timePeriod} onValueChange={(value) => setTimePeriod(value as TimePeriod)}>
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">No expense data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
