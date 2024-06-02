import { KAFKA_CONSUMER_GROUP_ID, KAFKA_TOPIC } from "./EviromentsVariables";

export const setOffsetConfigs = {
    groupId: KAFKA_CONSUMER_GROUP_ID,
    topic: KAFKA_TOPIC,
    partitions: [
        {
            partition: 1,
            offset: "0",
        }
    ],
};

export const resetOffestConfigs = {
    groupId: KAFKA_CONSUMER_GROUP_ID,
    topic: KAFKA_TOPIC,
    earliest: true,
};