import MechanicClient from "@/views/Mechanic";

interface MechanicParams {
    id: number;
}

interface MechanicPageProps {
    params: Promise<MechanicParams>
}

export default async function MechanicPage({ params }: MechanicPageProps) {
    const { id } = await params;

    return (
        <MechanicClient id={id}></MechanicClient>
    )
}