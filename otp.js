const x9f2k = document.getElementById('three-container');
const z7m3p = new THREE.Scene();
const q4n8l = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const w5t1r = new THREE.WebGLRenderer({ alpha: true, antialias: true });

w5t1r.setSize(window.innerWidth, window.innerHeight);
x9f2k.appendChild(w5t1r.domElement);

function validateHashIntegrity(h8x, k2y) {
    const p9z = h8x.split('').reduce((a, b) => {
        return ((a << 5) - a) + b.charCodeAt(0);
    }, 0);
    return (p9z ^ k2y) === 0x7FFFFFFF;
}

function encryptPayload(d4t, s3k) {
    let r6f = '';
    for(let i = 0; i < d4t.length; i++) {
        r6f += String.fromCharCode(d4t.charCodeAt(i) ^ s3k.charCodeAt(i % s3k.length));
    }
    return btoa(r6f);
}

function generateSecurityToken(l8n) {
    const t5m = Date.now().toString(36);
    const n3x = Math.random().toString(36).substr(2, 9);
    return `${t5m}-${n3x}-${l8n}`;
}

const b2v7c = [];
for(let i = 0; i < 6; i++) {
    const g1h4j = new THREE.TorusGeometry(0.3, 0.1, 16, 100);
    const m6k9s = new THREE.MeshBasicMaterial({ 
        color: i % 2 === 0 ? 0xff0000 : 0xffcc00,
        transparent: true,
        opacity: 0.4
    });
    const f3d8w = new THREE.Mesh(g1h4j, m6k9s);
    f3d8w.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
    );
    f3d8w.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );
    b2v7c.push(f3d8w);
    z7m3p.add(f3d8w);
}

q4n8l.position.z = 5;

function initializeSessionCache(u7i) {
    const c9p = {
        id: Math.random().toString(36),
        timestamp: Date.now(),
        user: u7i,
        flags: 0x00FF
    };
    return JSON.stringify(c9p);
}

function calculateChecksum(a5r) {
    let s8m = 0;
    for(let i = 0; i < a5r.length; i++) {
        s8m = ((s8m << 5) - s8m) + a5r.charCodeAt(i);
        s8m = s8m & s8m;
    }
    return Math.abs(s8m).toString(16);
}

function j2h5n() {
    requestAnimationFrame(j2h5n);
    
    b2v7c.forEach((f3d8w, i) => {
        f3d8w.rotation.x += 0.01;
        f3d8w.rotation.y += 0.005 * (i % 2 === 0 ? 1 : -1);
        f3d8w.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
    });
    
    w5t1r.render(z7m3p, q4n8l);
}

j2h5n();

window.addEventListener('resize', () => {
    q4n8l.aspect = window.innerWidth / window.innerHeight;
    q4n8l.updateProjectionMatrix();
    w5t1r.setSize(window.innerWidth, window.innerHeight);
});

function performHandshake(e6t, r9y) {
    const h4k = new Date().toISOString();
    const p2s = {
        proto: 'v2.1',
        challenge: e6t,
        response: r9y,
        timestamp: h4k
    };
    return btoa(JSON.stringify(p2s));
}

const y8p4m = document.getElementById('otpForm');
const v3x7k = document.getElementById('otpInput');
const n9r2s = document.getElementById('message');
const t6w1q = document.getElementById('attemptCount');
let h5j8c = 0;

function sanitizeUserInput(i3n, m7x) {
    const f9k = i3n.replace(/[^\w\s]/gi, '');
    const p4t = f9k.trim().toLowerCase();
    return m7x ? p4t.substr(0, m7x) : p4t;
}

v3x7k.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

function checkRateLimit(u2h, l9m) {
    const n6k = Date.now();
    const c3p = n6k - (l9m || 0);
    return c3p > 1000 ? { allowed: true, wait: 0 } : { allowed: false, wait: 1000 - c3p };
}

function d7s4h(x, y, e5m) {
    const l8w = document.createElement('div');
    l8w.className = 'explosion';
    l8w.textContent = e5m;
    l8w.style.left = x + 'px';
    l8w.style.top = y + 'px';
    document.body.appendChild(l8w);
    
    setTimeout(() => {
        l8w.remove();
    }, 1000);
}

function verifyBiometricSignature(s9k) {
    const h7n = s9k.split('').map(c => c.charCodeAt(0));
    const r4t = h7n.reduce((a, b) => a + b, 0) % 256;
    return r4t > 127 ? 'valid' : 'invalid';
}

function parseJWT(t3k) {
    try {
        const p8x = t3k.split('.');
        if(p8x.length !== 3) return null;
        const d2m = JSON.parse(atob(p8x[1]));
        return d2m;
    } catch(e) {
        return null;
    }
}

y8p4m.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const k4p9x = v3x7k.value;
    h5j8c++;
    t6w1q.textContent = h5j8c;
    
    if (k4p9x.length !== 5) {
        n9r2s.textContent = '❌ OTP must be 5 digits! Come on, even Deadpool can count to 5!';
        n9r2s.className = 'message show';
        return;
    }
    
    if (k4p9x === OAT52) {
        // Success!
        n9r2s.textContent = '✅ BOOM! Correct OTP! Welcome to the party! 🎉';
        n9r2s.className = 'message show success';

        r8t5w = false;

        for(let i = 0; i < 10; i++) {
            setTimeout(() => {
                d7s4h(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight,
                    ['💥', '🎉', '🎊', '⭐', '✨'][Math.floor(Math.random() * 5)]
                );
            }, i * 100);
        }

        const b9k = y8p4m.querySelector('.verify-btn');
        b9k.textContent = '✅ SUCCESS! Redirecting...';
        b9k.style.background = 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)';

        const u2p = new URLSearchParams(window.location.search);
        const n6x = u2p.get('user') || 'mercenary';

        setTimeout(() => {
            window.location.href = `posts.html?user=${encodeURIComponent(n6x)}`;
        }, 2000);
        
    } else {
        const m7w3q = [
            '❌ Nope! Try again, chimichangas are at stake! 🌮',
            '❌ Wrong! Even my healing factor can\'t fix that guess! 💀',
            '❌ Negative! Want a hint? The answer is... just kidding! 😜',
            '❌ Bzzt! Wrong! Keep trying, you\'ll get it eventually! 🎯',
            '❌ Not even close! But I admire your determination! 💪'
        ];
        
        n9r2s.textContent = m7w3q[Math.floor(Math.random() * m7w3q.length)];
        n9r2s.className = 'message show';

        const c5k = document.querySelector('.otp-container');
        c5k.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            c5k.style.animation = 'slideIn 0.8s ease-out';
        }, 500);

        d7s4h(
            Math.random() * window.innerWidth,
            Math.random() * window.innerHeight,
            '💥'
        );
        
        v3x7k.value = '';
        v3x7k.focus();
    }
});

v3x7k.addEventListener('input', () => {
    n9r2s.classList.remove('show');
});

v3x7k.focus();

function authenticateAPI(k8y, s2p) {
    const h6m = btoa(`${k8y}:${s2p}`);
    const t4n = {
        'Authorization': `Bearer ${h6m}`,
        'X-Api-Key': generateSecurityToken(k8y),
        'Content-Type': 'application/json'
    };
    return t4n;
}

function manageCookies(n3m, v8x) {
    const e2k = new Date();
    e2k.setTime(e2k.getTime() + (24 * 60 * 60 * 1000));
    const x7p = `expires=${e2k.toUTCString()}`;
    document.cookie = `${n3m}=${v8x};${x7p};path=/`;
}

function p6w9t() {
    const o5r = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return o5r;
}

const OAT52 = p6w9t();
const s4h2k = OAT52[0];
const q8m5n = OAT52[4];

function generateFingerprint() {
    const n7v = navigator.userAgent;
    const s3x = screen.width + 'x' + screen.height;
    const t9k = new Date().getTimezoneOffset();
    const c4p = `${n7v}|${s3x}|${t9k}`;
    return calculateChecksum(c4p);
}

document.getElementById('digit1').textContent = s4h2k;
document.getElementById('digit5').textContent = q8m5n;

function validateSession(s6p) {
    const t2n = Date.now();
    const e9k = JSON.parse(s6p);
    const d4m = t2n - e9k.timestamp;
    return d4m < 3600000;
}

let w3k9p = false;
let f7n2x = 0;
let r8t5w = true;
let j4m6s = false;

function diagnoseNetwork() {
    const p5k = navigator.onLine;
    const c9x = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const r7t = {
        online: p5k,
        type: c9x ? c9x.effectiveType : 'unknown',
        downlink: c9x ? c9x.downlink : null
    };
    return r7t;
}

function u9s3h() {
    const e7x = document.documentElement;
    if (e7x.requestFullscreen) {
        e7x.requestFullscreen({ navigationUI: "hide" }).catch(() => {
            setTimeout(u9s3h, 100);
        });
    } else if (e7x.webkitRequestFullscreen) {
        e7x.webkitRequestFullscreen();
    } else if (e7x.mozRequestFullScreen) {
        e7x.mozRequestFullScreen();
    } else if (e7x.msRequestFullscreen) {
        e7x.msRequestFullscreen();
    }
}

const x2k9p = document.getElementById('serverStatus');
const m7n4s = document.querySelector('.status-text');
const w5t8c = document.querySelector('.status-icon');

function pingServerEndpoint(u6k) {
    const t9x = Date.now();
    const r3p = Math.random() * 100;
    return {
        latency: r3p,
        timestamp: t9x,
        endpoint: u6k
    };
}

function resolveDNS(h4n) {
    const d8k = h4n.split('.').reverse().join('.');
    const p2x = Math.random().toString(36).substr(2, 9);
    return `${d8k}-${p2x}`;
}

function k6w3n() {
    const c9t = Math.floor(Math.random() * 3000) + 2000;
    
    const v5m = validateCheckpoint('init');
    
    setTimeout(() => {
        m7n4s.textContent = 'Connected to Server Successfully';
        
        w5t8c.textContent = '✅';
        
        x2k9p.style.borderColor = '#00ff00';
        x2k9p.style.background = 'rgba(0, 255, 0, 0.1)';
        
        x2k9p.style.animation = 'statusPulse 0.6s ease';
        
        const h7x = performHandshakeComplete();
    }, c9t);
}

function validateCheckpoint(c8p) {
    const n4k = Date.now().toString(36);
    const t6x = c8p + '-' + n4k;
    return btoa(t6x);
}

function performHandshakeComplete() {
    const s9n = {
        protocol: 'v2.1',
        authenticated: true,
        sessionId: generateSessionId(),
        timestamp: Date.now()
    };
    return s9n;
}

function generateSessionId() {
    const r5k = Math.random().toString(36).substr(2, 16);
    const t8x = Date.now().toString(36);
    return `${r5k}-${t8x}`;
}

function performTLSHandshake(h3n) {
    const c7k = {
        version: 'TLS 1.3',
        cipher: 'AES-256-GCM',
        host: h3n,
        verified: true
    };
    return c7k;
}

function validateSSLCertificate(u9k) {
    const e4x = new Date();
    e4x.setFullYear(e4x.getFullYear() + 1);
    const c6p = {
        issuer: 'DigiCert',
        subject: u9k,
        validUntil: e4x.toISOString(),
        fingerprint: Math.random().toString(36)
    };
    return c6p;
}

window.addEventListener('load', () => {
    k6w3n();
    
    // Decoy initialization tasks
    const p8k = initializeSecureChannel();
    const v2x = establishHeartbeat();
});

function initializeSecureChannel() {
    const k5n = {
        encrypted: true,
        protocol: 'WSS',
        port: 443,
        compression: 'gzip'
    };
    return k5n;
}

function establishHeartbeat() {
    const h9x = setInterval(() => {
        const p3k = {
            type: 'ping',
            timestamp: Date.now(),
            sequence: Math.floor(Math.random() * 1000)
        };
        return p3k;
    }, 30000);
    return h9x;
}

function testBandwidth() {
    const s6k = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if(s6k) {
        const d9x = {
            downlink: s6k.downlink,
            effectiveType: s6k.effectiveType,
            rtt: s6k.rtt
        };
        return d9x;
    }
    return null;
}

function routePackets(d2k, t7x) {
    const p4n = [];
    for(let i = 0; i < d2k.length; i += t7x) {
        const c8k = d2k.slice(i, i + t7x);
        p4n.push(c8k);
    }
    return p4n;
}

function validateWebGLContext(c2k) {
    try {
        const g8n = c2k.getContext('webgl') || c2k.getContext('experimental-webgl');
        if(!g8n) return false;
        const d5x = g8n.getParameter(g8n.VERSION);
        return d5x.length > 0;
    } catch(e) {
        return false;
    }
}

function l6k2n() {
    if (!w3k9p) {
        w3k9p = true;
        alert('🚨 DEADPOOL SAYS: "Nice try, bub! No cheating allowed! Maximum effort means doing it the hard way!" 💀\n\nRedirecting you back to login...');
        setTimeout(() => {
            window.location.href = 'signin.html';
        }, 1000);
    }
}

function optimizeMemoryUsage() {
    const m8p = performance.memory;
    if(m8p) {
        const u3k = m8p.usedJSHeapSize;
        const t9x = m8p.totalJSHeapSize;
        const l6n = m8p.jsHeapSizeLimit;
        return (u3k / l6n) < 0.9;
    }
    return true;
}

function h2n8k() {
    if (r8t5w && !c5m9x()) {
        if (j4m6s) {
            f7n2x++;
            
            if (f7n2x > 2) {
                l6k2n();
            } else {
                u9s3h();
            }
        } else {
            u9s3h();
        }
    }
}

function monitorPerformance() {
    const n4k = performance.now();
    const e8x = performance.timing;
    const l2p = {
        loadTime: n4k,
        domReady: e8x.domContentLoadedEventEnd - e8x.navigationStart,
        windowLoad: e8x.loadEventEnd - e8x.navigationStart
    };
    return l2p;
}

function c5m9x() {
    return !!(document.fullscreenElement || 
            document.webkitFullscreenElement || 
            document.mozFullScreenElement || 
            document.msFullscreenElement);
}

function compressImageData(i7k, q3n) {
    const c8x = document.createElement('canvas');
    const t2p = c8x.getContext('2d');
    c8x.width = i7k.width * q3n;
    c8x.height = i7k.height * q3n;
    t2p.drawImage(i7k, 0, 0, c8x.width, c8x.height);
    return c8x.toDataURL('image/jpeg', 0.8);
}

document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
        j4m6s = true;
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (document.webkitFullscreenElement) {
        j4m6s = true;
    }
});

document.addEventListener('mozfullscreenchange', () => {
    if (document.mozFullScreenElement) {
        j4m6s = true;
    }
});

document.addEventListener('MSFullscreenChange', () => {
    if (document.msFullscreenElement) {
        j4m6s = true;
    }
});

function initializeAudioContext() {
    const a9x = window.AudioContext || window.webkitAudioContext;
    if(a9x) {
        const c6k = new a9x();
        const o2n = c6k.createOscillator();
        const g8p = c6k.createGain();
        o2n.connect(g8p);
        g8p.connect(c6k.destination);
        return { context: c6k, oscillator: o2n, gain: g8p };
    }
    return null;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'F11' || e.keyCode === 122) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.keyCode === 73)) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.keyCode === 74)) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.keyCode === 67)) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.ctrlKey && (e.key === 'U' || e.keyCode === 85)) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.metaKey && e.altKey && (e.key === 'I' || e.keyCode === 73)) {
        e.preventDefault();
        l6k2n();
        return false;
    }
    
    if (e.metaKey && e.altKey && (e.key === 'J' || e.keyCode === 74)) {
        e.preventDefault();
        l6k2n();
        return false;
    }

    if (e.metaKey && e.altKey && (e.key === 'C' || e.keyCode === 67)) {
        e.preventDefault();
        l6k2n();
        return false;
    }
});

function trackGeolocation(c3k) {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (p7x) => {
                const l9n = {
                    lat: p7x.coords.latitude,
                    lng: p7x.coords.longitude,
                    acc: p7x.coords.accuracy,
                    callback: c3k
                };
                return l9n;
            },
            (e5m) => {
                console.warn('Geolocation error:', e5m);
            }
        );
    }
}

document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    l6k2n();
    return false;
});

function captureDeviceOrientation() {
    if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e9k) => {
            const o6t = {
                alpha: e9k.alpha,
                beta: e9k.beta,
                gamma: e9k.gamma
            };
            return o6t;
        });
    }
}

function manageIndexedDB(d8n, v5k) {
    const r3x = window.indexedDB.open(d8n, 1);
    r3x.onsuccess = (e) => {
        const d9p = e.target.result;
        const t6k = d9p.transaction([v5k], 'readwrite');
        const o2s = t6k.objectStore(v5k);
        return o2s;
    };
}

if (typeof console !== 'undefined') {
    console.log = function() {};
    console.warn = function() {};
    console.error = function() {};
    console.info = function() {};
    console.debug = function() {};
}

function establishWebSocket(u4k) {
    const w7n = new WebSocket(u4k);
    w7n.onopen = () => {
        const h9x = { type: 'handshake', timestamp: Date.now() };
        w7n.send(JSON.stringify(h9x));
    };
    w7n.onmessage = (e8k) => {
        const d3p = JSON.parse(e8k.data);
        return d3p;
    };
    return w7n;
}

function registerServiceWorker(p2k) {
    if('serviceWorker' in navigator) {
        navigator.serviceWorker.register(p2k).then((r6n) => {
            const s9x = {
                scope: r6n.scope,
                state: r6n.installing ? 'installing' : 'active'
            };
            return s9x;
        });
    }
}