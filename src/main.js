// Importa le librerie
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Chart from 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Variabile per l'effetto Vanta
let vantaEffect = null;

// Funzione per caricare Vanta CORRETTAMENTE
async function loadVanta() {
    try {
        // PRIMA carica Three.js
        const THREE = await import('three');
        
        // Assicurati che THREE sia disponibile globalmente con TUTTE le proprietà
        window.THREE = {
            ...THREE,
            PerspectiveCamera: THREE.PerspectiveCamera,
            Scene: THREE.Scene,
            WebGLRenderer: THREE.WebGLRenderer,
            Color: THREE.Color,
            Vector2: THREE.Vector2,
            Vector3: THREE.Vector3,
            // Aggiungi altre classi necessarie
        };
        
        // POI carica Vanta
        const VANTA_MODULE = await import('vanta/dist/vanta.dots.min.js');
        
        // Ottieni la funzione VANTA correttamente
        const VANTA = VANTA_MODULE.default || VANTA_MODULE;
        
        // Ottieni l'elemento canvas
        const canvas = document.getElementById('vanta-canvas');
        if (!canvas) {
            console.warn('Elemento #vanta-canvas non trovato');
            return null;
        }
        
        // Inizializza Vanta con THREE passato correttamente
        vantaEffect = VANTA({
            el: "#vanta-canvas",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x3b82f6,
            color2: 0x60a5fa,
            backgroundColor: 0x020617,
            size: 1.50,
            spacing: 35.00,
            showLines: false,
            THREE: THREE // Questo è cruciale!
        });
        
        console.log('Vanta inizializzato con successo!');
        return vantaEffect;
        
    } catch (error) {
        console.error('Errore critico nel caricamento di Vanta:', error);
        
        // Usa l'approccio alternativo
        return await loadVantaAlternative();
    }
}

// Approccio ALTERNATIVO: usa la versione non minificata
async function loadVantaAlternative() {
    try {
        // Importa la versione source di Vanta
        const VANTA_MODULE = await import('vanta/src/vanta.dots');
        
        // Carica THREE se non già caricato
        if (!window.THREE) {
            const THREE = await import('three');
            window.THREE = THREE;
        }
        
        const canvas = document.getElementById('vanta-canvas');
        if (!canvas) return null;
        
        // Usa il modulo Vanta direttamente
        vantaEffect = VANTA_MODULE.default({
            el: "#vanta-canvas",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x3b82f6,
            color2: 0x60a5fa,
            backgroundColor: 0x020617,
            size: 1.50,
            spacing: 35.00,
            showLines: false,
            THREE: window.THREE
        });
        
        console.log('Vanta (versione alternativa) inizializzato');
        return vantaEffect;
        
    } catch (error) {
        console.error('Anche la versione alternativa ha fallito:', error);
        initFallbackBackground();
        return null;
    }
}

// Fallback background CSS (migliorato)
function initFallbackBackground() {
    const canvas = document.getElementById('vanta-canvas');
    if (!canvas) return;
    
    console.log('Attivando fallback background CSS...');
    
    // Crea un canvas 2D per effetti particellari
    canvas.innerHTML = '<canvas id="particles-canvas"></canvas>';
    const particlesCanvas = document.getElementById('particles-canvas');
    
    if (!particlesCanvas) return;
    
    // Imposta dimensioni
    particlesCanvas.style.position = 'absolute';
    particlesCanvas.style.top = '0';
    particlesCanvas.style.left = '0';
    particlesCanvas.style.width = '100%';
    particlesCanvas.style.height = '100%';
    particlesCanvas.style.zIndex = '-1';
    
    const ctx = particlesCanvas.getContext('2d');
    
    // Imposta dimensioni canvas
    function resizeCanvas() {
        particlesCanvas.width = canvas.offsetWidth;
        particlesCanvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particelle
    const particles = [];
    const particleCount = 100;
    
    // Inizializza particelle
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particlesCanvas.width,
            y: Math.random() * particlesCanvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 100 + 150)}, 246, ${Math.random() * 0.3 + 0.1})`
        });
    }
    
    // Animazione
    function animateParticles() {
        ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        
        // Sfondo gradient
        const gradient = ctx.createLinearGradient(0, 0, particlesCanvas.width, particlesCanvas.height);
        gradient.addColorStop(0, '#020617');
        gradient.addColorStop(0.5, '#0f172a');
        gradient.addColorStop(1, '#1e293b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, particlesCanvas.width, particlesCanvas.height);
        
        // Disegna e aggiorna particelle
        particles.forEach(p => {
            // Aggiorna posizione
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Rimbalzo ai bordi
            if (p.x < 0 || p.x > particlesCanvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > particlesCanvas.height) p.speedY *= -1;
            
            // Disegna particella
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Aggiungi glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = p.color;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    console.log('Fallback background con particelle attivato');
}

// Il resto del tuo codice rimane UGUALEEEEEE
// Skills Chart
function initSkillsChart() {
    const ctx = document.getElementById('skillsChart');
    if (!ctx) return;
    
    try {
        new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Laravel (Expert)', 'Databases (SQL/NoSQL)', 'DevOps (Docker/K8s)', 'IoT/R&D', 'Backend (PHP/C#)', 'Frontend (Vue/JS)'],
                datasets: [{
                    label: 'Skill Level',
                    data: [100, 95, 92, 90, 88, 70],
                    fill: true,
                    backgroundColor: 'rgba(59, 130, 246, 0.25)',
                    borderColor: '#3b82f6',
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#3b82f6'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255,255,255,0.1)' },
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        pointLabels: { 
                            color: '#cbd5e1',
                            font: { size: 12, weight: 'bold' }
                        },
                        ticks: { display: false, stepSize: 20 },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
        console.log('Chart.js inizializzato');
    } catch (error) {
        console.error('Errore Chart.js:', error);
    }
}

// GSAP Animations
function initAnimations() {
    try {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.utils.toArray('.reveal').forEach(elem => {
            gsap.fromTo(elem, 
                { opacity: 0, y: 50 }, 
                { 
                    opacity: 1, y: 0, duration: 1, 
                    scrollTrigger: {
                        trigger: elem,
                        start: "top 85%",
                    }
                }
            );
        });
        console.log('Animazioni GSAP inizializzate');
    } catch (error) {
        console.error('Errore GSAP:', error);
    }
}

// Smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    console.log('Smooth scrolling inizializzato');
}

// Aggiungi favicon
function addFavicon() {
    if (!document.querySelector('link[rel="icon"]')) {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/svg+xml';
        link.href = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💻</text></svg>';
        document.head.appendChild(link);
    }
}

// Inizializza tutto
async function initApp() {
    console.log('🚀 Inizializzazione app...');
    
    addFavicon();
    
    // PRIMA inizializza Vanta
    await loadVanta();
    
    // POI il resto
    initSkillsChart();
    initAnimations();
    initSmoothScrolling();
    
    console.log('✅ App completamente inizializzata!');
}

// Pulisci Vanta alla chiusura
window.addEventListener('beforeunload', () => {
    if (vantaEffect && typeof vantaEffect.destroy === 'function') {
        vantaEffect.destroy();
        console.log('Vanta cleanup eseguito');
    }
});

// Avvia l'app con un piccolo ritardo per assicurarsi che il DOM sia pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initApp, 100);
    });
} else {
    setTimeout(initApp, 300);
}