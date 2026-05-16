import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requiredEnv } from './config';

export type BucketKind = 'wedding' | 'guest';

function baseClient(endpoint: string) {
  return new S3Client({
    region: process.env.S3_REGION ?? 'us-east-1',
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId: requiredEnv('S3_ACCESS_KEY_ID'),
      secretAccessKey: requiredEnv('S3_SECRET_ACCESS_KEY'),
    },
  });
}

export const s3 = baseClient(requiredEnv('S3_ENDPOINT'));
const publicPresignClient = baseClient(requiredEnv('S3_PUBLIC_ENDPOINT'));

export function bucketName(kind: BucketKind) {
  return kind === 'wedding' ? requiredEnv('S3_BUCKET_WEDDING') : requiredEnv('S3_BUCKET_GUEST');
}

export function publicObjectUrl(kind: BucketKind, key: string) {
  return `${requiredEnv('S3_PUBLIC_ENDPOINT').replace(/\/$/, '')}/${bucketName(kind)}/${key}`;
}

export async function createPutUrl(kind: BucketKind, key: string, contentType: string) {
  return getSignedUrl(
    publicPresignClient,
    new PutObjectCommand({ Bucket: bucketName(kind), Key: key, ContentType: contentType }),
    { expiresIn: 600 },
  );
}

export async function createGetUrl(kind: BucketKind, key: string) {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucketName(kind), Key: key }), { expiresIn: 600 });
}

export async function deleteObject(kind: BucketKind, key: string) {
  await s3.send(new DeleteObjectCommand({ Bucket: bucketName(kind), Key: key }));
}

export async function objectToBuffer(kind: BucketKind, key: string) {
  const object = await s3.send(new GetObjectCommand({ Bucket: bucketName(kind), Key: key }));
  const chunks: Buffer[] = [];
  for await (const chunk of object.Body as AsyncIterable<Uint8Array>) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}
