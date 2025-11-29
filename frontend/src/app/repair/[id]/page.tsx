import RepairClient from "@/views/Repair";

interface RepairParams {
    id: number;
}

interface RepairPageProps {
    params: Promise<RepairParams>
}

export default async function OwnerPage({ params }: RepairPageProps) {
    const { id } = await params;

    return (
        <RepairClient id={id}></RepairClient>
    )
}