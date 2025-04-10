import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
const COLORS = ["#55B460", "#F2BB77", "#EE613F"]; // Positive, Negative, Neutral colors

const SentimentBarChart = ({ solrData }) => {
  const [selectedSentiment, setSelectedSentiment] = useState(null); // Keeps track of clicked sentiment for filtering

  // Process sentiment data by date for the Bar chart
  const sentimentByDateData = useMemo(() => {
    const grouped = {};

    solrData.forEach((doc) => {
      const date = doc.timestamp_updated_date?.[0]?.substring(0, 10); // Extract "YYYY-MM-DD"
      const sentiment = doc.sentiment?.[0];
      if (!date || !sentiment) return;

      if (!grouped[date]) {
        grouped[date] = { date, positive: 0, negative: 0, neutral: 0 };
      }

      if (sentiment === "positive") grouped[date].positive++;
      else if (sentiment === "negative") grouped[date].negative++;
      else if (sentiment === "neutral") grouped[date].neutral++;
    });

    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
  }, [solrData]);
  const filteredBarData = useMemo(() => {
    // display percentage is selected sentiment is all
    if (selectedSentiment === "all") {
      // Calculate percentage for each sentiment for each date
      const dataWithPercentages = sentimentByDateData.map((doc) => {
        const totalSentiments = doc.positive + doc.negative + doc.neutral;

        // Calculate percentages for each sentiment
        const positivePercentage =
          totalSentiments > 0 ? (doc.positive / totalSentiments) * 100 : 0;
        const negativePercentage =
          totalSentiments > 0 ? (doc.negative / totalSentiments) * 100 : 0;
        const neutralPercentage =
          totalSentiments > 0 ? (doc.neutral / totalSentiments) * 100 : 0;
        console.log(positivePercentage, negativePercentage, neutralPercentage);
        // Return updated object with percentages
        return {
          date: doc.date,
          positivePercentage,
          negativePercentage,
          neutralPercentage,
        };
      });

      console.log(
        "Data with percentages:",
        JSON.stringify(dataWithPercentages, null, 2),
      );
      return dataWithPercentages; // Return the new data with percentages
    }
    // console.log("Selected Sentiment:", selectedSentiment);
    //   function to allow users to view by filtered sentiment!

    if (selectedSentiment) {
      //   console.log("Filtering by sentiment:", selectedSentiment);

      const filteredData = sentimentByDateData
        .map((doc) => {
          // Create a copy of the document, ensuring other sentiments are set to 0
          const filteredDoc = { ...doc };

          // Set other sentiments to 0, based on the selected sentiment
          if (selectedSentiment === "positive") {
            filteredDoc.negative = 0;
            filteredDoc.neutral = 0;
          } else if (selectedSentiment === "negative") {
            filteredDoc.positive = 0;
            filteredDoc.neutral = 0;
          } else if (selectedSentiment === "neutral") {
            filteredDoc.positive = 0;
            filteredDoc.negative = 0;
          }

          // Only return documents where the selected sentiment is greater than 0
          if (filteredDoc[selectedSentiment] > 0) {
            return filteredDoc;
          }

          return null;
        })
        .filter((doc) => doc !== null); // Filter out any null values

    //   console.log(
    //     "Filtered Data with 0ed-out other sentiments:",
    //     JSON.stringify(filteredData, null, 2),
    //   );
      return filteredData;
    }

    return sentimentByDateData; // Return all data if no sentiment is selected
  }, [selectedSentiment, sentimentByDateData]);

  // Log the lengths to verify the filtering
  // console.log('Selected Sentiment:', selectedSentiment);
  // console.log('Filtered Bar Data:', filteredBarData);
  // console.log('Total Data Length:', sentimentByDateData.length);
  // console.log('Filtered Data Length:', filteredBarData.length);
  // Handle sentiment selection (to filter Bar chart data)
  const handleSentimentChange = (sentiment) => {
    setSelectedSentiment(sentiment);
  };

  return (
    <div className="w-full p-8">
      <div className="flex justify-center mb-4 w-2/3 mx-auto">
        <button
          className={`p-2 w-full text-black rounded-l-lg border-r-2 border-gray-300 flex justify-center ${
            selectedSentiment === "positive"
              ? "bg-blue-400 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSentimentChange("positive")}
        >
          Positive
        </button>
        <button
          className={`p-2 w-full text-black border-r-2 border-gray-300 flex justify-center ${
            selectedSentiment === "neutral"
              ? "bg-blue-400 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSentimentChange("neutral")}
        >
          Neutral
        </button>
        <button
          className={`p-2 w-full text-black border-r-2 border-gray-300 flex justify-center ${
            selectedSentiment === "negative"
              ? "bg-blue-400 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSentimentChange("negative")}
        >
          Negative
        </button>
        <button
          className={`p-2 w-full text-black rounded-r-lg flex justify-center ${
            selectedSentiment === null
              ? "bg-blue-400 text-white"
              : "bg-gray-200"
          }`}
          onClick={() => handleSentimentChange(null)}
        >
          All
        </button>{" "}
      </div>

      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={filteredBarData}
          margin={{ top: 30, right: 30, bottom: 100, left: 40 }}
        >
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          <Legend
            layout="vertical" // Vertical layout
            align="right" // Align to the right
            verticalAlign="top" // Align to the top
            iconSize={12} // Adjust the size of the legend icons
            wrapperStyle={{
              position: "absolute", // Absolute positioning
              top: 20, // Adds space from the top (you can adjust this value)
              right: 10, // Adjust right position
            }}
            formatter={(value) => {
              // Capitalize first letter
              return value.charAt(0).toUpperCase() + value.slice(1);
            }}
          />{" "}
          <Bar dataKey="positive" stackId="a" fill={COLORS[0]}>
          <LabelList dataKey="positivePercentage" position="top" />
        </Bar>

          <Bar dataKey="neutral" stackId="a" fill={COLORS[2]} >
          <LabelList dataKey="negativePercentage" position="top" />
          </Bar>
          <Bar dataKey="negative" stackId="a" fill={COLORS[1]} >
          <LabelList dataKey="neutralPercentage" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentBarChart;
