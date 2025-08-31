// The `minio` package may export differently depending on CommonJS/ESModule interop.
// Use a require fallback to ensure `Client` is available at runtime.
const Minio: any = (() => {
  try {
    // prefer require for runtime compatibility in ts-node
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('minio');
  } catch (e) {
    // If require fails, try dynamic import shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = (global as any).Minio || {};
    return mod;
  }
})();

const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT || '127.0.0.1';
const MINIO_PORT = parseInt(process.env.MINIO_PORT || '9000', 10);
const MINIO_USE_SSL = (process.env.MINIO_USE_SSL || 'false') === 'true';
const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY || 'minioadmin';
const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'minioadmin';
const MINIO_BUCKET = process.env.MINIO_BUCKET || 'morpho-media';
const MINIO_PUBLIC_URL = process.env.MINIO_PUBLIC_URL || `http://${MINIO_ENDPOINT}:${MINIO_PORT}`;

const client = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: MINIO_PORT,
  useSSL: MINIO_USE_SSL,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

export const MinioService = {
  ensureBucket: async (bucket: string = MINIO_BUCKET) => {
    const exists = await client.bucketExists(bucket);
    if (!exists) {
      await client.makeBucket(bucket, 'us-east-1');
      console.log(`✅ Created MinIO bucket: ${bucket}`);
    }
    return bucket;
  },

  uploadBuffer: async (buffer: Buffer, objectName: string, contentType = 'application/octet-stream', bucket: string = MINIO_BUCKET) => {
    await MinioService.ensureBucket(bucket);
    // putObject supports Buffer
    await client.putObject(bucket, objectName, buffer, { 'Content-Type': contentType });
    const url = `${MINIO_PUBLIC_URL}/${bucket}/${encodeURIComponent(objectName)}`;
    return url;
  },

  presignedGetUrl: async (objectName: string, expires = 24 * 60 * 60, bucket: string = MINIO_BUCKET) => {
    // expires in seconds
    const url = await client.presignedGetObject(bucket, objectName, expires);
    return url;
  },

  removeObject: async (objectName: string, bucket: string = MINIO_BUCKET) => {
    await client.removeObject(bucket, objectName);
  }
};

export default client;
