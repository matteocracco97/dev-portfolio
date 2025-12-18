import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Chart from 'chart.js/auto';
import '@fortawesome/fontawesome-free/css/all.min.css';

let vantaEffect = null;

async function loadVanta() {
        const THREE = await import('three');
        
        window.THREE = {
            ...THREE,
            PerspectiveCamera: THREE.PerspectiveCamera,
            Scene: THREE.Scene,
            WebGLRenderer: THREE.WebGLRenderer,
            Color: THREE.Color,
            Vector2: THREE.Vector2,
            Vector3: THREE.Vector3,
        };
        
        const VANTA_MODULE = await import('vanta/dist/vanta.dots.min.js');
        
        const VANTA = VANTA_MODULE.default || VANTA_MODULE;
        
        const canvas = document.getElementById('vanta-canvas');
        if (!canvas) {
            console.warn('Elemento #vanta-canvas non trovato');
            return null;
        }

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
            THREE: THREE
        });
        
        return vantaEffect;
}


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
    } catch (error) {
        console.error('GSAP Error:', error);
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

async function initApp() {

    addFavicon();
    
    await loadVanta();
    
    initSkillsChart();
    initAnimations();
    initSmoothScrolling();
}

window.addEventListener('beforeunload', () => {
    if (vantaEffect && typeof vantaEffect.destroy === 'function') {
        vantaEffect.destroy();
        console.log('Vanta cleanup eseguito');
    }
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initApp, 100);
    });
} else {
    setTimeout(initApp, 300);
}