import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { PieChartSkeleton } from "@/components/skeletons/PieChartSkeleton";

interface RepairStatusPieChartProps {
    pieChartData: { name: string; value: number }[];
}

export function RepairStatusPieChart({ pieChartData }: RepairStatusPieChartProps) {
    return (
        <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                    Udział statusów napraw
                </CardTitle>
                <CardDescription>Procentowy podział wszystkich napraw</CardDescription>
            </CardHeader>

            <CardContent className="flex justify-center items-center">
                {pieChartData.length === 0 ? (
                    <PieChartSkeleton />
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={pieChartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(1)}%`
                                }
                                isAnimationActive={true}
                            >
                                <Cell key="pending" fill="#5664d2" />
                                <Cell key="inProgress" fill="#fcb92c" />
                                <Cell key="finished" fill="#1cbb8c" />
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",
                                    border: "1px solid #e5e7eb",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}