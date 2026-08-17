const mongoose = require('mongoose');
const dns = require('dns');

// Fix: c-ares (Node.js built-in DNS used by the MongoDB driver) is configured
// to query 127.0.0.1 (localhost) on this machine. There is no DNS service on
// localhost, so every dns.resolve*() call returns ECONNREFUSED.
// Override the DNS servers to use Cloudflare and Google before connecting.
dns.setServers(['1.1.1.1', '8.8.8.8']);

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Add it to backend/.env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    family: 4, // Prefer IPv4 to avoid IPv6 DNS lookup issues
  });
  console.log('[db] Connected to MongoDB:', mongoose.connection.name);
  return mongoose.connection;
}

module.exports = connectDB;
