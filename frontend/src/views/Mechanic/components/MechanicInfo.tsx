"use client";

import { Mechanic } from "@/types/Mechanic";

type MechanicInfoProps = {
    mechanic: Mechanic;
};

export function MechanicInfo({ mechanic }: MechanicInfoProps) {
    return (
        <div className="space-y-1">
            <p><b>Firstname:</b> {mechanic.firstname}</p>
            <p><b>Lastname:</b> {mechanic.lastname}</p>
            <p><b>Specialization:</b> {mechanic.specialization}</p>
            <p><b>Phone:</b> {mechanic.phone_number || "-"}</p>
            <p><b>Email:</b> {mechanic.email}</p>
        </div>
    );
}
