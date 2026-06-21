const Busboy = require('busboy');

// Parse an incoming request body for the maid endpoints.
//
// The frontend submits `multipart/form-data` (so it can attach a photo).
// Vercel serverless functions do NOT parse multipart automatically, so we
// do it here with busboy. The uploaded photo is returned as a base64 data
// URI (stored directly in MongoDB) — this avoids needing external object
// storage and survives Vercel's ephemeral filesystem.
//
// JSON / urlencoded bodies (already parsed by Vercel) are passed through.
//
// Returns a plain object of the maid fields, with the JSON-encoded array
// fields parsed back into arrays and `profilePhoto` set to the data URI.

const ARRAY_FIELDS = ['languages', 'skills', 'previousEmployment', 'specialSkills', 'personalInformation'];
const INT_FIELDS = ['height', 'weight', 'workExperience', 'numberOfBrothers', 'numberOfSisters'];
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB

function coerce(fields) {
  const data = { ...fields };

  ARRAY_FIELDS.forEach((key) => {
    if (typeof data[key] === 'string') {
      try { data[key] = JSON.parse(data[key] || '[]'); } catch { data[key] = []; }
    }
  });

  INT_FIELDS.forEach((key) => {
    if (data[key] !== undefined && data[key] !== '' && data[key] !== null) {
      const n = parseInt(data[key], 10);
      if (!Number.isNaN(n)) data[key] = n;
    } else if (data[key] === '') {
      delete data[key];
    }
  });

  if (data.dateOfBirth) {
    const d = new Date(data.dateOfBirth);
    if (!Number.isNaN(d.getTime())) data.dateOfBirth = d;
    else delete data.dateOfBirth;
  }

  return data;
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';

    // Already-parsed JSON / urlencoded body
    if (!contentType.includes('multipart/form-data')) {
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      return resolve(coerce(body));
    }

    let busboy;
    try {
      busboy = Busboy({ headers: req.headers, limits: { fileSize: MAX_FILE_BYTES } });
    } catch (err) {
      return reject(err);
    }

    const fields = {};
    let fileDataUri = null;
    let fileTooLarge = false;

    busboy.on('field', (name, val) => { fields[name] = val; });

    busboy.on('file', (name, stream, info) => {
      const chunks = [];
      stream.on('data', (d) => chunks.push(d));
      stream.on('limit', () => { fileTooLarge = true; });
      stream.on('end', () => {
        if (!fileTooLarge && chunks.length) {
          const mime = (info && info.mimeType) || 'image/jpeg';
          fileDataUri = `data:${mime};base64,${Buffer.concat(chunks).toString('base64')}`;
        }
      });
    });

    busboy.on('error', reject);
    busboy.on('close', () => {
      const data = coerce(fields);
      if (fileDataUri) data.profilePhoto = fileDataUri;
      resolve(data);
    });

    // Vercel may hand us either an intact readable stream or an already-read
    // body (Buffer / string). Support both so this works across runtimes.
    const alreadyRead = req.readableEnded || req.body !== undefined;
    if (req.pipe && req.readable && !alreadyRead) {
      req.pipe(busboy);
    } else if (Buffer.isBuffer(req.body)) {
      busboy.end(req.body);
    } else if (typeof req.body === 'string') {
      busboy.end(Buffer.from(req.body));
    } else {
      // Nothing usable to parse
      busboy.end();
    }
  });
}

module.exports = { parseForm };
