"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Ghost } from "lucide-react";
import { X } from 'lucide-react';
import { ArrowDownUp } from 'lucide-react';
import { Pencil } from "lucide-react";
import { Trophy } from "lucide-react";
import { toast } from "sonner";

import { RepairsCalendar } from "@/components/RepairsCalendar";
import { RepairsCalendarSkeleton } from "@/components/skeletons/RepairsCalendarSkeleton";
import { apiClient } from "@/lib/apiClient";
import { Car } from "@/types/Car";
import { Mechanic } from "@/types/Mechanic";
import { Repair } from "@/types/Repair";
import { useJwt } from "@/contexts/JwtContext";
import { AreaChartSkeleton } from "@/components/skeletons/AreaChartSkeleton";
import { AddRepairDialog } from "@/components/AddRepairDialog";
import { RepairStatusPieChart } from "@/components/RepairStatusPieChart";

const formSchema = z.object({
  car_id: z.string().regex(/\b[0-9]+\b/),
  mechanic_id: z.string().regex(/\b[0-9]+\b/),
  date: z.string().regex(/\b[0-9]{4}.[0-9]{2}.[0-9]{2}\b/),
  time: z.string().regex(/\b[0-9]{1,2}:[0-9]{2}\b/),
  description: z.string().min(1),
  estimated_work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
  cost: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
  work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
  status: z.string()
});

interface Income {
  month: number;
  year: number;
  totalIncome: number;
};

interface RepairsPerMonth {
  month: number;
  year: number;
  repair_count: number;
};

interface Filters {
  category: string;
  brand: string;
  model: string;
  mechanic: string;
  dateFrom: string;
  dateTo: string;
};

export default function Home() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  // const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([]);
  const [filters, setFilters] = useState<Filters>({
    category: "all",
    brand: "",
    model: "",
    mechanic: "",
    dateFrom: "",
    dateTo: ""
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [created, setCreated] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);
  //const [revenue, setRevenue] = useState<number>(0);
  const [incomeData, setIncomeData] = useState<Income[]>([]);
  const [repairsPerMonth, setRepairsPerMonth] = useState<RepairsPerMonth[]>([]);
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("");
  const [direction, setDirection] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);
  const [pieChartData, setPieChartData] = useState<Array<{ name: string, value: number }>>([]);

  useEffect(() => {
    if (created + inProgress + completed > 0) {
      setPieChartData([
        { name: "Pending", value: created },
        { name: "In progress", value: inProgress },
        { name: "Finished", value: completed },
      ]);
    }
  }, [created, inProgress, completed]);

  const { role } = useJwt();

  async function getRepairs() {
    setIsLoading(true);
    try {
      const repairsData = await apiClient.get<Repair[]>("/repairs");

      const repairsWithPlaceholders = repairsData.map(repair => ({
        ...repair,
        carData: null,
        mechanicData: null
      }));

      setRepairs(repairsWithPlaceholders);

      repairsWithPlaceholders.forEach(async (repair) => {
        try {
          const [carData, mechanicData] = await Promise.all([
            apiClient.get<Car>(`/cars/${repair.car_id}`),
            apiClient.get<Mechanic>(`/mechanics/${repair.mechanic_id}`)
          ]);

          setRepairs(currentRepairs =>
            currentRepairs.map((r) =>
              r.repair_id === repair.repair_id
                ? { ...r, carData, mechanicData }
                : r
            )
          );
        } catch (error) {
          console.log(error);
        }
      });
      setIsLoading(false);

      setCreated(repairsData.filter(r => r.status == "pending").length);
      setInProgress(repairsData.filter(r => r.status == "in progress").length);
      setCompleted(repairsData.filter(r => r.status == "finished").length);

      //setRevenue(repairsData.reduce((sum, r) => sum + Number(r.cost), 0));
    } catch (error) {
      console.log(error);
    }
  }

  async function getCars() {
    try {
      const carsData = await apiClient.get<Car[]>("/cars");

      setCars(carsData);
    } catch (error) {
      console.log(error);
    }
  }

  async function getMechanics() {
    try {
      const mechanicsData = await apiClient.get<Mechanic[]>("/mechanics");

      setMechanics(mechanicsData);
    } catch (error) {
      console.log(error);
    }
  }

  function getStatusStyle(repair: Repair) {
    if (repair.status == "pending") {
      return {
        color: "#5664d2",
        background: "#e4e6f7",
      }
    } else if (repair.status == "in progress") {
      return {
        color: "#fcb92c",
        background: "#fef4e1"
      }
    } else {
      return {
        color: "#1ccb8c",
        background: "#d2f1e7"
      }
    }
  }

  const filteredRepairs = repairs.filter(r => {
    const matchesCategory = filters.category === "all" || r.status === filters.category;
    const matchesBrand = !filters.brand ||
      r.carData?.brand
        .toLowerCase()
        .includes(filters.brand.toLowerCase());
    const matchesModel = !filters.model ||
      r.carData?.model
        .toLowerCase()
        .includes(filters.model.toLowerCase());
    const matchesMechanic = !filters.mechanic ||
      `${r.mechanicData?.firstname} ${r.mechanicData?.lastname}`
        .toLowerCase()
        .includes(filters.mechanic.toLowerCase());
    const repairDate = new Date(r.date).getTime();
    const dateFrom = !filters.dateFrom || repairDate >= new Date(filters.dateFrom).getTime();
    const dateTo = !filters.dateTo || repairDate <= new Date(filters.dateTo).getTime();

    return matchesCategory && matchesBrand && matchesModel &&
      matchesMechanic && dateFrom && dateTo;
  });
  function getDate(date: string) {
    const isoDate = new Date(date);

    return isoDate.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  async function addRepairSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsDialogLoading(true);

      await apiClient.post("/repairs", values);

      getRepairs();

      toast.success("Repair created successfully");

      form.reset();

      setOpen(false);
      setIsDialogLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteRepairSubmit() {
    // try {
    //   await apiClient.delete("/repairs");
    // } catch(error) {
    //   console.log(error);
    // }
  }

  useEffect(() => {
    async function fetchIncome() {
      try {
        const data = await apiClient.get<Income[]>(`/statistics/repairs/income/monthly`);
        console.log(data);
        setIncomeData(data);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchRepairsPerMonth() {
      try {
        const data = await apiClient.get<RepairsPerMonth[]>(`/statistics/repairs/monthly`);
        console.log(data);
        setRepairsPerMonth(data);
      } catch (error) {
        console.log(error);
      }
    }

    getRepairs();
    getCars();
    getMechanics();
    fetchIncome();
    fetchRepairsPerMonth();
  }, []);

  // useEffect(() => {
  //   filterRepairs(status);
  // }, [repairs, status]);

  // useEffect(() => {
  //   if(sort == "registration_number")
  //     filteredRepairs.sort((a, b) => a.carData?.registration_number)
  // }, [sort, direction]);
  const loading = isLoading || repairs.length === 0;

  const repairsPerMechanic = (mechanics.length && repairs.length)
    ? mechanics
      .map(m => ({
        mechanic: m,
        count: repairs.filter(r => r.mechanic_id == m.mechanic_id).length
      }))
      .sort((a, b) => b.count - a.count)
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      car_id: "1",
      mechanic_id: "1",
      date: "",
      time: "",
      description: "",
      estimated_work_time: "",
      work_time: "",
      cost: "",
      status: ""
    }
  });

  const incomeChartData = incomeData.map((item) => ({
    label: item.month >= 10 ? `${item.month}.${item.year}` : `0${item.month}.${item.year}`,
    value: Number(item.totalIncome),
  }));

  const repairsChartData = repairsPerMonth.map((item) => ({
    label: item.month >= 10 ? `${item.month}.${item.year}` : `0${item.month}.${item.year}`,
    value: item.repair_count
  }));

  const allCharts = [
    {
      type: "area",
      title: "Przychód (ostatnie 12 miesięcy)",
      data: incomeChartData,
      color: "#16A34A",
    },
    {
      type: "area",
      title: "Repairs per month (last 12 months)",
      data: repairsChartData,
      color: "#1676a3ff"
    }
  ];

  return (
    <div style={{
      padding: "20px"
    }}>
      <p>{incomeChartData.length > 0 && repairsChartData.length > 0}</p>
      <div>
        <AddRepairDialog
          open={open}
          setOpen={setOpen}
          cars={cars}
          mechanics={mechanics}
          onSubmit={addRepairSubmit}
          isLoading={isDialogLoading}
        />
      </div>
      {/* === STATUS PIE + SIDE INSIGHTS === */}
      <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 mt-6 items-center">
        {/* LEFT: Pie Chart */}
        {/* <Card className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
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
        </Card> */}
        <RepairStatusPieChart
          pieChartData={pieChartData}
        />

        {/* RIGHT: Vertical stack of 2 cards */}
        <div className="flex flex-col gap-4">
          {/* Top Mechanic */}
          <Card className="bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Top Mechanic</span>
                <Trophy size={40} />
              </CardTitle>
              {repairsPerMechanic.length ? (
                <CardDescription className="text-gray-200">
                  Most repairs completed ({repairsPerMechanic[0].count})
                </CardDescription>
              ) : (
                <Skeleton className="h-4 w-40 bg-white/50" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {repairsPerMechanic.length ? (
                  `${repairsPerMechanic[0].mechanic.firstname} ${repairsPerMechanic[0].mechanic.lastname}`
                ) : (
                  <Skeleton className="h-8 w-48 bg-white/50 mt-1" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Average Repair Time */}
          <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">Average Repair Time</CardTitle>
              <CardDescription className="text-gray-200">
                Last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">5.4h</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* === CHARTS SECTION === */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {incomeChartData.length > 0 && repairsChartData.length > 0 ? (allCharts.map((chart, i) => (
          <Card
            key={i}
            className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
          >
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                {chart.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                {chart.type === "area" ? (
                  <AreaChart data={chart.data} className="px-1">
                    <defs>
                      <linearGradient id={`color${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chart.color} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      tickLine={true}
                      axisLine={false}
                      interval={0}
                      tick={({ x, y, payload, index }) => {
                        const isVisible = index % 2 === 1;
                        return (
                          <text
                            x={x}
                            y={y + 15}
                            textAnchor="middle"
                            fill="#4b5563"
                            fontSize={9}
                            opacity={isVisible ? 1 : 0}
                          >
                            {isVisible ? payload.value : ""}
                          </text>
                        );
                      }}
                    />

                    <YAxis hide={false} tick={{ fontSize: 12, fill: "#4b5563" }} />

                    <Tooltip
                      cursor={{ stroke: "rgba(0, 0, 0, 0.1)" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={chart.color}
                      fillOpacity={1}
                      fill={`url(#color${i})`}
                      strokeWidth={2.5}
                      dot={{ r: 4, stroke: chart.color, strokeWidth: 2, fill: "white" }}
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={chart.data}>
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                      contentStyle={{
                        backgroundColor: "#fff",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill={chart.color}
                      radius={[6, 6, 0, 0]}
                      barSize={30}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>

            </CardContent>
          </Card>
        ))) : (
          allCharts.map((_chart, i) => (
            <AreaChartSkeleton key={i} />
          ))
        )}
      </div>
      <div style={{
        height: "32px"
      }} className="relative">
        {status != "all" &&
          <button
            onClick={() => setStatus("all")}
            className="
          absolute right-0 top-0 flex items-center gap-1
          text-[#f87171] hover:text-[#ff2222] cursor-pointer
          "
          >
            <X size={32} color="#f87171" strokeWidth={1.5} />
            Reset filters
          </button>
        }
      </div>
      {/* Filters */}
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-3">
        {/* <Input
          placeholder="Category"
          value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
          className="w-full sm:w-1/3"
        /> */}

        <Select
          value={filters.category}
          onValueChange={(value) =>
            setFilters((f) => ({ ...f, category: value }))
          }
        >
          <SelectTrigger className="w-full sm:w-1/3">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="finished">Finished</SelectItem>
            <SelectItem value="in progress">In progress</SelectItem>
            <SelectItem value="pending">Created</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="Brand"
          value={filters.brand}
          onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
          className="w-full sm:w-1/3"
        />
        <Input
          placeholder="Model"
          value={filters.model}
          onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
          className="w-full sm:w-1/3"
        />
        <Input
          placeholder="Mechanic"
          value={filters.mechanic}
          onChange={(e) => setFilters((f) => ({ ...f, mechanic: e.target.value }))}
          className="w-full sm:w-1/3"
        />

        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters((f) => ({ ...f, dateFrom: e.target.value }))}
          className="w-full sm:w-1/4"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters((f) => ({ ...f, dateTo: e.target.value }))}
          className="w-full sm:w-1/4"
        />
      </div>

      <div>Showing {filteredRepairs.length} {filteredRepairs.length > 1 ?
        <span>repairs</span> : <span>repair</span>

      }</div>

      <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200 mb-4">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                Status
              </TableHead>
              <TableHead onClick={() => {
                setSort("registration_number");
                if (direction || sort != "registration_number")
                  setDirection(false);
                else
                  setDirection(true)
              }} className="px-3 py-2 font-semibold text-gray-700 text-sm cursor-pointer">
                <span className="flex gap-1">
                  Vehicle number
                  <ArrowDownUp strokeWidth={1.5} size={20} />
                </span>
              </TableHead>
              <TableHead onClick={() => {
                setSort("brand");
                if (direction || sort != "brand")
                  setDirection(false);
                else
                  setDirection(true)
              }} className="px-3 py-2 font-semibold text-gray-700 text-sm cursor-pointer">
                <span className="flex gap-1">
                  Brand & model
                  <ArrowDownUp strokeWidth={1.5} size={20} />
                </span>
              </TableHead>
              <TableHead onClick={() => {
                setSort("mechanic");
                if (direction || sort != "mechanic")
                  setDirection(false);
                else
                  setDirection(true)
              }} className="px-3 py-2 font-semibold text-gray-700 text-sm cursor-pointer">
                <span className="flex gap-1">
                  Mechanic
                  <ArrowDownUp strokeWidth={1.5} size={20} />
                </span>
              </TableHead>
              <TableHead onClick={() => {
                setSort("date");
                if (direction || sort != "date")
                  setDirection(false);
                else
                  setDirection(true)
              }} className="px-3 py-2 font-semibold text-gray-700 text-sm cursor-pointer">
                <span className="flex gap-1">
                  Date
                  <ArrowDownUp strokeWidth={1.5} size={20} />
                </span>
              </TableHead>
              <TableHead onClick={() => {
                setSort("time");
                if (direction || sort != "time")
                  setDirection(false);
                else
                  setDirection(true)
              }} className="px-3 py-2 font-semibold text-gray-700 text-sm cursor-pointer">
                <span className="flex gap-1">
                  Time
                  <ArrowDownUp strokeWidth={1.5} size={20} />
                </span>
              </TableHead>
              <TableHead onClick={() => {
                setSort("cost");
                if (direction || sort != "cost")
                  setDirection(false);
                else
                  setDirection(true)
              }} className="px-3 py-2 font-semibold text-gray-700 text-sm cursor-pointer">
                <span className="flex gap-1">
                  Cost
                  <ArrowDownUp strokeWidth={1.5} size={20} />
                </span>
              </TableHead>
              <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm text-right"></TableHead>
              {role === "admin" &&
                <>
                  <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm text-right"></TableHead>
                  <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm text-right"></TableHead>
                </>
              }
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={role === "admin" ? 10 : 8}>
                    <Skeleton className="h-4 w-full rounded-md bg-gray-300 animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredRepairs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={role === "admin" ? 10 : 8} className="text-center py-6 text-gray-500">
                  <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Ghost size={64} strokeWidth={1.5} className="mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">
                      No repairs found
                    </h2>
                    <p className="text-lg mb-2">
                      No data available for the selected filters.
                    </p>
                    <button
                      onClick={() => setFilters({
                        category: "all",
                        brand: "",
                        model: "",
                        mechanic: "",
                        dateFrom: "",
                        dateTo: ""
                      })}
                      className="
                          flex items-center gap-1
                          text-[#f87171] hover:text-[#ff2222] cursor-pointer
                        "
                    >
                      <X size={32} color="#f87171" strokeWidth={1.5} />
                      Reset filters
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRepairs.map((repair) => (
                <TableRow
                  key={repair.repair_id}
                  className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="px-3 py-2 text-sm">
                    <span
                      style={{
                        ...getStatusStyle(repair),
                        padding: "5px 8px",
                        borderRadius: "5px",
                        fontSize: "0.85rem",
                      }}
                    >
                      {repair.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm">
                    {repair.carData ? (
                      // <Link
                      //   href={`/car/${repair.car_id}`}
                      //   className="underline text-blue-600 hover:text-blue-800"
                      // >
                      //   {repair.carData.registration_number}
                      // </Link>
                      <Popover>
                        <PopoverTrigger className="underline text-blue-600 hover:text-blue-800 cursor-pointer">
                          {repair.carData.registration_number}
                        </PopoverTrigger>
                        <PopoverContent className="p-3 w-64 text-sm space-y-1">
                          <div><span className="font-semibold">Brand:</span> {repair.carData.brand}</div>
                          <div><span className="font-semibold">Model:</span> {repair.carData.model}</div>
                          <div><span className="font-semibold">Production Year:</span> {repair.carData.production_year}</div>
                          <div><span className="font-semibold">Mileage:</span> {repair.carData.mileage.toLocaleString()} km</div>
                          <div><span className="font-semibold">VIN:</span> {repair.carData.vin ?? "N/A"}</div>
                          <div><span className="font-semibold">Last Update:</span> {new Date(repair.carData.last_update_date).toLocaleDateString()}</div>
                          <div className="mt-2">
                            <Link
                              href={`/car/${repair.car_id}`}
                              className="underline text-blue-600 hover:text-blue-800"
                            >
                              Details
                            </Link>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm">
                    {repair.carData ? (
                      <>
                        {repair.carData?.brand} {repair.carData?.model}
                      </>
                    ) : (
                      <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm">
                    {repair.mechanicData ? (
                      <Link
                        href={`/mechanic/${repair.mechanic_id}`}
                        className="underline text-blue-600 hover:text-blue-800"
                      >
                        {repair.mechanicData.firstname} {repair.mechanicData.lastname}
                      </Link>
                    ) : (
                      <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-2 text-sm">{getDate(repair.date)}</TableCell>
                  <TableCell className="px-3 py-2 text-sm">{repair.time}</TableCell>
                  <TableCell className="px-3 py-2 text-sm font-medium text-gray-700">
                    {repair.cost} $
                  </TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <Link href={`/repair/${repair.repair_id}`}>
                      <span className="bg-[#e4e6f7] text-[#5664d2] px-3 py-1 rounded-md text-sm font-medium hover:bg-[#cdd0f5] hover:text-[#333] cursor-pointer transition-colors">
                        View
                      </span>
                    </Link>
                  </TableCell>
                  {role === "admin" &&
                    <>
                      <TableCell className="px-3 py-2 text-right">
                        <span
                          className="bg-[#d1fae5] text-[#059669] px-3 py-1 rounded-md 
             text-sm font-medium hover:bg-[#a7f3d0] hover:text-[#065f46] cursor-pointer transition-colors"
                        >
                          <Pencil className="inline-block mr-1" size={16} />
                          Edit
                        </span>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-right">
                        <span onClick={() => deleteRepairSubmit()}
                          className="bg-[#fee2e2] text-[#dc2626] px-3 py-1 rounded-md text-sm font-medium 
                 hover:bg-[#fecaca] hover:text-[#991b1b] cursor-pointer transition-colors"
                        >
                          Delete
                        </span>
                      </TableCell>
                    </>
                  }
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {repairs.length > 0 ? (
        <RepairsCalendar
          repairs={repairs}
          mechanics={mechanics}
        ></RepairsCalendar>
      ) : (
        <RepairsCalendarSkeleton />
      )}
      {/* } */}
      {/* {
        !filteredRepairs.length &&
        <div>Repairs with status &apos;{status}&apos; not found</div>
      } */}
      {/* {
        !filteredRepairs.length &&
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Ghost size={64} strokeWidth={1.5} className="mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            No repairs found
          </h2>
          <p className="text-lg mb-2">
            There are no repairs with status &quot;{status}&quot;.
          </p>
          <button
            onClick={() => setStatus("all")}
            className="
          flex items-center gap-1
          text-[#f87171] hover:text-[#ff2222] cursor-pointer
          "
          >
            <X size={32} color="#f87171" strokeWidth={1.5} />
            Reset filters
          </button>
        </div>
      } */}
      <pre>
        {JSON.stringify(repairsPerMonth, null, 2)}
      </pre>
      <pre>
        {JSON.stringify(incomeData, null, 2)}
      </pre>
      <h1>{status}</h1>
      <h2>{sort}</h2>
      <pre>
        {JSON.stringify(repairsPerMechanic, null, 2)}
      </pre>
      <h3>{JSON.stringify(direction)}</h3>
      <pre>
        {JSON.stringify(repairs, null, 2)}
      </pre>
    </div>
  );
}
