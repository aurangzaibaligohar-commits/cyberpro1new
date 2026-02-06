async function loadComponents() {
    const files = { 
        'navbar-placeholder': 'navbar.html', 
        'footer-placeholder': 'footer.html' 
    };

    // Sabhi fetches ko parallel mein chalane ke liye Promise.all behtar hai
    const promises = Object.entries(files).map(async ([id, file]) => {
        try {
            const res = await fetch(file);
            const targetElement = document.getElementById(id);
            if (res.ok && targetElement) {
                targetElement.innerHTML = await res.text();
            }
        } catch (e) {
            console.error(`Error loading ${file}:`, e);
        }
    });

    await Promise.all(promises);
    
    // Components load hone ke baad observer ko check karein
    initObserver();
}

const startCounters = () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return; // Agar data-target nahi hai toh skip karein

        const duration = 2000;
        let startTime = null;

        const updateCount = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            const currentNum = progress * target;

            // Formatting Logic
            if (target >= 10000000) {
                counter.innerText = (currentNum / 1000000).toFixed(1) + "M+";
            } else if (target === 99.9 || target === 100) {
                counter.innerText = currentNum.toFixed(1) + "%";
            } else {
                counter.innerText = Math.floor(currentNum);
            }

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                // Final value fix (precision errors se bachne ke liye)
                if (target >= 10000000) counter.innerText = "10M+";
                else if (target === 99.9) counter.innerText = "99.9%";
                else if (target === 100) counter.innerText = "100%";
                else counter.innerText = target;
            }
        };
        requestAnimationFrame(updateCount);
    });
};

function initObserver() {
    const statsSection = document.querySelector('#stats-section');
    if (!statsSection) {
        console.warn("Stats section not found.");
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                // Ek baar animation chalne ke baad observe karna band kar dein (optional)
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.4 });

    observer.observe(statsSection);
}

// Event Listener
window.addEventListener('DOMContentLoaded', loadComponents);

// Counter animation on scroll
const counters = document.querySelectorAll('.counter');
const speed = 200; // lower = faster

const startCounting = (counter) => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;

    const increment = target / speed;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => startCounting(counter), 1);
    } else {
        counter.innerText = target;
    }
};

// Using IntersectionObserver (better performance + only runs when visible)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            startCounting(counter);
            observer.unobserve(counter); // run only once
        }
    });
}, {
    threshold: 0.5 // start when 50% of element is visible
});

counters.forEach(counter => {
    observer.observe(counter);
});

document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 200;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
});
// script.js

// 1. Counter animation on scroll (stats section)
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');

    const runCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const increment = target / 180; // ~1.5–2 sec animation
        const timer = setInterval(() => {
            current += increment;
            el.textContent = Math.floor(current).toLocaleString(); // adds commas for big numbers
            if (current >= target) {
                el.textContent = target.toLocaleString();
                clearInterval(timer);
            }
        }, 10);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                runCounter(entry.target);
                observer.unobserve(entry.target); // run only once
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
});

// 2. Back to Top Button
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// 3. Optional: Fix marquee pause on hover (if you want)
const marqueeContainer = document.querySelector('.bg-red-600\\/10');
if (marqueeContainer) {
    const marquee = marqueeContainer.querySelector('marquee');
    marqueeContainer.addEventListener('mouseenter', () => marquee.stop());
    marqueeContainer.addEventListener('mouseleave', () => marquee.start());
}

// 4. Optional: Add active class to nav links when scrolling (if you add navbar later)



        document.addEventListener('DOMContentLoaded', function() {
            const btn = document.getElementById('back-to-top');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 600) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            });

            btn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
       
    // 1. Password Strength Checker
    const passwordInput = document.getElementById('live-password');
    const strengthResult = document.getElementById('strength-result');

    if (passwordInput) {
        passwordInput.addEventListener('input', function () {
            const pass = passwordInput.value;
            let strength = 'Weak';
            let color = 'text-red-500';

            if (pass.length > 12 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[^A-Za-z0-9]/.test(pass)) {
                strength = 'Very Strong';
                color = 'text-green-400';
            } else if (pass.length > 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
                strength = 'Strong';
                color = 'text-cyan-400';
            } else if (pass.length > 6) {
                strength = 'Medium';
                color = 'text-yellow-400';
            }

            strengthResult.innerHTML = `<span class="${color} font-bold">${strength}</span>`;
        });
    }

    // 2. IP Scanner (real IP via free API)
    const scanBtn = document.getElementById('scan-ip-btn');
    const ipResult = document.getElementById('ip-result');

    if (scanBtn) {
        scanBtn.addEventListener('click', function () {
            ipResult.innerHTML = 'Scanning...';
            fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => {
                    ipResult.innerHTML = `Your Public IP: <span class="text-cyan-400 font-bold">${data.ip}</span>`;
                })
                .catch(() => {
                    ipResult.innerHTML = 'Unable to fetch IP – try again later';
                });
        });
    }

    // 3. URL Safety Checker (basic check – real mein API use kar sakte ho)
    const urlInput = document.getElementById('url-check');
    const urlResult = document.getElementById('url-result');

    if (urlInput) {
        urlInput.addEventListener('input', function () {
            const url = urlInput.value.trim();
            if (!url) {
                urlResult.innerHTML = '';
                return;
            }

            if (url.startsWith('https://')) {
                urlResult.innerHTML = '<span class="text-green-400 font-bold">Safe (HTTPS Detected)</span>';
            } else if (url.startsWith('http://')) {
                urlResult.innerHTML = '<span class="text-yellow-400 font-bold">Warning: Not Secure (HTTP)</span>';
            } else {
                urlResult.innerHTML = '<span class="text-red-500 font-bold">Invalid URL – add http/https</span>';
            }
        });
    }
// --- 1. SHA-256 Hash Generator ---
async function generateSHA256(text) {
    const msgBuffer = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

document.getElementById('hash-input')?.addEventListener('input', async (e) => {
    const val = e.target.value;
    const resDiv = document.getElementById('hash-result');
    if (val) {
        const hash = await generateSHA256(val);
        resDiv.innerText = hash;
    } else {
        resDiv.innerText = "Hash will appear here...";
    }
});

// --- 2. Breach Checker Simulator ---
document.getElementById('check-breach-btn')?.addEventListener('click', () => {
    const email = document.getElementById('breach-email').value;
    const result = document.getElementById('breach-result');
    if (!email.includes('@')) {
        result.innerHTML = '<span class="text-orange-400">Please enter a valid email!</span>';
        return;
    }
    result.innerHTML = '<span class="text-cyan-400 animate-pulse">Scanning 500+ databases...</span>';
    setTimeout(() => {
        result.innerHTML = '<span class="text-green-500"><i class="fas fa-check-circle"></i> Good news! No leaks found for this email.</span>';
    }, 2000);
});

// --- 3. DNS Lookup Simulator ---
document.getElementById('dns-btn')?.addEventListener('click', () => {
    const domain = document.getElementById('dns-input').value;
    const result = document.getElementById('dns-result');
    if (!domain) return;
    
    result.innerHTML = '<span class="text-gray-500">Querying Root Servers...</span>';
    
    setTimeout(() => {
        result.innerHTML = `
            <div class="text-green-400">[A Record]: 192.168.1.1</div>
            <div class="text-blue-400">[MX Record]: mail.${domain}</div>
            <div class="text-purple-400">[NS]: ns1.cyberguard.com</div>
            <div class="text-yellow-400">[TXT]: v=spf1 include:_spf.google.com ~all</div>
        `;
    }, 1200);
});
// 1. Password Generator
    function generateSecurePass() {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let pass = "";
        for (let i = 0; i < 16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        document.getElementById('gen-pass-display').innerText = pass;
    }

    // 2. Base64
    function b64Encode() {
        const val = document.getElementById('b64-input').value;
        document.getElementById('b64-result').innerText = btoa(val);
    }
    function b64Decode() {
        const val = document.getElementById('b64-input').value;
        try { document.getElementById('b64-result').innerText = atob(val); } 
        catch(e) { document.getElementById('b64-result').innerText = "Invalid Base64"; }
    }

    // 3. Hex Converter
    function convertToHex() {
        const str = document.getElementById('hex-input').value;
        let hex = '';
        for(let i=0;i<str.length;i++) hex += str.charCodeAt(i).toString(16) + ' ';
        document.getElementById('hex-result').innerText = hex || 'Hex output here...';
    }

    // 4. Scan Simulator
    function simulateScan(btn) {
        btn.innerText = "Scanning...";
        const status = document.getElementById('scan-status');
        status.innerHTML = "Initializing...";
        setTimeout(() => { status.innerHTML += "<br>Port 80: OPEN"; }, 500);
        setTimeout(() => { status.innerHTML += "<br>Port 443: OPEN"; }, 1000);
        setTimeout(() => { status.innerHTML += "<br>Port 21: CLOSED"; }, 1500);
        setTimeout(() => { btn.innerText = "Start Scan"; }, 2000);
    }

    // 5. Case Transformer
    function transformText(type) {
        const el = document.getElementById('case-input');
        el.value = (type === 'up') ? el.value.toUpperCase() : el.value.toLowerCase();
    }
    function checkStrength(p) {
        const res = document.getElementById('strength-result');
        if(!p) { res.innerText = ""; return; }
        if(p.length < 8) { res.innerText = "WEAK"; res.className="text-red-500 font-bold"; }
        else { res.innerText = "SECURE"; res.className="text-green-500 font-bold"; }
    }

    function scanMyIP(btn) {
        const res = document.getElementById('ip-result');
        btn.innerText = "Scanning...";
        setTimeout(() => {
            res.innerText = "Your IP: 182.176.xx.xx (Karachi, PK)";
            btn.innerText = "Scan My IP";
        }, 1200);
    }

    async function generateHash(text) {
        if(!text) { document.getElementById('hash-result').innerText = "Result..."; return; }
        const msgBuffer = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
        document.getElementById('hash-result').innerText = hashHex;
    }

    function generateSecurePass() {
        const c = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
        let p = "";
        for(let i=0; i<16; i++) p += c.charAt(Math.floor(Math.random()*c.length));
        document.getElementById('gen-pass-display').innerText = p;
    }

    function b64Encode() {
        const input = document.getElementById('b64-input').value;
        document.getElementById('b64-result').innerText = btoa(input);
    }
    function b64Decode() {
        const input = document.getElementById('b64-input').value;
        try { document.getElementById('b64-result').innerText = atob(input); } catch(e) { alert("Invalid Base64"); }
    }

    function toHex(s) {
        let h = "";
        for(let i=0; i<s.length; i++) h += s.charCodeAt(i).toString(16) + " ";
        document.getElementById('hex-out').innerText = h || "Output...";
    }

    function checkBreach(btn) {
        const status = document.getElementById('breach-status');
        btn.innerText = "Searching...";
        setTimeout(() => {
            status.innerText = "Analysis Complete: No leaks found.";
            btn.innerText = "Verify Email";
        }, 1500);
    }

    function changeCase(t) {
        const el = document.getElementById('case-txt');
        el.value = (t==='up') ? el.value.toUpperCase() : el.value.toLowerCase();
    }
         document.addEventListener('DOMContentLoaded', function() {
            const btn = document.getElementById('back-to-top');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 600) {
                    btn.classList.add('show');
                } else {
                    btn.classList.remove('show');
                }
            });

            btn.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
        function toggleIRDetails() {
        const details = document.getElementById('ir-details');
        const container = document.getElementById('ir-container');
        const icon = document.getElementById('ir-icon');

        // Toggle visibility
        if (details.classList.contains('hidden')) {
            details.classList.remove('hidden');
            container.classList.add('flex-wrap'); // Card ko expand karne ke liye
            icon.classList.replace('fa-phone-alt', 'fa-times');
            
            // Smooth scroll to details
            details.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            details.classList.add('hidden');
            container.classList.remove('flex-wrap');
            icon.classList.replace('fa-times', 'fa-phone-alt');
        }
    }
    document.addEventListener('DOMContentLoaded', () => {
        const stars = document.querySelectorAll('.star-btn');
        const ratingDisplay = document.getElementById('rating-value');

        stars.forEach((star, index) => {
            // Click Event
            star.addEventListener('click', () => {
                const currentRating = index + 1;
                
                // Update Stars UI
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });

                // Update Text Value
                ratingDisplay.innerText = currentRating;

                // Console log for backend (Optional)
                console.log(`User selected ${currentRating} stars`);
            });
        });
    });
    
    // videos.html ki js  is k neche he
       // Sample video data (professional: array of objects with categories for filtering)
        const videos = [
            { id: 1, title: 'Cyber Security Full Course', thumbnail: 'https://img.youtube.com/vi/bPVaOlJ6ln0/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/bPVaOlJ6ln0', description: 'Complete course on cyber security.', category: 'basics', views: 10000 },
            { id: 2, title: 'Hacking Explained', thumbnail: 'https://img.youtube.com/vi/6mXzYV4V_2E/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/6mXzYV4V_2E', description: 'Basics of hacking.', category: 'basics', views: 8000 },
            { id: 3, title: 'Bug Bounty Roadmap 2024', thumbnail: 'https://img.youtube.com/vi/QwXkEb9h04I/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/QwXkEb9h04I', description: 'Roadmap for bug bounty hunters.', category: 'advanced', views: 12000 },
            { id: 4, title: 'Python for Cyber Security', thumbnail: 'https://img.youtube.com/vi/3Kq1MIfTWCE/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/3Kq1MIfTWCE', description: 'Using Python in security.', category: 'advanced', views: 9000 },
            { id: 5, title: 'Metasploit Mastery', thumbnail: 'https://img.youtube.com/vi/8lR27r8Y_S4/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/8lR27r8Y_S4', description: 'Mastering Metasploit framework.', category: 'threats', views: 15000 },
            { id: 6, title: 'Intro to Digital Forensics', thumbnail: 'https://img.youtube.com/vi/Yp9fM9_N-I0/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/Yp9fM9_N-I0', description: 'Basics of digital forensics.', category: 'threats', views: 7000 },
            { id: 7, title: 'Social Engineering Tactics', thumbnail: 'https://img.youtube.com/vi/LcKnxhelV9U/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/LcKnxhelV9U', description: 'Tactics used in social engineering.', category: 'defenses', views: 11000 },
            // Add more videos for pagination (up to 50+ for professional feel)
            { id: 8, title: 'Phishing Defense Strategies', thumbnail: 'https://img.youtube.com/vi/someid/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/someid', description: 'Defend against phishing.', category: 'defenses', views: 9500 },
            { id: 9, title: 'Ransomware Prevention', thumbnail: 'https://img.youtube.com/vi/anotherid/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/anotherid', description: 'Prevent ransomware attacks.', category: 'threats', views: 13000 },
            { id: 10, title: 'Secure Coding Practices', thumbnail: 'https://img.youtube.com/vi/codeid/maxresdefault.jpg', embed: 'https://www.youtube.com/embed/codeid', description: 'Best practices for secure coding.', category: 'advanced', views: 8500 },
            // ... Add 40 more similar entries if needed, but for brevity, assume this array is expanded
        ];

        // Pagination settings
        const videosPerPage = 6;
        let currentPage = 1;
        let filteredVideos = [...videos];

        // Render videos function
        function renderVideos(page = 1) {
            const container = document.getElementById('video-container');
            container.innerHTML = '';
            const start = (page - 1) * videosPerPage;
            const end = start + videosPerPage;
            const pageVideos = filteredVideos.slice(start, end);

            pageVideos.forEach(video => {
                const card = `
                    <div class="glass rounded-3xl overflow-hidden border-t-2 border-cyan-500/50 group transition-all duration-300 cursor-pointer" onclick="openModal(${video.id})">
                        <div class="relative aspect-video">
                            <img src="${video.thumbnail}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all">
                            <div class="absolute inset-0 flex items-center justify-center"><i class="fas fa-play-circle text-5xl text-cyan-500 opacity-80 group-hover:scale-110 transition-all"></i></div>
                        </div>
                        <div class="p-6 text-left">
                            <span class="text-[9px] font-bold text-cyan-500 font-mono uppercase tracking-widest">Category: ${video.category.toUpperCase()}</span>
                            <h3 class="text-lg font-bold text-white mt-2 uppercase italic tracking-wider">${video.title}</h3>
                            <p class="text-sm text-gray-500 mt-2">Views: ${video.views}</p>
                        </div>
                    </div>
                `;
                container.innerHTML += card;
            });

            // Pagination info
            const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
            document.getElementById('pagination').innerHTML = `Page ${page} of ${totalPages}`;
            document.getElementById('prev-page').disabled = page === 1;
            document.getElementById('next-page').disabled = page === totalPages;
        }

        // Search and filter
        document.getElementById('video-search').addEventListener('input', filterVideos);
        document.getElementById('video-filter').addEventListener('change', filterVideos);

        function filterVideos() {
            const search = document.getElementById('video-search').value.toLowerCase();
            const category = document.getElementById('video-filter').value;
            filteredVideos = videos.filter(v => 
                (category === 'all' || v.category === category) &&
                v.title.toLowerCase().includes(search)
            );
            currentPage = 1;
            renderVideos(currentPage);
        }

        // Pagination buttons
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderVideos(currentPage);
            }
        });
        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage < Math.ceil(filteredVideos.length / videosPerPage)) {
                currentPage++;
                renderVideos(currentPage);
            }
        });

        // Modal functionality
        function openModal(videoId) {
            const video = videos.find(v => v.id === videoId);
            if (!video) return;
            document.getElementById('modal-title').textContent = video.title;
            document.getElementById('modal-description').textContent = video.description;
            document.getElementById('modal-content').innerHTML = `<iframe class="w-full h-full" src="${video.embed}?rel=0&modestbranding=1&autoplay=1" frameborder="0" allowfullscreen></iframe>`;
            document.getElementById('comments-list').innerHTML = '<p class="text-gray-500">No comments yet.</p>'; // Simulated comments
            document.getElementById('video-modal').classList.remove('hidden');
        }

        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('video-modal').classList.add('hidden');
            document.getElementById('modal-content').innerHTML = '';
        });

        // Comment form (simulated with localStorage)
        document.getElementById('comment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Comment posted! (Simulated)');
            e.target.reset();
        });

        // Initial render
        renderVideos();

        // Back to top (assuming script.js has it, but add if needed)
        window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top');
            if (window.scrollY > 300) btn.classList.add('show');
            else btn.classList.remove('show');
        });
        document.getElementById('back-to-top').addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
   
        // <!-- Yeh script add kar do (existing script ke andar ya neeche) -->

    // Category filter function (gallery ko scroll karke filter apply)
    function filterByCategory(category) {
        // Dropdown mein value set karo
        document.getElementById('video-filter').value = category;
        
        // Search input clear kar do (optional)
        document.getElementById('video-search').value = '';
        
        // Filter function call (jo pehle se hai)
        filterVideos();
        
        // Smooth scroll to gallery
        document.getElementById('video-gallery').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
 {
        const search = document.getElementById('video-search').value.toLowerCase();
        const category = document.getElementById('video-filter').value;
        
        filteredVideos = videos.filter(v => 
            (category === 'all' || v.category === category) &&
            v.title.toLowerCase().includes(search)
        );
        
        currentPage = 1;
        renderVideos(currentPage);
    }


     fetch('navbar.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('navbar').innerHTML = data;
            })
            .catch(error => {
                console.error('Navbar load nahi hua', error);
                // optional: error message dikhane ke liye
                document.getElementById('navbar').innerHTML = '<p style="color:red;">Navbar load nahi hua :(</p>';
            });
            // Footer ko load karne ka code (naya add karo)
        fetch('footer.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('footer-placeholder').innerHTML = data;
            })
            .catch(error => {
                console.error('Footer load nahi hua', error);
                document.getElementById('footer-placeholder').innerHTML = '<p style="color:red;">Footer nahi load hua :(</p>';
            });
            

document.addEventListener('DOMContentLoaded', function () {

    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    const body = document.body;

    // Load saved theme
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');

        if (body.classList.contains('light-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        }
    });

});

// NEWAPI KEY  JAHAN HAME WORLD WIDE NEWS MILEGI WITH THE HELP KO NEWSAPI

async function fetchCyberNews() {
    const apiKey = '67fae57f26d5409bb1c59ce341ae8276'; // Apni key yahan dalein
    const url = `https://newsapi.org/v2/everything?q=cybersecurity+OR+hacking+OR+databreach&sortBy=publishedAt&language=en&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Pehli 5-10 headlines ko jama karna
        const headlines = data.articles.slice(0, 8).map(article => {
            return `🌐 ${article.title} | `;
        }).join(" ");

        // Marquee mein text update karna
        document.getElementById('cyber-marquee').innerText = headlines;
    } catch (error) {
        console.error("News fetch nahi ho saki:", error);
    }
}

// Page load hone par news fetch karein
fetchCyberNews();


    async function updateCyberNews() {
        const marquee = document.getElementById('cyber-news-ticker');
        // RSS to JSON converter use kar rahe hain taake news asani se mil jaye
        const feedUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://thehackernews.com/feeds/posts/default';

        try {
            const response = await fetch(feedUrl);
            const data = await response.json();

            if (data.status === 'ok') {
                const headlines = data.items.map(item => {
                    // Title ke sath alert emoji lagana
                    return `⚠️ ${item.title.toUpperCase()} --- `;
                }).join(" ");

                marquee.innerHTML = headlines;
            }
        } catch (error) {
            marquee.innerHTML = "🚨 Service temporary unavailable. Stay safe!";
            console.error("News load nahi ho saki:", error);
        }
    }

    // Run function
    updateCyberNews();
    
    // Har 30 minutes baad news refresh karein
    setInterval(updateCyberNews, 1800000);

    async function fetchCyberNews() {
        const marquee = document.getElementById('cyber-marquee');
        // News sources (Vulnerabilities, Malware, Attacks)
        const rssUrl = encodeURIComponent('https://thehackernews.com/feeds/posts/default');
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            if (data.status === 'ok') {
                const newsItems = data.items.map(item => {
                    return ` ⚠️ <span style="color: #fff;">${item.title}</span> &nbsp;&nbsp; | &nbsp;&nbsp; `;
                }).join('');
                
                marquee.innerHTML = newsItems + " Stay Safe in the Cyber World! ";
            }
        } catch (error) {
            marquee.innerHTML = "Error loading live news. Check your connection.";
            console.error("News Fetch Error:", error);
        }
    }

    // Run on load
    fetchCyberNews();
    // Refresh news every 30 minutes
    setInterval(fetchCyberNews, 1800000);


// Counter animation – starts when section is visible
document.querySelectorAll('#stats-section .counter').forEach(counter => {
  const target = parseInt(counter.querySelector('[data-target]')?.getAttribute('data-target') || counter.textContent, 10);
  if (!target || isNaN(target)) return;

  let count = 0;
  const duration = 1800; // ms
  const increment = target / (duration / 16); // ~60fps

  const updateCount = () => {
    count += increment;
    if (count < target) {
      const display = Math.floor(count).toLocaleString();
      const suffix = counter.querySelector('span:last-child')?.outerHTML || '';
      counter.innerHTML = display + (suffix ? ' ' + suffix : '');
      requestAnimationFrame(updateCount);
    } else {
      const suffix = counter.querySelector('span:last-child')?.outerHTML || '';
      counter.innerHTML = target.toLocaleString() + (suffix ? ' ' + suffix : '');
    }
  };

  // Intersection Observer – better performance
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        updateCount();
        observer.disconnect();
      }
    },
    { threshold: 0.4 }
  );

  observer.observe(counter.closest('.grid') || counter);
});


//     //awareness.html ki file ki section ka script code 
     
// // Yeh data array future mein badal sakte ho, add/remove/edit kar sakte ho
// const preventionTips = [
//     {
//         iconClass: "fa-key",
//         title: "Strong Passwords",
//         description: "Use unique, complex passwords and a manager."
//     },
//     {
//         iconClass: "fa-shield-alt",
//         title: "Enable 2FA",
//         description: "Add an extra layer of security to accounts."
//     },
//     {
//         iconClass: "fa-sync-alt",
//         title: "Regular Updates",
//         description: "Keep software and devices up to date."
//     }
//     // Agar aur tips chahiye to bas yahan naya object daal do
//     // Example: { iconClass: "fa-lock", title: "Use VPN", description: "..." }
// ];

// const gridContainer = document.getElementById("prevention-tips-grid");

// // Pehle grid ko khali kar do (agar static cards the to)
// gridContainer.innerHTML = "";

// // Har tip ke liye card banao aur add karo (exact same HTML structure)
// preventionTips.forEach(tip => {
//     const card = document.createElement("div");
//     card.className = "glass p-6 rounded-2xl";  // bilkul same class

//     card.innerHTML = `
//         <i class="fas ${tip.iconClass} text-4xl text-cyan-500 mb-4"></i>
//         <h4 class="text-xl font-bold mb-2">${tip.title}</h4>
//         <p class="text-sm text-gray-500">${tip.description}</p>
//     `;

//     gridContainer.appendChild(card);
// });


//awareness 
document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.attack-card');
    const modal = document.getElementById('attack-modal');
    const closeBtn = document.getElementById('close-modal');
    const title = document.getElementById('modal-title');
    const definition = document.getElementById('modal-definition');
    const how = document.getElementById('modal-how');
    const protection = document.getElementById('modal-protection');
    const video = document.getElementById('modal-video');
    const more = document.getElementById('modal-more');
    const moreLink = document.getElementById('modal-more-link');

    // Data for each threat (tera previous knowledge se compile kiya)
    const threats = {
        phishing: {
            title: 'Phishing',
            definition: 'Phishing ek cyber attack hai jisme attackers fake emails, messages ya websites banate hain jo real lagte hain, taake aap sensitive info (jaise passwords, credit card details) share kar do.',
            how: 'Yeh usually email se shuru hota hai jo urgent lagta hai (jaise "Your account is hacked! Click here"). Click karne pe malware install ho jata hai ya fake login page pe le jata hai. AI ab isko zyada personalized bana raha hai.',
            protection: [
                'Har urgent message ko verify karo (sender ka email check karo).',
                'Links pe click na karo — direct website jaao.',
                'Phishing-resistant MFA enable karo.',
                'Antivirus with AI detection use karo.'
            ],
            video: 'https://www.youtube.com/embed/qdpReVgpQhc', // Embed URL (iframe src)
            more: 'Aur details ke liye, yeh article padho ya awareness page visit karo.',
            moreLink: 'awareness.html#phishing' // Apne page ka link
        },
        malware: {
            title: 'Malware',
            definition: 'Malware malicious software hai jo aapke device ko infect karta hai, data steal karta hai, ya system damage karta hai (jaise viruses, trojans, spyware).',
            how: 'Yeh infected attachments, pirated software, ya vulnerable apps se aata hai. Ek baar install hone pe, background mein run hota hai aur data leak karta hai.',
            protection: [
                'Software hamesha update rakho.',
                'Antivirus scan regularly karo.',
                'Unknown sources se download na karo.',
                'Behavioral detection wala security tool use karo.'
            ],
            video: 'https://www.youtube.com/embed/NqhN-bhIC-0',
            more: 'Malware ke types aur examples ke liye yeh dekho.',
            moreLink: 'awareness.html#malware'
        },
        ransomware: {
            title: 'Ransomware',
            definition: 'Ransomware aapke files ko encrypt kar deta hai aur unko unlock karne ke badle paisa maangta hai (ransom).',
            how: 'Phishing ya vulnerability se entry milti hai, phir network scan karta hai, backups delete karta hai, aur files lock kar deta hai. Double extortion mein data leak bhi threaten karta hai.',
            protection: [
                'Offline backups rakho (3-2-1 rule).',
                'Ransomware protection wala antivirus use karo.',
                'Macros disable karo Office mein.',
                'Kabhi ransom na do — yeh encourage karta hai.'
            ],
            video: 'https://www.youtube.com/embed/lIsWpCMBxHQ',
            more: 'Recent ransomware attacks ke bare mein jaanne ke liye.',
            moreLink: 'awareness.html#ransomware'
        },
        'social-engineering': {
            title: 'Social Engineering',
            definition: 'Social engineering insaanon ko manipulate karta hai taake wo confidential info de dein, bina tech hack kiye.',
            how: 'Impersonation (jaise boss ban ke call), baiting (free offers), ya pretexting (fake story) se. Deepfakes ab isko aur dangerous bana rahe hain.',
            protection: [
                'Har request ko second channel se verify karo (jaise call back karo).',
                'Secret code words family/colleagues ke saath use karo.',
                'Awareness training lo.',
                'Urgent demands pe pause karo aur socho.'
            ],
            video: 'https://www.youtube.com/embed/uvKTMgWRPw4',
            more: 'Social engineering ke real examples aur tips.',
            moreLink: 'awareness.html#social-engineering'
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const threat = card.dataset.threat;
            const data = threats[threat];
            
            title.textContent = data.title;
            definition.textContent = data.definition;
            how.textContent = data.how;
            
            protection.innerHTML = '';
            data.protection.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                protection.appendChild(li);
            });
            
            video.innerHTML = `<iframe class="w-full h-full" src="${data.video}" frameborder="0" allowfullscreen></iframe>`;
            
            more.textContent = data.more;
            moreLink.href = data.moreLink;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    });

    // Overlay click to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    });
}); 



// <!-- Counter Animation Script - Ye sirf stats section ke liye hai -->


// Counter Animation with debug logs
document.addEventListener('DOMContentLoaded', function() {
    // Use more specific selector to avoid conflicts
    const counters = document.querySelectorAll('#stats-section .counter span[data-target]');

    console.log("Counters found:", counters.length);
    if (counters.length === 0) {
        console.warn("No counters found → check: #stats-section exists? .counter class? span[data-target]?");
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const span = entry.target;
            const targetStr = span.getAttribute('data-target') || '';
            console.log("Found counter → data-target =", targetStr);

            const target = Number(targetStr.trim());

            if (isNaN(target) || targetStr === '') {
                console.error("Invalid target value:", targetStr, "→ setting to ERR");
                span.textContent = 'ERR';
                return;
            }

            const suffixEl = span.nextElementSibling;
            const suffix = suffixEl ? suffixEl.textContent.trim() : '';

            let current = 0;
            const duration = 2200; // ms
            const increment = target / (duration / 16); // ~60 fps

            const isBig = target >= 1_000_000;

            function animate() {
                current += increment;

                if (current < target) {
                    let val = isBig 
                        ? Math.floor(current / 1_000_000).toLocaleString()
                        : Math.floor(current).toLocaleString();
                    span.textContent = val;
                    requestAnimationFrame(animate);
                } else {
                    let final = isBig 
                        ? (target / 1_000_000).toLocaleString() 
                        : target.toLocaleString();
                    span.textContent = final;
                    // Keep suffix as-is (it's outside the span)
                }
            }

            requestAnimationFrame(animate);
            observer.unobserve(span);
        });
    }, {
        threshold: 0.3,
        rootMargin: "0px 0px -80px 0px"
    });

    counters.forEach(el => {
        console.log("Observing:", el);
        observer.observe(el);
    });
});


// Very simple counter – starts when page loads
document.addEventListener('DOMContentLoaded', () => {
  const counters = document.querySelectorAll('span.counter[data-target]');

  counters.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    let current = 0;
    const increment = target / 120;   // ≈ 1.2 seconds – change to slower/faster
    const isBigNumber = target >= 1000000;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        // Show commas for millions, no decimal
        el.textContent = Math.floor(current).toLocaleString('en-US');
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target.toLocaleString('en-US');
      }
    };

    // Small delay so it feels natural + only run if in viewport (optional)
    setTimeout(() => {
      updateCount();
    }, 300);
  });
});

// how attacks unfold index.html js file

function toggleExpand(card) {
      const short = card.querySelector('.short-text');
      const full  = card.querySelector('.full-text');
      const btn   = card.querySelector('.toggle-btn');
      const close = card.querySelector('.close-indicator');

      if (full.classList.contains('hidden')) {
        // Expand
        short.classList.add('hidden');
        full.classList.remove('hidden');
        btn.textContent = 'Show Less ↑';
        close.classList.remove('hidden');
        card.classList.add('bg-opacity-10'); // optional visual feedback
      } else {
        // Collapse
        full.classList.add('hidden');
        short.classList.remove('hidden');
        btn.textContent = 'See More →';
        close.classList.add('hidden');
        card.classList.remove('bg-opacity-10');
      }
    }
    // videos link of related attacks
    


function toggleExpand(card) {
      const short = card.querySelector('.short-text');
      const full  = card.querySelector('.full-text');
      const btn   = card.querySelector('.toggle-btn');
      const close = card.querySelector('.close-indicator');

      if (full.classList.contains('hidden')) {
        short.classList.add('hidden');
        full.classList.remove('hidden');
        btn.textContent = 'Show Less ↑';
        close.classList.remove('hidden');
        card.classList.add('bg-opacity-10');
      } else {
        full.classList.add('hidden');
        short.classList.remove('hidden');
        btn.textContent = 'See More →';
        close.classList.add('hidden');
        card.classList.remove('bg-opacity-10');
      }
    }

    // toggle buttonjs

    // assets/js/script.js

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuBtn || !sidebar) return;

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('translate-x-full');
        sidebar.classList.toggle('translate-x-0');
        overlay.classList.toggle('opacity-0');
        overlay.classList.toggle('opacity-100');
        overlay.classList.toggle('pointer-events-none');
        overlay.classList.toggle('pointer-events-auto');

        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        
        const icon = menuBtn.querySelector('i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    });

    overlay.addEventListener('click', () => closeBtn.click());
}

// Theme Toggle
function initTheme() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    if (!toggleBtn || !icon) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        html.classList.remove('light-mode');
        icon.classList.replace('fa-sun', 'fa-moon');
    }

    // Toggle on click
    toggleBtn.addEventListener('click', () => {
        if (html.classList.contains('light-mode')) {
            html.classList.remove('light-mode');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.add('light-mode');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Navbar load + initialize everything
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            initMobileMenu();
            initTheme();           // ← theme bhi navbar load hone ke baad init karo
        })
        .catch(err => console.error('Navbar load failed:', err));
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
});
// assets/js/script.js

// Mobile Menu Toggle (tumhara existing code)
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('mobile-sidebar');
    const closeBtn = document.getElementById('close-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuBtn || !sidebar) return;

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('translate-x-full');
        sidebar.classList.toggle('translate-x-0');
        overlay.classList.toggle('opacity-0');
        overlay.classList.toggle('opacity-100');
        overlay.classList.toggle('pointer-events-none');
        overlay.classList.toggle('pointer-events-auto');

        const icon = menuBtn.querySelector('i');
        icon?.classList.toggle('fa-bars');
        icon?.classList.toggle('fa-times');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.add('translate-x-full');
        sidebar.classList.remove('translate-x-0');
        overlay.classList.add('opacity-0', 'pointer-events-none');
        overlay.classList.remove('opacity-100', 'pointer-events-auto');
        
        const icon = menuBtn.querySelector('i');
        icon?.classList.add('fa-bars');
        icon?.classList.remove('fa-times');
    });

    overlay.addEventListener('click', () => closeBtn.click());
}

// Theme Toggle (updated for better compatibility)
function initTheme() {
    const html = document.documentElement;
    const toggleBtn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');

    if (!toggleBtn || !icon) return;

    // Load saved theme (default dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        html.classList.add('light-mode');
        html.classList.remove('dark');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        html.classList.remove('light-mode');
        html.classList.add('dark');
        icon.classList.replace('fa-sun', 'fa-moon');
    }

    // Toggle function
    toggleBtn.addEventListener('click', () => {
        if (html.classList.contains('light-mode')) {
            html.classList.remove('light-mode');
            html.classList.add('dark');
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.add('light-mode');
            html.classList.remove('dark');
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Navbar fetch + init everything
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
            initMobileMenu();
            initTheme();  // Theme init after navbar loads (button available ho jaye)
        })
        .catch(err => console.error('Navbar load failed:', err));
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();

    // Back to top button (tumhara existing)
    const backToTop = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

