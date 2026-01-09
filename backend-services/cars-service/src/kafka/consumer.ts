import { Kafka } from "kafkajs";
import { routeEvent } from "./eventRouter";

const kafka = new Kafka({
    clientId: "cars-service",
    brokers: [process.env.KAFKA_BROKER!],
});

export const consumer = kafka.consumer({ groupId: "cars-group" });

export const startConsumer = async () => {
    await consumer.connect();
    await consumer.subscribe({ topic: "owner-events", fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const key = message.key?.toString();
            const value = JSON.parse(message.value!.toString());

            console.log(`Received event ${key}:`, value);

            if (key) {
                await routeEvent(key, value);
            }
        },
    });
};
