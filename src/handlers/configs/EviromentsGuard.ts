type Enviroments = 'development' | 'production' | 'testing';

export const NODE_ENV = (nodeEnv: string | undefined): Enviroments => {
    const environments: Enviroments[] = ['development', 'production', 'testing'];
    
    if (!(environments as string[]).includes(nodeEnv ?? '')) {
        throw new Error(
            `Invalid NODE_ENV: "process.env.NODE_ENV". Allowed values are: ${environments.join(', ')}`
        );
    }
    return nodeEnv as Enviroments;
}

export const KAFKA_BROKERS = (kafkaBrokers: string): string[] => {
    if (kafkaBrokers.trim() === ''){
        throw new Error('process.env.KAFKA_BROKERS is required');
    }
    return kafkaBrokers.split(',');
};

export const KAFKA_KEY = (kafkaKey: string): string => {
    if (kafkaKey.trim() === ''){
        throw new Error('process.env.KAFKA_KEY is required');
    }
    return kafkaKey;
};

export const KAFKA_SECRET = (kafkaSecret: string): string => {
    if (kafkaSecret.trim() === ''){
        throw new Error('process.env.KAFKA_SECRET is required');
    }
    return kafkaSecret;
}

export const KAFKA_SCHEMA_REGISTRY_HOST = (schemaRegistryHost: string): string => {
    if (schemaRegistryHost.trim() === ''){
        throw new Error('process.env.KAFKA_SCHEMA_REGISTRY_HOST is required');
    }
    return schemaRegistryHost;
}

export const KAFKA_SCHEMA_REGISTRY_KEY = (schemaRegistryKey: string): string => {
    if (schemaRegistryKey.trim() === ''){
        throw new Error('process.env.KAFKA_SCHEMA_REGISTRY_KEY is required');
    }
    return schemaRegistryKey;
}

export const KAFKA_SCHEMA_REGISTRY_SECRET = (schemaRegistrySecret: string): string => {
    if (schemaRegistrySecret.trim() === ''){
        throw new Error('process.env.KAFKA_SCHEMA_REGISTRY_SECRET is required');
    }
    return schemaRegistrySecret;
}

export const KAFKA_TOPIC = (kafkaTopic: string): string => {
    if (kafkaTopic.trim() === ''){
        throw new Error('process.env.KAFKA_TOPIC is required');
    }
    return kafkaTopic;
}

export const KAFKA_SCHEMA_ID = (schemaId: string): number => {
    if (schemaId.trim() === ''){
        throw new Error('process.env.KAFKA_SCHEMA_ID is required');
    }
    return parseInt(schemaId);
};

export const KAFKA_CONSUMER_GROUP_ID = (consumerGroupId: string): string => {
    if (consumerGroupId.trim() === ''){
        throw new Error('process.env.KAFKA_CONSUMER_GROUP_ID is required');
    }
    return consumerGroupId;
}

export const CONSUMER_MAX_BATCH_SIZE = (maxBatchSize: string): number => {
    if (maxBatchSize.trim() === ''){
        throw new Error('process.env.CONSUMER_MAX_BATCH_SIZE is required');
    }
    return parseInt(maxBatchSize);
};

export const KAFKA_APP_CLIENT_ID = (clientId: string): string => {
    if (clientId.trim() === ''){
        throw new Error('process.env.KAFKA_APP_CLIENT_ID is required');
    }
    return clientId;
};