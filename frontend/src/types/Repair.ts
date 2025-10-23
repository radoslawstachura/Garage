import { Car } from "./Car";
import { Mechanic } from "./Mechanic";

export interface Repair {
    repair_id: number;
    car_id: string;
    mechanic_id: string;
    date: string;
    time: string;
    description: string;
    estimated_work_time: string;
    cost: string;
    work_time: string;
    status: string;
    mechanicData: Mechanic | null;
    carData: Car | null;
};