import { Car } from "@/types/Car";

export function CarInfo({ car }: { car: Car }) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Car Information</h2>
            <div className="space-y-2">
                <p><span className="font-medium">Registration:</span> {car.registration_number ?? "N/A"}</p>
                <p><span className="font-medium">Brand:</span> {car.brand ?? "N/A"}</p>
                <p><span className="font-medium">Model:</span> {car.model ?? "N/A"}</p>
                <p><span className="font-medium">Year:</span> {car.production_year ?? "N/A"}</p>
                <p><span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString() ?? "N/A"} km</p>
                {car.is_deleted && (
                    <p className="text-red-500 font-semibold">Deleted</p>
                )}
            </div>
        </div>
    );
}