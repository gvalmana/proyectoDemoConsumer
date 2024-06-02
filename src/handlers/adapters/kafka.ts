import { Kafka, KafkaConfig } from "kafkajs";
import { KAFKA_BROKERS, KAFKA_KEY, KAFKA_SECRET } from "../configs/EviromentsVariables";

const config: KafkaConfig = {
    brokers: KAFKA_BROKERS,
    ssl: true,
    sasl: {
        mechanism: "plain",
        username: KAFKA_KEY,
        password: KAFKA_SECRET,
    },
};

export const kafkaClient  = new Kafka(config);