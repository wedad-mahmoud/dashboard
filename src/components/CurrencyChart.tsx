"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface CurrencyChartProps {
  data: ChartData[];
}

const CurrencyChart = ({ data }: CurrencyChartProps) => {
  return (
    <div className="h-[300px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d9f99d" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#d9f99d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e1a47" vertical={false} />
          <XAxis dataKey="name" stroke="#a78bfa" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#a78bfa" fontSize={12} tickLine={false} axisLine={false} hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1a0b2e', border: '1px solid #4c1d95', borderRadius: '12px' }}
            itemStyle={{ color: '#d9f99d' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#d9f99d" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            strokeWidth={4}
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrencyChart;