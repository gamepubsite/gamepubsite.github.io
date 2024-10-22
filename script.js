// Use strict mode to catch more potential errors
        'use strict';

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

        // Simulated server-side ban check (in reality, this would be an API call)
        async function checkBanStatus(deviceID) {
            const hashedID = await hash(deviceID);
            // Simulated server-side check
            return true; // Always return true to simulate a permanent ban
        }


        // Main function
        (async function() {
            // Setup admin panel first

            let deviceID = localStorage.getItem('deviceID');
            if (!deviceID) {
                deviceID = generateSecureID();
                localStorage.setItem('deviceID', deviceID);
            }
            
            const isBanned = await checkBanStatus(deviceID);
            
            if (isBanned) {
                document.getElementById('message').textContent = `You have been banned. Your DeviceID is ${deviceID}`;
                localStorage.setItem('banned', 'true');
            } else {
                document.getElementById('message').textContent = 'An error occurred while processing your request.';
            }

            // Use a closure to protect the ban status
            const banStatus = { isBanned: isBanned };
            Object.freeze(banStatus);

            // Override localStorage methods
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                if (key === 'banned' || key === 'dev') {
                    localStorage.setItem('banned', 'true');
                    console.error('Attempt to modify ban status detected');
                    return;
                }
                originalSetItem.call(localStorage, key, value);
            };

            const originalRemoveItem = localStorage.removeItem;
            localStorage.removeItem = function(key) {
                if (key === 'banned' || key === 'deviceID') {
                    localStorage.setItem('banned', 'true');
                    console.error('Attempt to remove ban status detected');
                    return;
                }
                originalRemoveItem.call(localStorage, key);
            };

            // Regularly check and reinforce ban status
            setInterval(async function() {
                const currentIsBanned = await checkBanStatus(deviceID);
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
