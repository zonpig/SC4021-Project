import { PieChart, Pie, Cell, Tooltip, Legend, Label } from "recharts";

import { useMemo } from "react";

const COLORS = ["#55B460", "#F2BB77", "#EE613F"]; // Positive, Negative, Neutral colors

const SentimentPieChart = ({ solrData }) => {
  // Step 1: Process data using useMemo (good practice)
  const sentimentData = useMemo(() => {
    let positive = 0;
    let negative = 0;
    let neutral = 0;
    let total = 0;

    solrData.forEach((doc) => {
      const sentiment = doc.sentiment?.[0]; // 'positive', 'negative', 'neutral'
      total++;
      if (sentiment === "positive") positive++;
      else if (sentiment === "negative") negative++;
      else if (sentiment === "neutral") neutral++;
    });
    return [
      { name: "Positive", value: positive },
      { name: "Negative", value: negative },
      { name: "Neutral", value: neutral },
    ];
  }, [solrData]);

  // Step 2: Render chart
  const total = sentimentData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <>
      {solrData.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>Loading data...</p>
        </div>
      ) : (
        <PieChart width={1000} height={400}>
          <Pie
            data={sentimentData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            labelLine={false} // Hide the lines connecting labels to slices
            label={({ value }) => {
              const percentage = ((value / total) * 100).toFixed(2);
              return `${percentage}%`;
            }}
          >
            {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical" // Vertical layout
            align="right" // Align to the right
            verticalAlign="top" // Align to the top
            iconSize={12} // Adjust the size of the legend icons
            wrapperStyle={{
              position: "absolute", // Absolute positioning
              top: 150, // Adjust top position
              right: 250, // Adjust right position
            }}
          />
        </PieChart>
      )}
    </>
  );
};

export default SentimentPieChart;
