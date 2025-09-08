const fs = require('fs');

// Read the seed file
let seedContent = fs.readFileSync('seed.js', 'utf8');

// Add maidIds to all maids that don't have them
let maidCounter = 2; // Start from 2 since Maria Santos is already AA0001
seedContent = seedContent.replace(/\{\s*name: '([^']+)'/g, (match, name) => {
  const maidId = 'AA' + String(maidCounter).padStart(4, '0');
  maidCounter++;
  return `{\n    maidId: '${maidId}',\n    name: '${name}'`;
});

// Write back to file
fs.writeFileSync('seed.js', seedContent);
console.log(`✅ Added maidIds to ${maidCounter - 1} maids`);