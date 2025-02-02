import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EmotionLineChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const formattedData = data.map(item => ({
      timestamp: new Date(item.created_at).toLocaleTimeString(),  
      emotion: item.emotions || "Unknown",
      score: item.score ?? 0 // Ensure score is not null
    }));

    setChartData(formattedData);
  }, [data]);

  // Custom Tooltip to show emotion & score
  const CustomTooltip = ({ payload, label }) => {
    if (!payload || payload.length === 0) return null;
    const { emotion, score } = payload[0].payload;

    return (
      <div style={{ padding: "10px", backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "5px" }}>
        <p><strong>Time:</strong> {label}</p>
        <p><strong>Emotion:</strong> {emotion}</p>
        <p><strong>Score:</strong> {score}</p>
      </div>
    );
  };

  return (
    <div className="w-full text-center">
      <p className="text-xl font-bold">Emotion Trend</p>
      <ResponsiveContainer width="100%" height={400} className="mt-10">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          <Line type="basis" dataKey="score" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmotionLineChart;
