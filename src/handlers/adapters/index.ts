import { ConsumerConfig, ConsumerSubscribeTopics, EachBatchPayload, EachMessagePayload, Kafka, KafkaConfig, Message, Partitioners, Producer, ProducerConfig, ProducerRecord } from "kafkajs";
import { CONSUMER_MAX_BATCH_SIZE, KAFKA_APP_CLIENT_ID, KAFKA_BROKERS, KAFKA_CONSUMER_GROUP_ID, KAFKA_KEY, KAFKA_SCHEMA_ID, KAFKA_SCHEMA_REGISTRY_HOST, KAFKA_SCHEMA_REGISTRY_KEY, KAFKA_SCHEMA_REGISTRY_SECRET, KAFKA_SECRET, KAFKA_TOPIC } from "../configs/EviromentsVariables";
import { schemaRegistry } from "../schemasRegistry";
import { Event } from "../events";
import { KafkaClient, MessageWithSchema } from "schema-safe-kafkajs";
import { SchemaRegistryAPIClientArgs } from "@kafkajs/confluent-schema-registry/dist/api";

export abstract class BaseKafkaAdapter {
    protected _kafkaClient: Kafka;
    protected _config: KafkaConfig;
    protected _topics: string;
    protected _groupId: string | RegExp;
    protected _producerConfig: ProducerConfig;
    protected _kafkaSchemaID: number;
    protected _consumerConfig: ConsumerConfig;
    protected _consumerSubscribeTopics: ConsumerSubscribeTopics;
    protected _result: Array<any>;
    
    constructor(config: KafkaConfig= null) {
        if (config) {
            this._kafkaClient = new Kafka(config);
        } else {
            this._config = {
                brokers: KAFKA_BROKERS,
                ssl: true,
                sasl: {
                    mechanism: "plain",
                    username: KAFKA_KEY,
                    password: KAFKA_SECRET,
                }
            }
            this._kafkaClient = new Kafka(this._config);
        }
        if (!this._producerConfig) {
            this._producerConfig = {
                idempotent: true,
            }
        }
        if (!this._consumerConfig) {
            this._consumerConfig = {
                groupId: KAFKA_CONSUMER_GROUP_ID
            }
        }
        if (!this._consumerSubscribeTopics) {
            this._consumerSubscribeTopics = {
                topics: [this._topics],
                fromBeginning: true,
            };            
        }
    }
    public getKafkaClient(): Kafka {
        return this._kafkaClient;
    }

    public setKafkaClient(client: Kafka): void {
        this._kafkaClient = client;
    }

    public topics(topics: string): BaseKafkaAdapter {
        this._topics = topics;
        return this;
    }

    public group(groupId: string): BaseKafkaAdapter {
        this._groupId = groupId;
        return this;
    }

    public schema(schemaID: number): BaseKafkaAdapter {
        this._kafkaSchemaID = schemaID;
        return this;
    }

    abstract produce(message: Array<Event<any>>): Promise<void>;
    abstract consume(): Promise<Array<any>>;
    abstract messageHandler(payload: EachMessagePayload, result: Array<any>): Promise<void>;
    abstract batchHandler(payload: EachBatchPayload, result: Array<any>): Promise<void>;
}

export class LedgerKafkaAdapter extends BaseKafkaAdapter {
    
    async produce(messages: Event<any>[]): Promise<void> {
        if (!this._kafkaClient) {
            throw new Error("Kafka client not initialized");
        }
        if (!this._topics) {
            throw new Error("Topics not defined");
        }
        if (!this._kafkaSchemaID) {
            throw new Error("Schema ID not defined");
        }
        if (!this._producerConfig) {
            throw new Error("Producer config not defined");
        }
        const producer: Producer = this._kafkaClient.producer(this._producerConfig);
        await producer.connect();
        try {
            let messagesData = messages.map(async (element): Promise<Message> => {
                const encodedMessage: Buffer = await schemaRegistry.encode(this._kafkaSchemaID, element.data);
                return {
                    key: element.key,
                    value: encodedMessage,
                    timestamp: element.timestamp,
                    partition: element.partition?? null,
                    headers: element.headers?? '',
                } 
            });
            const producerRecord: ProducerRecord = {
                topic: this._topics,
                messages: await Promise.all(messagesData),
            }
            await producer.send(producerRecord);
        } catch (error) {
            console.log(`Error producing message: ${error}`);
            throw error;
        } finally {
            await producer.disconnect();
        }
    }

    async consume(): Promise<Array<any>> {
        if (!this._kafkaClient) {
            throw new Error("Kafka client not initialized");
        }
        if (!this._topics) {
            throw new Error("Topics not defined");
        }
        if (!this._consumerConfig) {
            throw new Error("Consumer config not defined");
        }
        if (!this._groupId) {
            throw new Error("Group ID not defined");
        }
    
        const consumer = this._kafkaClient.consumer(this._consumerConfig);
        await consumer.connect();
        try {
            const consumerTopics: ConsumerSubscribeTopics = {
                topics: [this._topics],
                fromBeginning: false,
            };
            await consumer.subscribe(consumerTopics);
    
            let result: Array<any> = [];
            await consumer.run({
                eachMessage: async (payload) => {
                    await this.messageHandler(payload, result);
                },
                eachBatch: async (payload) => {
                    await this.batchHandler(payload, result);
                },
                eachBatchAutoResolve: true,
                
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            return result;
        } catch (error) {
            console.log(`Error consuming message: ${error}`);
            await consumer.disconnect();
            throw error;
        }
    }

    async messageHandler(payload: EachMessagePayload, result: Array<any>): Promise<void> {
        const encodedValue = payload.message.value;
        const decodeValue = await schemaRegistry.decode(encodedValue);
        result.push(decodeValue);
    }

    async batchHandler(payload: EachBatchPayload, result: Array<any>): Promise<void> {
        const { batch, resolveOffset, heartbeat, isRunning, isStale } = payload;
        const messages = batch.messages;
        for(let message of messages) {
            const encodedValue = message.value;
            const decodeValue = await schemaRegistry.decode(encodedValue);
            resolveOffset(message.offset);
            result.push(decodeValue);
            await heartbeat();
        }
    }
}

export class CustomKafkaAdapter {

    private _kafkaClient: KafkaClient;
    private _config: KafkaConfig;
    private _schemaRegistry: SchemaRegistryAPIClientArgs;
    private _producerConfig: ProducerConfig;
    private _kafkaSchemaID: number;
    private _topics: string;
    constructor() {
        if(!this._config) {
            this._config = {
                clientId: KAFKA_APP_CLIENT_ID,
                brokers: KAFKA_BROKERS,
                ssl: true,
                sasl: {
                    mechanism: "plain",
                    username: KAFKA_KEY,
                    password: KAFKA_SECRET
                }
            };
        }
        if (!this._schemaRegistry) {
            this._schemaRegistry = {
                host: KAFKA_SCHEMA_REGISTRY_HOST,
                auth: {
                    username: KAFKA_SCHEMA_REGISTRY_KEY,
                    password: KAFKA_SCHEMA_REGISTRY_SECRET
                }
            }
        }
        this._kafkaClient = new KafkaClient({
            cluster: this._config,
            schemaRegistry: this._schemaRegistry,
        });
        this._producerConfig = {
            createPartitioner: Partitioners.LegacyPartitioner,
            allowAutoTopicCreation: false,
            idempotent: true,
        }
        if (!this._kafkaSchemaID) {
            this._kafkaSchemaID = KAFKA_SCHEMA_ID;
        }
        if (!this._topics) {
            this._topics = KAFKA_TOPIC;
        }
    }

    async produce(messages: Event<any>[]): Promise<void> {
        if (!this._kafkaClient) {
            throw new Error("Kafka client not initialized");
        }
        if (!this._topics) {
            throw new Error("Topics not defined");
        }
        if (!this._kafkaSchemaID) {
            throw new Error("Schema ID not defined");
        }
        if (!this._producerConfig) {
            throw new Error("Producer config not defined");
        }
        const producer = this._kafkaClient.producer(this._producerConfig);
        await producer.connect();
        const messagesData = messages.map((message): MessageWithSchema => {                
            return {
                key: message.key,
                value: message.data,
                headers: message.headers?? {},
                timestamp: message.timestamp,
                schemaId: message.schemaId?? this._kafkaSchemaID,
        }});
        await this._kafkaClient.publish(producer, {
            topic: this._topics,
            messages: messagesData
        });
    
        await producer.disconnect()
    }

    async messageHandler(payload: EachMessagePayload): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async batchHandler(payload: EachBatchPayload): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async consume(): Promise<any> {
        throw new Error("Method not implemented.");
    }
}