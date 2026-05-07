// Function used and remade from own older project: https://github.com/DiegoR03/Portfolio-Website/blob/main/js/backgroundIcon.js
// Hulp van Gemini: https://gemini.google.com/share/fc9e9c0da979
function createGlobalStarField() {
    const oldCanvas = document.getElementById('global-star-canvas');
    if (oldCanvas) oldCanvas.remove();

    const canvas = document.createElement('canvas');
    canvas.id = 'global-star-canvas';
    const context = canvas.getContext('2d');

    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: -1;
    `;

    document.body.prepend(canvas);

    let stars = [];

    const initStars = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        stars = [];
        for (let i = 0; i < 400; i++) {
            const type = Math.random();
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: type < 0.1 ? Math.random() * 1 + 1.5 : Math.random() * 1 + 0.5,
                baseBrightness: type < 0.8 ? Math.random() * 0.3 + 0.4 : Math.random() * 0.4 + 0.1,
                twinkleSpeed: Math.random() * 0.01 + 0.01,
                phase: Math.random() * Math.PI * 2,
                isTwinkling: Math.random() > 0.3
            });
        }
    };

    function animate() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            let currentOpacity = star.baseBrightness;

            if (star.isTwinkling) {
                star.phase += star.twinkleSpeed;
                currentOpacity = star.baseBrightness + (Math.sin(star.phase) * 0.3);
            }

            context.save();
            context.globalAlpha = Math.max(0.1, currentOpacity);
            context.fillStyle = star.baseBrightness > 0.5 ? `rgba(249,255,204,1)` : `rgba(200,220,255,1)`;
            context.beginPath();
            context.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            context.fill();
            context.restore();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        initStars();
    });

    initStars();
    animate();
}

document.addEventListener('DOMContentLoaded', createGlobalStarField);