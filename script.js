// Sprofitzone Site Scripts

// ==== THEME INJECTION: runs immediately so no flash of wrong theme ====
(function () {
    const saved = localStorage.getItem('S Profit ZoneTheme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    document.body && document.body.classList.toggle('light-mode', saved === 'light');
})();

document.addEventListener('DOMContentLoaded', () => {
    console.log("S Profit Zone Site Loaded");

    // Inject theme switcher on all pages if not already present
    if (!document.querySelector('.theme-switcher')) {
        const switcher = document.createElement('div');
        switcher.className = 'theme-switcher';
        switcher.innerHTML = `
            <div class="theme-btn" data-theme="dark" title="Dark Mode" style="background: #0f0f0f; border: 2px solid #ff7a00; display: flex; align-items: center; justify-content: center; color: white;">
                <i class="fa-solid fa-moon" style="font-size: 14px;"></i>
            </div>
            <div class="theme-btn" data-theme="light" title="Light Mode" style="background: #ffffff; border: 2px solid transparent; display: flex; align-items: center; justify-content: center; color: black;">
                <i class="fa-solid fa-sun" style="font-size: 14px;"></i>
            </div>
        `;
        document.body.insertAdjacentElement('afterbegin', switcher);
    }

    // Sync active state on switcher buttons
    const currentTheme = localStorage.getItem('S Profit ZoneTheme') || 'light';
    document.querySelectorAll('.theme-btn[data-theme]').forEach(btn => {
        btn.style.borderColor = btn.dataset.theme === currentTheme ? '#ff7a00' : 'transparent';
    });

    // Add scroll effect to header
    const header = document.querySelector('header');
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    window.addEventListener('scroll', () => {
        const light = document.documentElement.getAttribute('data-theme') === 'light';
        if (window.scrollY > 50) {
            header.style.background = light ? 'rgba(255,255,255,0.98)' : 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            header.style.background = '';
            header.style.boxShadow = 'none';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // FAQ Toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current
            item.classList.toggle('active');
        });
    });

    // Simple Newsletter Form interaction (prevent default)
    const newsletterBtn = document.querySelector('.newsletter-form button');
    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', () => {
            alert("Thanks for subscribing! (Demo)");
        });
    }

    // AOS (Animate On Scroll) Implementation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add delay if specified
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, observerOptions);

    // Observe all elements with data-aos attribute
    document.querySelectorAll('[data-aos]').forEach(el => {
        aosObserver.observe(el);
    });

    // Also animate existing elements (backward compatibility)
    const legacyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Target elements for animation
    document.querySelectorAll('.glass-card:not([data-aos]), .section-header:not([data-aos]), .globe-container:not([data-aos])').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        legacyObserver.observe(el);
        el.classList.add('animate-on-scroll');
    });

    // Add global style for the animation class via JS
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMenu = document.querySelector('.close-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (hamburger && mobileMenu && closeMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeMenu.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});

// Stat Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 10000) {
        return Math.floor(num / 1000) + 'K+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K+';
    } else {
        return num + '+';
    }
}

// Trigger counter animation when stats come into view
document.addEventListener('DOMContentLoaded', function () {
    const statBoxes = document.querySelectorAll('.stat-box[data-count]');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statBoxes.forEach((box, index) => {
                    const target = parseInt(box.dataset.count);
                    const numberElement = box.querySelector('.stat-number');
                    if (numberElement) {
                        setTimeout(() => {
                            animateCounter(numberElement, target);
                        }, index * 100);
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    statBoxes.forEach(box => observer.observe(box));
});

// Greeting Card Logic - Shows for 5 seconds on first land
document.addEventListener('DOMContentLoaded', () => {
    // Check if greeting has been shown in this session
    if (!sessionStorage.getItem('greetingShown')) {
        // Create the greeting card element if it doesn't exist
        const greetingHTML = `
            <div id="greeting-overlay" class="greeting-overlay">
                <div class="greeting-card">
                    <h1 style="color: white !important;">Welcome To Sprofit Zone</h1>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', greetingHTML);

        const overlay = document.getElementById('greeting-overlay');

        // Trigger show animation
        setTimeout(() => {
            if (overlay) overlay.classList.add('show');
        }, 100);

        // Auto-hide after 2 seconds
        setTimeout(() => {
            if (overlay) {
                overlay.classList.remove('show');
                // Cleanup after transition
                setTimeout(() => {
                    overlay.remove();
                }, 1000);
            }
        }, 2000);

        // Mark as shown for this session
        sessionStorage.setItem('greetingShown', 'true');
    }
});

// Subscription Modal Functionality
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    const subscribeBtns = document.querySelectorAll('.subscribe-btn');
    const closeBtn = document.querySelector('.close-modal');
    const methodBtns = document.querySelectorAll('.method-btn');
    const detailsBox = document.getElementById('payment-details-box');
    const planText = document.getElementById('selected-plan-text');

    const paymentDetails = {
        easypaisa: `
            <div class="detail-item">
                <span class="detail-label">Account Name</span>
                <span class="detail-value">SAQIB ALI</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">EasyPaisa Number</span>
                <span class="detail-value">03419897103</span>
            </div>
        `,
        jazzcash: `
            <div class="detail-item">
                <span class="detail-label">Account Name</span>
                <span class="detail-value">SAQIB ALI</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">JazzCash Number</span>
                <span class="detail-value">03419897103</span>
            </div>
        `,
        bank: `
            <div class="detail-item">
                <span class="detail-label">Bank Name</span>
                <span class="detail-value">HBL (Habib Bank Limited)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Account Holder</span>
                <span class="detail-value">SAQIB ULLAH</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Account Number (IBAN)</span>
                <span class="detail-value">PK33HABB0012345678901234</span>
            </div>
        `,
        crypto: `
            <div class="detail-item">
                <span class="detail-label">Network</span>
                <span class="detail-value">USDT (TRC20)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wallet Address</span>
                <span class="detail-value">Trc20h7YQBRy1GQqJca6m69n4juWKLxge3</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Account Holder</span>
                <span class="detail-value">Muhammad Shahab</span>
            </div>
            <div class="detail-item" style="margin-top: 10px;">
                <span class="detail-label">Network</span>
                <span class="detail-value">BTC (Bitcoin)</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Wallet Address</span>
                <span class="detail-value">bc1qxy2kg...4zvk2p7vjqf</span>
            </div>
        `
    };

    function updateDetails(method) {
        detailsBox.innerHTML = paymentDetails[method];
        methodBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.method === method);
        });
    }

    subscribeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const plan = btn.dataset.plan;
            const price = btn.dataset.price;
            planText.innerHTML = `Plan: <span class="highlight">${plan}</span> - <span class="highlight">${price}</span>`;

            // Set default method
            updateDetails('easypaisa');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        });
    }

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    methodBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            updateDetails(btn.dataset.method);
        });
    });
    // Initialize Swiper list for control
    const allSwipers = [];

    // Initialize Mentor Swiper
    const mentorSwiper = new Swiper('.mentor-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        speed: 8000,
        freeMode: {
            enabled: true,
            momentum: false,
        },
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 1.5 },
            768: { slidesPerView: 2.2 },
            1200: { slidesPerView: 3.2 }
        }
    });
    allSwipers.push(mentorSwiper);

    // Initialize Academy Carousels
    const academyImageSwiper = new Swiper('.image-carousel', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 3500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
        }
    });
    allSwipers.push(academyImageSwiper);

    const academyVideoSwiper = new Swiper('.video-carousel', {
        slidesPerView: 1.5,
        spaceBetween: 20,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            576: { slidesPerView: 2.5 },
            992: { slidesPerView: 4 }
        }
    });
    allSwipers.push(academyVideoSwiper);

    // New Academy Highlights Carousels
    const seminarSwiper = new Swiper('.seminar-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 1.5 },
            992: { slidesPerView: 2 }
        }
    });
    allSwipers.push(seminarSwiper);

    const expoSwiper = new Swiper('.expo-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: { slidesPerView: 1.5 },
            992: { slidesPerView: 2 }
        }
    });
    allSwipers.push(expoSwiper);

    // Initialize Influencer Swiper
    const influencerSwiper = new Swiper('.influencer-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }
        }
    });
    allSwipers.push(influencerSwiper);

    // Helper functions for Swiper control
    function pauseAllSwipers() {
        document.body.classList.add('video-playing');
        allSwipers.forEach(s => {
            if (s.autoplay && s.autoplay.running) {
                s.autoplay.stop();
            }
        });
    }

    function resumeAllSwipers() {
        // Only resume if no video is playing
        const anyVideoPlaying = Array.from(document.querySelectorAll('video')).some(v => !v.paused && !v.ended);
        if (!anyVideoPlaying) {
            document.body.classList.remove('video-playing');
            allSwipers.forEach(s => {
                if (s.autoplay && !s.autoplay.running) {
                    s.autoplay.start();
                }
            });
        }
    }

    // In-frame Video Playback Logic (Enhanced delegation)
    document.addEventListener('click', (e) => {
        const frame = e.target.closest('.video-frame-item, .video-card, .ceremony-video-wrapper, .video-thumbnail-wrapper');
        if (frame && !e.target.closest('.open-media')) {
            const video = frame.querySelector('video');
            if (video) {
                if (video.paused) {
                    // Start from scratch as requested
                    video.currentTime = 0;

                    // Stop others
                    document.querySelectorAll('video').forEach(v => {
                        if (v !== video) {
                            v.pause();
                            v.closest('.video-frame-item, .video-card, .ceremony-video-wrapper, .video-thumbnail-wrapper')?.classList.remove('playing');
                        }
                    });
                    video.play().catch(err => {
                        video.muted = true;
                        video.play();
                    });
                    frame.classList.add('playing');
                    pauseAllSwipers();
                } else {
                    video.pause();
                    frame.classList.remove('playing');
                    resumeAllSwipers();
                }
            }
        }
    });

    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('play', () => {
            video.currentTime = 0;
            // Start from scratch as requested (if not already at 0)
            if (video.currentTime > 0 && video.paused) {
                // This might be tricky because play event fires after it starts playing.
            }
            // Simple approach: reset if it's not currently playing (but it is playing now)
            // The click handler already handles this for the main interaction.
            // For native controls, we might only want to reset if it was ended or similar.
            pauseAllSwipers();
            video.closest('.video-frame-item, .video-card, .ceremony-video-wrapper, .video-thumbnail-wrapper')?.classList.add('playing');
        });
        video.addEventListener('pause', () => {
            resumeAllSwipers();
            video.closest('.video-frame-item, .video-card, .ceremony-video-wrapper, .video-thumbnail-wrapper')?.classList.remove('playing');
        });
        video.addEventListener('ended', () => {
            resumeAllSwipers();
            video.closest('.video-frame-item, .video-card, .ceremony-video-wrapper, .video-thumbnail-wrapper')?.classList.remove('playing');
        });
    });




    // Feedback Popup Logic
    const feedbackBtn = document.getElementById('feedback-btn');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeFeedback = document.querySelector('.close-feedback');
    const feedbackForm = document.getElementById('feedback-form');

    if (feedbackBtn && feedbackModal) {
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        if (closeFeedback) {
            closeFeedback.addEventListener('click', () => {
                feedbackModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fb-name').value;
            alert(`Thank you for your feedback, ${name}! We will review it shortly.`);
            feedbackForm.reset();
            feedbackModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Media Modal (Academy Highlights)
    const mediaModal = document.getElementById('media-modal');
    const mediaModalBody = document.getElementById('media-modal-body');
    const closeMediaBtn = document.getElementById('close-media-modal');
    const mediaTriggers = document.querySelectorAll('.open-media');

    if (mediaModal && mediaModalBody && closeMediaBtn) {
        const setupTriggers = () => {
            document.querySelectorAll('.open-media').forEach(trigger => {
                if (!trigger.dataset.listener) {
                    trigger.addEventListener('click', () => {
                        const type = trigger.dataset.type;
                        const src = trigger.dataset.src;
                        mediaModalBody.innerHTML = '';
                        if (type === 'video') {
                            // Pause all in-frame videos first
                            document.querySelectorAll('video').forEach(v => {
                                v.pause();
                                v.closest('.video-frame-item, .video-card, .ceremony-video-wrapper, .video-thumbnail-wrapper')?.classList.remove('playing');
                            });

                            const video = document.createElement('video');
                            video.src = src;
                            video.controls = true;
                            video.autoplay = true;
                            video.style.width = '100%';
                            mediaModalBody.appendChild(video);
                            pauseAllSwipers(); // Pause swipers for modal video
                        } else {
                            const img = document.createElement('img');
                            img.src = src;
                            img.style.width = '100%';
                            img.style.objectFit = 'contain';
                            mediaModalBody.appendChild(img);
                        }

                        mediaModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });
                    trigger.dataset.listener = 'true';
                }
            });
        };

        setupTriggers();

        const closeMedia = () => {
            mediaModal.classList.remove('active');
            mediaModalBody.innerHTML = '';
            document.body.style.overflow = '';
            resumeAllSwipers(); // Resume swipers when modal is closed
        };

        closeMediaBtn.addEventListener('click', closeMedia);
        mediaModal.addEventListener('click', (e) => { if (e.target === mediaModal) closeMedia(); });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mediaModal.classList.contains('active')) closeMedia(); });
    }

    // Trigger counter animation for all data-count elements
    const statElements = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.dataset.count);
                const numberElement = entry.target.querySelector('.stat-number');
                if (numberElement) {
                    animateCounter(numberElement, target);
                    entry.target.classList.add('animated');
                }
            }
        });
    }, { threshold: 0.5 });
    statElements.forEach(el => countObserver.observe(el));

    // Handle Portrait Detection Automatically
    document.querySelectorAll('.gallery-card img, .gallery-card video').forEach(media => {
        const setPortrait = (width, height, element) => {
            const card = element.closest('.gallery-card');
            if (card && height > width) {
                card.dataset.portrait = 'true';
            }
        };

        if (media.tagName === 'IMG') {
            if (media.complete) {
                setPortrait(media.naturalWidth, media.naturalHeight, media);
            } else {
                media.onload = () => setPortrait(media.naturalWidth, media.naturalHeight, media);
            }
        } else if (media.tagName === 'VIDEO') {
            media.onloadedmetadata = () => setPortrait(media.videoWidth, media.videoHeight, media);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const videoElements = document.querySelectorAll('video');

    videoElements.forEach(video => {
        // Ensure the video is muted for autoplay to work reliably in most browsers.
        video.muted = true;

        // Enable autoplay
        video.autoplay = true;

        // Add controls for user interaction
        video.controls = true;

        // Attempt to play the video.
        // The .play() method returns a Promise, which can be handled for errors.
        video.play().then(() => {
            console.log('Video playing successfully:', video.src);
        }).catch(error => {
            console.error('Error attempting to play video:', video.src, error);
        });
    });
});

// Theme Switcher Logic - Uses event delegation so it works on injected buttons also
document.addEventListener('DOMContentLoaded', () => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem('S Profit ZoneTheme') || 'light';
    applyTheme(savedTheme);

    // Event delegation on body for theme buttons
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('.theme-btn[data-theme]');
        if (!btn) return;
        const theme = btn.dataset.theme;
        applyTheme(theme);
    });

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        document.body.classList.toggle('light-mode', theme === 'light');
        localStorage.setItem('S Profit ZoneTheme', theme);

        // Update all theme button styles
        document.querySelectorAll('.theme-btn[data-theme]').forEach(btn => {
            const isActive = btn.dataset.theme === theme;
            btn.style.borderColor = isActive ? '#ff7a00' : 'transparent';
            btn.classList.toggle('active', isActive);
        });

        // Also clear any inline header background set by scroll handler so CSS takes over
        const header = document.querySelector('header');
        if (header) {
            header.style.background = '';
            header.style.boxShadow = '';
        }
    }
});

// Sound logic for buttons
document.addEventListener('DOMContentLoaded', () => {
    // We defer AudioContext creation until first click per browser policy
    let audioCtx = null;

    function playButtonSound(type) {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            audioCtx = new AudioContextClass();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (type === 'primary') {
            // Success/Action sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
        } else if (type === 'secondary') {
            // Minor action sound
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(500, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.15);
        } else {
            // General button sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
        }
    }

    document.querySelectorAll('.btn, button, .mobile-link, .nav-links a').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.classList.contains('btn-primary') ? 'primary' : 
                         (btn.classList.contains('btn-secondary-outline') ? 'secondary' : 'other');
            playButtonSound(type);
        });
    });
});

// Money Ninja Trader Injection
document.addEventListener('DOMContentLoaded', () => {
    const ninjaHTML = `
        <div class="ninja-trader" id="ninja-trader-icon">
            <i class="fa-solid fa-user-ninja"></i>
            <i class="fa-solid fa-sack-dollar"></i>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', ninjaHTML);
});
