import { ownerDeletedHandler } from "./handlers/ownerDeletedHandler";

const handlers: Record<string, (data: any) => Promise<void>> = {
    OWNER_DELETED: ownerDeletedHandler,
};

export const routeEvent = async (key: string, value: any) => {
    const handler = handlers[key];

    if (!handler) {
        console.warn(`No handler found for event key: ${key}`);
        return;
    }

    await handler(value);
};
