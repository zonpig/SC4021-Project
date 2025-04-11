import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
const COLORS = ["#55B460", "#F2BB77", "#EE613F"]; // Positive, Negative, Neutral colors

const SentimentChart = ({ solrData }) => {
  const [granularity, setGranularity] = useState("year"); // year, month, day
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Grouping the data by year, month, and day
  const groupedData = useMemo(() => {
    const grouped = { year: {}, month: {}, day: {} };

    solrData.forEach((doc) => {
      const date = doc.timestamp_updated_date?.[0]?.substring(0, 10); // Extract "YYYY-MM-DD"
      const sentiment = doc.sentiment?.[0];
      if (!date || !sentiment) return;

      const [year, month, day] = date.split("-");

      // Group by year
      if (!grouped.year[year]) {
        grouped.year[year] = {
          year,
          positive: 0,
          negative: 0,
          neutral: 0,
          positivePercentage: 0,
          negativePercentage: 0,
          neutralPercentage: 0,
          total: 0,
        };
      }
      grouped.year[year][sentiment]++;
      grouped.year[year].total++;

      // Group by month
      const monthKey = `${year}-${month}`;
      if (!grouped.month[monthKey]) {
        grouped.month[monthKey] = {
          year,
          month,
          positive: 0,
          negative: 0,
          neutral: 0,
          positivePercentage: 0,
          negativePercentage: 0,
          neutralPercentage: 0,

          total: 0,
        };
      }
      grouped.month[monthKey][sentiment]++;
      grouped.month[monthKey].total++;

      // Group by day
      const dayKey = `${year}-${month}-${day}`;
      if (!grouped.day[dayKey]) {
        grouped.day[dayKey] = {
          year,
          month,
          day,
          positive: 0,
          negative: 0,
          neutral: 0,
          positivePercentage: 0,
          negativePercentage: 0,
          neutralPercentage: 0,
          total: 0,
        };
      }
      grouped.day[dayKey][sentiment]++;
      grouped.day[dayKey].total++;
    });

    // Calculate percentages
    ["year", "month", "day"].forEach((granularity) => {
      Object.values(grouped[granularity]).forEach((item) => {
        item.positivePercentage = ((item.positive / item.total) * 100).toFixed(
          1,
        );
        item.negativePercentage = ((item.negative / item.total) * 100).toFixed(
          1,
        );
        item.neutralPercentage = ((item.neutral / item.total) * 100).toFixed(1);
      });
    });

    return grouped;
  }, [solrData]);

  console.log("Grouped Data:", groupedData);

  const handleGranularityChange = (newGranularity) => {
    setGranularity(newGranularity);
    if (newGranularity === "year") {
      setSelectedMonth(null); // Reset month and day when switching to year
      setSelectedDay(null);
    }
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null); // Reset month and day when changing year
    setGranularity("month"); // Automatically switch to month view
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setGranularity("day"); // Automatically switch to day view
  };

  const getFilteredData = () => {
    if (granularity === "year") {
      return Object.values(groupedData.year)
        .map((item) => ({
          ...item,
          date: item.year, // Add a consistent `date` field for the X-axis
        }))
        .sort((a, b) => a.date.localeCompare(b.date)); // Sort by year
    }
    if (granularity === "month" && selectedYear) {
      return Object.values(groupedData.month)
        .filter((item) => item.year === selectedYear)
        .map((item) => ({
          ...item,
          date: `${item.year}-${item.month}`, // Add a `date` field
        }))
        .sort((a, b) => a.date.localeCompare(b.date)); // Sort by year
    }
    if (granularity === "day" && selectedMonth) {
      return Object.values(groupedData.day)
        .filter((item) => `${item.year}-${item.month}` === selectedMonth)
        .map((item) => ({
          ...item,
          date: `${item.year}-${item.month}-${item.day}`, // Add a `date` field
        }))
        .sort((a, b) => a.date.localeCompare(b.date)); // Sort by year
    }
    return [];
  };

  return solrData && solrData.length === 0 ? (
    <div>Loading...</div>
  ) : (
    <div className="w-full p-8">
      {/* Granularity Selector */}
      <div className="flex mb-4">
        <button
          className={`p-2 w-full ${granularity === "year" ? "bg-blue-400" : "bg-gray-200"}`}
          onClick={() => handleGranularityChange("year")}
        >
          Year
        </button>
        <button
          className={`p-2 w-full ${granularity === "month" ? "bg-blue-400" : "bg-gray-200"}`}
          onClick={() => handleGranularityChange("month")}
        >
          Month
        </button>
        <button
          className={`p-2 w-full ${granularity === "day" ? "bg-blue-400" : "bg-gray-200"}`}
          onClick={() => handleGranularityChange("day")}
        >
          Day
        </button>
      </div>

      {/* Year Selector (Visible when granularity is year) */}
      {
        //   granularity === "year" &&
        <select
          className="border"
          onChange={(e) => handleYearChange(e.target.value)}
          value={selectedYear}
        >
          <option value="">Select Year</option>
          {Object.keys(groupedData.year)
            .sort((a, b) => a - b) // Sort years in ascending order
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      }

      {/* Month Selector (Visible when granularity is month) */}
      {
        //   granularity === "month" &&
        selectedYear && (
          <select
            className="border"
            onChange={(e) => handleMonthChange(e.target.value)}
            value={selectedMonth}
          >
            <option value="">Select Month</option>
            {Object.keys(groupedData.month)
              .filter((month) => month.startsWith(selectedYear)) // Filter for selected year
              .sort((a, b) => a.localeCompare(b)) // Sort months in ascending order
              .map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
          </select>
        )
      }

      {/* Data Rendering */}
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={getFilteredData()}
          margin={{ top: 30, right: 0, bottom: 100, left: 0 }}
        >
          <XAxis
            dataKey="date"
            angle={0}
            textAnchor="middle"
            height={70}
            style={{ fontWeight: "normal", fontSize: "12px" }}
          />
          <YAxis />
          {/* <Tooltip
            formatter={(value) => `${value}%`} // Add percentage sign to the value
            cursor={{ fill: "transparent" }} // Optional: Customize the highlight on hover
          /> */}
          <Tooltip
            formatter={(value, name, props) => {
              const {
                positivePercentage,
                negativePercentage,
                neutralPercentage,
              } = props.payload;

              if (name === "positive") {
                return [`${positivePercentage}% (${value})`, name];
              }
              if (name === "negative") {
                return [`${negativePercentage}% (${value})`, name];
              }
              if (name === "neutral") {
                return [`${neutralPercentage}% (${value})`, name];
              }
              return [`${value}`, name]; // Default fallback
            }}
            cursor={{ fill: "transparent" }}
          />
          {/* make the sentiment caps for the first character */}
          <Legend
            formatter={(value) =>
              value.charAt(0).toUpperCase() + value.slice(1)
            }
          />
          <Bar dataKey="positive" stackId="a" fill={COLORS[0]}>
            {/* <LabelList
              dataKey="positive"
              position="insideMiddle"
              formatter={(v) => (v > 0 ? `${v}%` : null)} // Display label only if > 0
              fill="#FFFFFF"
              style={{ fontWeight: "normal", fontSize: "12px", }}
            /> */}
          </Bar>
          <Bar dataKey="negative" stackId="a" fill={COLORS[1]}>
            {/* <LabelList
              dataKey="negative"
              position="insideMiddle"
              formatter={(v) => (v > 0 ? `${v}%` : null)} // Display label only if > 0
              fill="#FFFFFF"
              style={{ fontWeight: "normal", fontSize: "12px" }}
            /> */}
          </Bar>
          <Bar dataKey="neutral" stackId="a" fill={COLORS[2]}>
            {/* <LabelList
              dataKey="neutral"
              position="insideMiddle"
              formatter={(v) => (v > 0 ? `${v}%` : null)} // Display label only if > 0
              fill="#FFFFFF"
              style={{ fontWeight: "normal", fontSize: "12px" }}
            /> */}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentChart;
