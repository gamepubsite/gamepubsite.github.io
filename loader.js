document.addEventListener('DOMContentLoaded', () => {
    const progress = document.querySelector('.progress');
    const loadingText = document.querySelector('.loading-text');
    const texts = ['Initializing GamePubV3', 'Loading Assets', 'Preparing Environment', 'Establishing Connection'];
    let loadProgress = 0;
    let textIndex = 0;

    // Create floating particles
    const particleField = document.querySelector('.particle-field');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: #00ffff;
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            transform: translateZ(${Math.random() * 200 - 100}px);
            animation: float ${5 + Math.random() * 5}s linear infinite;
        `;
        particleField.appendChild(particle);
    }

    const startGame = () => {
        document.querySelector('.press-key').style.animation = 'fadeOut 0.5s forwards';
        document.querySelector('.quantum-container').style.animation = 'fadeOut 1s ease-out forwards';
        setTimeout(() => {
            window.location.href = 'game.html';
        }, 1000);
    };

    const interval = setInterval(() => {
        loadProgress += Math.random() * 10;
        if (loadProgress > 100) {
            loadProgress = 100;
            clearInterval(interval);
            document.querySelector('.press-key').style.display = 'block';
        }
        progress.style.width = `${loadProgress}%`;
        
        // Update loading text
        if (loadProgress > textIndex * 25) {
            loadingText.textContent = texts[textIndex % texts.length];
            textIndex++;
        }
    }, 200);

    // Click anywhere to start
    document.addEventListener('click', () => {
        if (progress.style.width === '100%') {
            startGame();
        }
    });
});

// Add fade out keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes float {
        0% { transform: translateZ(-100px) rotate(0deg); }
        100% { transform: translateZ(100px) rotate(360deg); }
    }
`;
document.head.appendChild(style);
