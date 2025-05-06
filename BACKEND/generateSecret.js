const crypto = require('crypto');

// Generate a random 64-byte key and encode it in base64
const secretKey = crypto.randomBytes(64).toString('base64');
console.log("Generated Secret Key:", secretKey);
