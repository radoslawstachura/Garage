import CarClient from "@/views/Car";

interface CarParams {
    id: number;
}

interface CarPageProps {
    params: Promise<CarParams>
}

export default async function CarPage({ params }: CarPageProps) {
    const { id } = await params;

    return (
        <CarClient id={id}></CarClient>
    )
}