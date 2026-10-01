/**
 * Cloudflare Worker type definitions
 */

// Cloudflare D1 Database types
export interface D1Database {
  prepare(sql: string): D1PreparedStatement;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first(columnName?: string): Promise<any>;
  all(): Promise<D1Result>;
  run(): Promise<D1Result>;
}

export interface D1Result {
  success: boolean;
  results?: any[];
  meta?: {
    duration: number;
    last_row_id: number;
    changes: number;
    served_by: string;
    internal_stats: string;
  };
}

// Cloudflare R2 Bucket types
export interface R2Bucket {
  put(key: string, value: BodyInit, options?: R2PutOptions): Promise<R2Object | null>;
  get(key: string): Promise<R2Object | null>;
  delete(key: string | string[]): Promise<void>;
  list(options?: R2ListOptions): Promise<R2Objects>;
}

export interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  writeHttpMetadata(headers: Headers): void;
  readonly body: ReadableStream<Uint8Array>;
}

export interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
  delimiters?: string[];
}

export interface R2PutOptions {
  onlyIf?: any;
  httpMetadata?: Record<string, string>;
  customMetadata?: Record<string, string>;
}

export interface R2ListOptions {
  limit?: number;
  prefix?: string;
  cursor?: string;
  delimiter?: string;
  include?: string[];
}

type BodyInit = ReadableStream<any> | ArrayBuffer | ArrayBufferView | Blob | FormData | URLSearchParams | ReadableStream<Uint8Array> | string;

declare global {
  interface CloudflareEnvironment {
    DB: D1Database;
    R2_BUCKET: R2Bucket;
    MONGODB_API_KEY: string;
    MONGODB_API_URL: string;
    MONGODB_DATABASE: string;
  }
}

export {};
