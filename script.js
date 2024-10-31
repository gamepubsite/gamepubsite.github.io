'use strict';



function reset() {
            localStorage.setItem('Halloween', 'false');
            localStorage.setItem('Dark', 'false');
            localStorage.setItem('Christmas', 'false');
            document.body.classList.remove('dark-mode');
            document.body.classList.remove('halloween-mode');
            document.body.classList.remove('christmas-mode');
        }

        // Check and apply dark mode state from localStorage
        if (localStorage.getItem('Dark') === 'true') {
            document.body.classList.add('dark-mode');
        }

        // Check and apply Halloween mode state from localStorage
        if (localStorage.getItem('Halloween') === 'true') {
            document.body.classList.add('halloween-mode');
        }
        
        if (localStorage.getItem('Christmas') === 'true') {
            document.body.classList.add('christmas-mode');
        }

        function dark() {
            document.body.classList.remove('halloween-mode');
            document.body.classList.remove('christmas-mode');
            localStorage.setItem('Halloween', 'false');
            localStorage.setItem('Christmas', 'false');
            if (document.body.classList.contains('dark-mode')) {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('Dark', 'false');
            } else {
                document.body.classList.add('dark-mode');
                localStorage.setItem('Dark', 'true');
            }
        }

        function halloween() {
            /*document.body.classList.remove('dark-mode');
            document.body.classList.remove('christmas-mode');
            localStorage.setItem('Dark', 'false');
            localStorage.setItem('Christmas', 'false');
            if (document.body.classList.contains('halloween-mode')) {
                document.body.classList.remove('halloween-mode');
                localStorage.setItem('Halloween', 'false');
            } else {
                document.body.classList.add('halloween-mode');
                localStorage.setItem('Halloween', 'true');
            }*/
        }
        function christmas() {
            document.body.classList.remove('dark-mode');
            document.body.classList.remove('halloween-mode');
            localStorage.setItem('Dark', 'false');
            localStorage.setItem('Halloween', 'false');
            if (document.body.classList.contains('christmas-mode')) {
                document.body.classList.remove('christmas-mode');
                localStorage.setItem('Christmas', 'false');
            } else {
                document.body.classList.add('christmas-mode');
                localStorage.setItem('Christmas', 'true');
            }
        }


// Initialize variables
let deviceID = localStorage.getItem('deviceID');
let unbanned = false;

// Check for empty device ID
if (deviceID === '9f782aa2ea60f2a485c4f6a2b709999a') {
    localStorage.removeItem('banned'); // Clear all storage
    unbanned = true;
    alert('You are in the unban system.');
    window.location.href = 'index.html'
    localStorage.setItem('Unbanned', 'true');
} else if (deviceID === '5c122a64-6edb-18d8-9fc5-60063acfe3ed') {
    localStorage.removeItem('banned'); // Clear all storage
    unbanned = true;
    alert('You are in the unban system.');
    window.location.href = 'index.html'
    localStorage.setItem('Unbanned', 'true');
} else if (deviceID === '5766e91ecc45e1914d137d27f81c3de2') {
    localStorage.removeItem('banned'); // Clear all storage
    unbanned = true;
    alert('You are in the unban system.');
    window.location.href = 'index.html'
    localStorage.setItem('Unbanned', 'true');
}

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Secure random ID generation
function generateSecureID() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// One-way hash function
async function hash(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Simulated server-side ban check
async function checkBanStatus(deviceID) {
    const hashedID = await hash(deviceID);
    return !unbanned; // Return false if unbanned, true if banned
}

// Main function
(async function() {
    try {
        if (!deviceID) {
            deviceID = generateSecureID();
            localStorage.setItem('deviceID', deviceID);
            alert('You have been assigned a new device ID.');
        }
        
        const isBanned = await checkBanStatus(deviceID);
        const messageElement = document.getElementById('message');
        
        if (messageElement) {
            if (isBanned && !unbanned) {
                messageElement.textContent = `You have been banned. Your DeviceID is ${deviceID}`;
                localStorage.setItem('banned', 'true');
            } else {
                messageElement.textContent = 'Welcome! Your account is in good standing.';
            }
        }

        const banStatus = { isBanned: isBanned };
        Object.freeze(banStatus);

        // Override localStorage methods
        const originalSetItem = localStorage.setItem.bind(localStorage);
        localStorage.setItem = function(key, value) {
            if (key === 'banned' || key === 'dev') {
                if (!unbanned) {
                    originalSetItem('banned', 'true');
                    console.error('Attempt to modify ban status detected');
                    return;
                }
            }
            originalSetItem(key, value);
        };

        const originalRemoveItem = localStorage.removeItem.bind(localStorage);
        localStorage.removeItem = function(key) {
            if (key === 'banned' || key === 'deviceID') {
                if (!unbanned) {
                    originalSetItem('banned', 'true');
                    console.error('Attempt to remove ban status detected');
                    return;
                }
            }
            originalRemoveItem(key);
        };

        // Regularly check and reinforce ban status
        setInterval(async function() {
            const currentIsBanned = await checkBanStatus(deviceID);
            if (currentIsBanned !== banStatus.isBanned && !unbanned) {
                localStorage.setItem('banned', 'true');
                location.reload();
            }
        }, 5000);

        // Security measures
        try {
            Object.freeze(window);
        } catch (e) {
            console.warn('Could not freeze window object');
        }

        document.addEventListener('keydown', function(e) {
            if (
                e.keyCode === 123 || // F12
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
                (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
                (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
                (e.ctrlKey && e.keyCode === 85) // Ctrl+U
            ) {
                e.preventDefault();
                return false;
            }
        });
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
