"use client";
import { useMemo, useState } from "react";
import { startOfWeek, addDays, format } from "date-fns";
import { pl } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Repair } from "@/types/Repair";
import { Mechanic } from "@/types/Mechanic";

type RepairsCalendarProps = {
    repairs: Repair[];
    mechanics: Mechanic[];
};

export function RepairsCalendar({ repairs, mechanics }: RepairsCalendarProps) {
    const [selectedMechanic, setSelectedMechanic] = useState<string>("all");
    const [currentWeekStart, setCurrentWeekStart] = useState(
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const filtered = useMemo(() => {
        let data = repairs;
        if (selectedMechanic !== "all") {
            data = data.filter((r) => r.mechanic_id.toString() === selectedMechanic);
        }
        return data.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
    }, [repairs, selectedMechanic]);

    const weekDays = Array.from({ length: 7 }, (_, i) =>
        addDays(currentWeekStart, i)
    );

    const repairsByDay = useMemo(() => {
        const grouped: Record<string, Repair[]> = {};
        for (const r of filtered) {
            const dateKey = r.date.split("T")[0];
            if (!grouped[dateKey]) grouped[dateKey] = [];
            grouped[dateKey].push(r);
        }
        return grouped;
    }, [filtered]);

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Repairs calendar</h2>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeekStart((d) => addDays(d, -7))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <span className="text-sm font-medium text-gray-600">
                        {format(weekDays[0], "d MMM", { locale: pl })} -{" "}
                        {format(weekDays[6], "d MMM yyyy", { locale: pl })}
                    </span>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentWeekStart((d) => addDays(d, 7))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
                    <SelectTrigger className="w-64">
                        <SelectValue placeholder="Wybierz mechanika" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Wszyscy</SelectItem>
                        {mechanics.map((m) => (
                            <SelectItem key={m.mechanic_id} value={m.mechanic_id.toString()}>
                                {m.firstname} {m.lastname}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {weekDays.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dailyRepairs = repairsByDay[dateKey] ?? [];

                    return (
                        <Card key={dateKey} className="p-3 min-h-[200px] flex flex-col">
                            <h3 className="text-sm font-semibold mb-2 text-gray-700 text-center">
                                {format(day, "EEEE", { locale: pl })} <br />
                                <span className="text-gray-500 text-xs">
                                    {format(day, "d MMM", { locale: pl })}
                                </span>
                            </h3>

                            <div className="space-y-2 flex-1">
                                {dailyRepairs.length > 0 ? (
                                    dailyRepairs.map((r) => (
                                        <div
                                            key={r.repair_id}
                                            className="p-2 rounded-md bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all"
                                        >
                                            <p className="text-sm font-medium">{r.description}</p>
                                            <p className="text-xs text-gray-600">
                                                {r.mechanicData
                                                    ? `${r.mechanicData.firstname} ${r.mechanicData.lastname}`
                                                    : `Mechanik #${r.mechanic_id}`}
                                            </p>
                                            <p className="text-xs text-gray-400">{r.time.slice(0, -3)}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-gray-400 italic text-center mt-4">
                                        No repairs
                                    </p>
                                )}
                            </div>
                        </Card>
                    );
                })}
            </div>
            <pre>
                {JSON.stringify(repairs, null, 2)}
                {JSON.stringify(mechanics, null, 2)}
            </pre>
        </div>
    );
}