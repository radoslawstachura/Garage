import { Mechanic } from "@/types/Mechanic";

export function MechanicInfo({ mechanic }: { mechanic: Mechanic }) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Mechanic Information</h2>
            <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {`${mechanic.firstname} ${mechanic.lastname}`}</p>
                <p><span className="font-medium">Specialization:</span> {mechanic.specialization}</p>
                <p><span className="font-medium">Phone:</span> {mechanic.phone_number}</p>
                <p><span className="font-medium">Email:</span> {mechanic.email}</p>
            </div>
        </div>
    );
}