'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
    name: string;
    total: number;
}

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#8884d8'];

export function StrengthDistributionChart({ data }: { data: ChartData[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Tooltip
                    wrapperClassName="rounded-md border bg-background p-2 shadow-sm"
                    formatter={(value) => [value, 'Total']}
                />
                <Legend verticalAlign="bottom" height={36} />
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="name"
                    label={({ percent }) => `${(percent * 100 ).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
