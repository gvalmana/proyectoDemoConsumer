import { config } from 'dotenv';
import * as EnviromentGuards from './EviromentsGuard';

config({
    path: '.env',
    debug: true,
});

export const NODE_ENV = EnviromentGuards.NODE_ENV(process.env.NODE_ENV);

export const isDevelopment = NODE_ENV === 'development';
export const isProduction = NODE_ENV === 'production';
export const isTesting = NODE_ENV === 'testing';

export const KAFKA_BROKERS = EnviromentGuards.KAFKA_BROKERS(process.env.KAFKA_BROKERS);
export const KAFKA_KEY = EnviromentGuards.KAFKA_KEY(process.env.KAFKA_KEY);
export const KAFKA_SECRET = EnviromentGuards.KAFKA_SECRET(process.env.KAFKA_SECRET);
export const KAFKA_TOPIC = EnviromentGuards.KAFKA_TOPIC(process.env.KAFKA_TOPIC);
export const KAFKA_APP_CLIENT_ID = EnviromentGuards.KAFKA_APP_CLIENT_ID(process.env.KAFKA_APP_CLIENT_ID);


export const KAFKA_SCHEMA_REGISTRY_HOST = EnviromentGuards.KAFKA_SCHEMA_REGISTRY_HOST(process.env.KAFKA_SCHEMA_REGISTRY_HOST);
export const KAFKA_SCHEMA_REGISTRY_KEY = EnviromentGuards.KAFKA_SCHEMA_REGISTRY_KEY(process.env.KAFKA_SCHEMA_REGISTRY_KEY);
export const KAFKA_SCHEMA_REGISTRY_SECRET = EnviromentGuards.KAFKA_SCHEMA_REGISTRY_SECRET(process.env.KAFKA_SCHEMA_REGISTRY_SECRET);
export const KAFKA_SCHEMA_ID = EnviromentGuards.KAFKA_SCHEMA_ID(process.env.KAFKA_SCHEMA_ID ?? '100001');
export const KAFKA_CONSUMER_GROUP_ID = EnviromentGuards.KAFKA_CONSUMER_GROUP_ID(process.env.KAFKA_CONSUMER_GROUP_ID ?? 'test-group');

export const CONSUMER_MAX_BATCH_SIZE = EnviromentGuards.CONSUMER_MAX_BATCH_SIZE(process.env.CONSUMER_MAX_BATCH_SIZE ?? '10');