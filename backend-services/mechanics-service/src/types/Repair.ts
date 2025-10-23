export interface Repair {
    repair_id: number;
    car_id: number;
    mechanic_id: number;
    date: Date;
    time: string;
    description: string;
    estimated_work_time: number;
    cost: number;
    work_time: number;
    status: string;
};