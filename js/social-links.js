// Add one object here to create another animated link ball.
const socialLinks = [
    {
        title: "GitHub",
        url: "https://github.com/daichidazo-k24",
        color: "#21242e",
        textColor: "#ffffff"
    },
    {
        title: "Password Repo",
        url: "https://github.com/daichidazo-k24/DaichiPassword-ver.1",
        color: "#3d4f97",
        textColor: "#ffffff"
    },
    {
        title: "MAP Repo",
        url: "https://github.com/daichidazo-k24/Map",
        color: "#206479",
        textColor: "#ffffff"
    },
    {
        title: "MAP Demo",
        url: "https://daichimapping.daiti-terukina-k24c.workers.dev/",
        color: "#f68d1f",
        textColor: "#ffffff"
    },
    {
        title: "Profile Repo",
        url: "https://github.com/daichidazo-k24/My-Profile",
        color: "#a7282b",
        textColor: "#ffffff"
    },

];

const ballArea = document.getElementById("socialBallArea");

if (ballArea) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ballDiameter = 88;
    const ballRadius = ballDiameter / 2;
    let animationFrameId;

    const balls = socialLinks.map((link, index) => {
        const element = document.createElement("a");
        element.className = "social-ball";
        element.href = link.url;
        element.target = "_blank";
        element.rel = "noopener noreferrer";
        element.textContent = link.title;
        element.setAttribute("aria-label", `${link.title}を新しいタブで開く`);
        element.style.setProperty("--ball-size", `${ballDiameter}px`);
        element.style.setProperty("--ball-color", link.color);
        element.style.setProperty("--ball-text", link.textColor ?? "#ffffff");
        ballArea.appendChild(element);

        const angle = (index + 1) * 1.17;
        const speed = 0.45 + (index % 3) * 0.12;

        return {
            element,
            x: ballRadius,
            y: ballRadius,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            paused: false
        };
    });

    function placeBalls() {
        const width = ballArea.clientWidth;
        const height = ballArea.clientHeight;
        const cellSize = ballDiameter + 18;
        const columns = Math.max(1, Math.floor(width / cellSize));
        const rows = Math.ceil(balls.length / columns);
        const cellWidth = width / Math.min(columns, balls.length);
        const cellHeight = height / rows;

        balls.forEach((ball, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);
            ball.x = Math.min(width - ballRadius, Math.max(ballRadius, cellWidth * column + cellWidth / 2));
            ball.y = Math.min(height - ballRadius, Math.max(ballRadius, cellHeight * row + cellHeight / 2));
            renderBall(ball);
        });
    }

    function clampBalls() {
        const width = ballArea.clientWidth;
        const height = ballArea.clientHeight;

        balls.forEach((ball) => {
            ball.x = Math.min(width - ballRadius, Math.max(ballRadius, ball.x));
            ball.y = Math.min(height - ballRadius, Math.max(ballRadius, ball.y));
            renderBall(ball);
        });
    }

    function renderBall(ball) {
        ball.element.style.transform = `translate(${ball.x - ballRadius}px, ${ball.y - ballRadius}px)`;
    }

    function resolveCollisions() {
        for (let firstIndex = 0; firstIndex < balls.length; firstIndex += 1) {
            for (let secondIndex = firstIndex + 1; secondIndex < balls.length; secondIndex += 1) {
                const first = balls[firstIndex];
                const second = balls[secondIndex];
                const deltaX = second.x - first.x;
                const deltaY = second.y - first.y;
                const distance = Math.hypot(deltaX, deltaY) || 1;
                const minimumDistance = ballDiameter;

                if (distance < minimumDistance) {
                    const overlap = (minimumDistance - distance) / 2;
                    const normalX = deltaX / distance;
                    const normalY = deltaY / distance;
                    first.x -= normalX * overlap;
                    first.y -= normalY * overlap;
                    second.x += normalX * overlap;
                    second.y += normalY * overlap;
                    [first.dx, second.dx] = [second.dx, first.dx];
                    [first.dy, second.dy] = [second.dy, first.dy];
                }
            }
        }
    }

    function animate() {
        const width = ballArea.clientWidth;
        const height = ballArea.clientHeight;

        balls.forEach((ball) => {
            if (ball.paused) return;
            if (ball.x + ballRadius >= width || ball.x - ballRadius <= 0) ball.dx *= -1;
            if (ball.y + ballRadius >= height || ball.y - ballRadius <= 0) ball.dy *= -1;
            ball.x += ball.dx;
            ball.y += ball.dy;
        });

        resolveCollisions();
        clampBalls();
        animationFrameId = window.requestAnimationFrame(animate);
    }

    balls.forEach((ball) => {
        ball.element.addEventListener("pointerenter", () => { ball.paused = true; });
        ball.element.addEventListener("pointerleave", () => { ball.paused = false; });
        ball.element.addEventListener("focus", () => { ball.paused = true; });
        ball.element.addEventListener("blur", () => { ball.paused = false; });
    });

    window.addEventListener("resize", clampBalls);
    placeBalls();

    if (!prefersReducedMotion && balls.length > 0) {
        animationFrameId = window.requestAnimationFrame(animate);
    }

    window.addEventListener("pagehide", () => {
        if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    });
}
