'use strict';

// Simulated database of banned device IDs
let bannedDevices = new Set();

// One-way hash function
async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Ban a device
async function banDevice(deviceID) {
    const hashedID = await hash(deviceID);
    bannedDevices.add(hashedID);
    return true;
}

// Unban a device
async function unbanDevice(deviceID) {
    const hashedID = await hash(deviceID);
    return bannedDevices.delete(hashedID);
}

// Check if a device is banned
async function isDeviceBanned(deviceID) {
    const hashedID = await hash(deviceID);
    return bannedDevices.has(hashedID);
}

// Export the API functions
export { banDevice, unbanDevice, isDeviceBanned };