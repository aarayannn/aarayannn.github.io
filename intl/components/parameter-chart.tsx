"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ParameterChartProps {
  data: any[]
  fullWidth?: boolean
}

export default function ParameterChart({ data, fullWidth = false }: ParameterChartProps) {
  // Format data for the chart
  const formattedData = data.map((item) => ({
    ...item,
    time: item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "",
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={formattedData}
        margin={{
          top: 5,
          right: 30,
          left: 5,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} tickFormatter={(value) => value} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
        <Tooltip
          contentStyle={{ backgroundColor: "white", borderRadius: "8px", fontSize: "12px" }}
          formatter={(value, name) => {
            if (name === "ppm") return [`${value.toFixed(1)} PPM`, "PPM"]
            if (name === "ph") return [`${value.toFixed(2)}`, "pH"]
            if (name === "temperature") return [`${value.toFixed(1)}°C`, "Suhu"]
            return [value, name]
          }}
          labelFormatter={(label) => `Waktu: ${label}`}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
          formatter={(value) => {
            if (value === "ppm") return "PPM/EC"
            if (value === "ph") return "pH"
            if (value === "temperature") return "Suhu (°C)"
            return value
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="ppm"
          name="ppm"
          stroke="#10b981"
          activeDot={{ r: 5 }}
          strokeWidth={2}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="ph"
          name="ph"
          stroke="#3b82f6"
          activeDot={{ r: 5 }}
          strokeWidth={2}
        />
        {fullWidth && (
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="temperature"
            name="temperature"
            stroke="#ef4444"
            activeDot={{ r: 5 }}
            strokeWidth={2}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
