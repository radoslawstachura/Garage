import { Owner } from "./Owner";

export interface Car {
    car_id: number;
    registration_number: string;
    brand: string;
    model: string;
    production_year: number;
    mileage: number;
    owner_id: number;
    vin: string;
    last_update_date: Date;
    is_deleted: boolean;
    deleted_at: Date | null;
    ownerData: Owner | null;
};