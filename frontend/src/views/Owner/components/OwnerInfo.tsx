"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import { Owner } from "@/types/Owner";

interface OwnerInfoProps {
    owner: Owner;
}

export function OwnerInfo({ owner }: OwnerInfoProps) {
    return (
        <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-700">
                {owner.firstname[0]}
            </div>

            <div>
                <h2 className="text-2xl font-semibold text-slate-800">
                    {owner.firstname} {owner.lastname}
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-slate-600 text-sm">
                    <div className="flex items-center gap-2">
                        <Mail size={16} className="text-slate-500" />
                        {owner.email}
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone size={16} className="text-slate-500" />
                        {owner.phone_number}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-slate-500" />
                        {owner.address}
                    </div>
                </div>
            </div>
        </div>
    );
}
