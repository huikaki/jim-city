// Fields that must never be exposed to the public (unauthenticated) API.
// Admins (valid JWT) still receive the full record.
const SENSITIVE_FIELDS = ['email', 'contactNumber', 'address', 'dateOfBirth'];

// Strip sensitive fields from a maid document (handles Mongoose docs or plain objects).
function sanitizeMaid(maid) {
  const obj = maid && typeof maid.toObject === 'function' ? maid.toObject() : { ...maid };
  SENSITIVE_FIELDS.forEach((f) => { delete obj[f]; });
  return obj;
}

module.exports = { sanitizeMaid, SENSITIVE_FIELDS };
