import OwnerClient from "@/components/OwnerClient";

interface OwnerParams {
    id: number;
}

interface OwnerPageProps {
    params: Promise<OwnerParams>
}

export default async function OwnerPage({ params }: OwnerPageProps) {
    const { id } = await params;

    return (
        <OwnerClient id={id}></OwnerClient>
    )
}