'use strict';

import { banDevice, unbanDevice, isDeviceBanned } from './banApi.js';

// Secure random ID generation
function generateSecureID() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Admin panel functionality
function setupAdminPanel() {
    const adminPassword = '6vC9vp4d'; // Change this to your desired password
    const enteredPassword = prompt('Enter admin password:');
    
    if (enteredPassword === adminPassword) {
        document.getElementById('adminPanel').classList.remove('hide');
        
        const banButton = document.getElementById('banButton');
        const unbanButton = document.getElementById('unbanButton');
        const deviceIdInput = document.getElementById('deviceIdInput');
        const banMessage = document.getElementById('banMessage');
        
        banButton.addEventListener('click', async () => {
            const deviceIdToBan = deviceIdInput.value.trim();
            if (deviceIdToBan) {
                await banDevice(deviceIdToBan);
                banMessage.textContent = `Device ${deviceIdToBan} has been banned.`;
                deviceIdInput.value = '';
            } else {
                banMessage.textContent = 'Please enter a valid Device ID.';
            }
        });

        unbanButton.addEventListener('click', async () => {
            const deviceIdToUnban = deviceIdInput.value.trim();
            if (deviceIdToUnban) {
                const unbanned = await unbanDevice(deviceIdToUnban);
                if (unbanned) {
                    banMessage.textContent = `Device ${deviceIdToUnban} has been unbanned.`;
                } else {
                    banMessage.textContent = `Device ${deviceIdToUnban} was not banned.`;
                }
                deviceIdInput.value = '';
            } else {
                banMessage.textContent = 'Please enter a valid Device ID.';
            }
        });
    }
}

// Main function
(async function() {
    // Setup admin panel first
    setupAdminPanel();

    let deviceID = localStorage.getItem('deviceID');
    if (!deviceID) {
        deviceID = generateSecureID();
        localStorage.setItem('deviceID', deviceID);
    }

    // Check if the device is banned
    let isBanned = await isDeviceBanned(deviceID);

    if (isBanned) {
        document.getElementById('message').textContent = `You have been banned. Your DeviceID is ${deviceID}`;
        localStorage.setItem('banned', 'true');
    } else {
        document.getElementById('message').textContent = 'Welcome! You are not banned.';
    }

    // Use a closure to protect the ban status
    const banStatus = { isBanned: isBanned };
    Object.freeze(banStatus);

    // Override localStorage methods
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        if (key === 'banned' || key === 'deviceID') {
            console.error('Attempt to modify ban status detected');
            return;
        }
        originalSetItem.call(localStorage, key, value);
    };

    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = function(key) {
        if (key === 'banned' || key === 'deviceID') {
            console.error('Attempt to remove ban status detected');
            return;
        }
        originalRemoveItem.call(localStorage, key);
    };

    // Regularly check and reinforce ban status
    setInterval(async function() {
        const currentIsBanned = await isDeviceBanned(deviceID);
        if (currentIsBanned !== banStatus.isBanned) {
            localStorage.setItem('banned', 'true');
            location.reload();
        }
    }, 5000); // Check every 5 seconds

    // Prevent tampering with window object
    Object.freeze(window);

    // Prevent access to DevTools (this is not foolproof but adds another layer)
    document.addEventListener('contextmenu', event => event.preventDefault());

    document.onkeydown = function(e) {
        if (e.keyCode == 123) { // F12 key
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) { // Ctrl+Shift+I
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) { // Ctrl+Shift+C
            return false;
        }
        if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) { // Ctrl+Shift+J
            return false;
        }
        if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) { // Ctrl+U
            return false;
        }
    };
})();
