import { Kafka } from "kafkajs";

export const kafka = new Kafka({
    clientId: "owners-service",
    brokers: [process.env.KAFKA_BROKER!],
});

export const kafkaProducer = kafka.producer();

export async function initKafkaProducer() {
    await kafkaProducer.connect();
    console.log("Kafka Producer connected");
}
