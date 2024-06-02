import { v4 as uuid } from 'uuid';
import { Journal, Product } from '../models';
import { KAFKA_SCHEMA_ID } from '../configs/EviromentsVariables';

export abstract class Event<T> {
    protected _data: T;
    protected _key: string;
    protected _timestamp: string;
    protected _topic?: string;
    protected _groupId?: string;
    protected _partition?: number;
    protected _headers?: any;
    protected _schemaId?: number;

    constructor(
        data: any,
        topic?: string,
        key?: string,
        timestamp?: string,
        groupId?: string,
        partition?: null | number,
        headers?: null | any
    ) {
        this._key = key?? uuid();
        this._timestamp = timestamp?? new Date().getTime().toString();
        this._data = data;
        this._topic = topic;
        this._groupId = groupId;
        this._data = data;
        this._partition = partition;
        this._headers = headers;
    }

    get key(): string {
        return this._key;
    }

    set key(value: string) {
        this._key = value;
    }

    get timestamp(): string {
        return this._timestamp;
    }

    set timestamp(value: string) {
        this._timestamp = value;
    }

    get data(): T {
        return this._data;
    }

    set data(value: T) {
        this._data = value;
    }

    get topic(): string | undefined {
        return this._topic;
    }

    set topic(value: string | undefined) {
        this._topic = value;
    }

    get groupId(): string | undefined {
        return this._groupId;
    }

    set groupId(value: string | undefined) {
        this._groupId = value;
    }

    get partition(): number | undefined {
        return this._partition;
    }

    set partition(value: number | undefined) {
        this._partition = value;
    }

    get headers(): any {
        return this._headers;
    }

    set headers(value: any) {
        this._headers = value;
    }

    get schemaId(): number | undefined {
        return this._schemaId;
    }

    set schemaId(value: number | undefined) {
        this._schemaId = value;
    }
}
export class ProductEvent extends Event<Product> {
    constructor(
        data: Product,
        topic?: string,
        key?: string,
        timestamp?: string,
        groupId?: string,
        partition?: number,
        headers?: any
    ) {
        super(data, topic, key, timestamp, groupId, partition, headers);
    }
}

export class JournalEvent extends Event<Journal> {
    constructor(
        data: Journal,
        topic?: string,
        key?: string,
        timestamp?: string,
        groupId?: string,
        partition?: number,
        headers?: any
    ) {
        super(data, topic, key, timestamp, groupId, partition, headers);
        this._schemaId = KAFKA_SCHEMA_ID;
        this._headers = {
            'applicationVersion': '1.0.0',
            timestamp: new Date().toISOString(),
        }
    }
}
