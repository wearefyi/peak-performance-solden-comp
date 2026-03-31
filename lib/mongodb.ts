import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn('[MongoDB] MONGODB_URI not configured');
}

const options = {
  maxPoolSize: 1,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
  socketTimeoutMS: 8000,
  retryWrites: true,
  retryReads: true,
};

let cachedClient: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

function getMongoClient(): Promise<MongoClient> {
  if (!uri) {
    return Promise.reject(new Error('MongoDB URI is not configured'));
  }

  if (cachedClient) {
    return Promise.resolve(cachedClient);
  }

  if (clientPromise) {
    return clientPromise;
  }

  const client = new MongoClient(uri, options);

  clientPromise = client.connect()
    .then((connectedClient) => {
      cachedClient = connectedClient;
      clientPromise = null;
      return connectedClient;
    })
    .catch((error) => {
      clientPromise = null;
      cachedClient = null;
      throw error;
    });

  return clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient();
  return client.db('peak_performance_solden');
}
