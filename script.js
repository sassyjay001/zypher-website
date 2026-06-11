document.addEventListener('DOMContentLoaded', () => {
    setupPageLoadExperience();
    setupCurrentYear();
    setupActiveNavigation();
    setupMobileNavigation();
    setupSmoothScroll();
    setupRevealAnimations();
    setupScrollEnhancements();
    setupCounterAnimations();
    setupContactContext();
    setupContactForm();
    setupResourceSignup();
    setupProductFilters();
    setupFaqAccordion();
    setupMessageCounter();
    setupButtonMicroInteractions();
    setupCardTilt();
    setupHeroParallax();
    setupTestimonialRotator();
});

function setupPageLoadExperience() {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loader = document.createElement('div');

    loader.className = 'page-loader';
    loader.setAttribute('aria-hidden', 'true');
    loader.innerHTML = '<div class="loader-inner"><span class="loader-orb"></span><p class="loader-word">Zypher</p></div>';
    document.body.appendChild(loader);

    requestAnimationFrame(() => {
        loader.classList.add('is-visible');
    });

    let finished = false;
    const complete = () => {
        if (finished) {
            return;
        }
        finished = true;
        root.classList.remove('loading');
        root.classList.add('page-ready');
        loader.classList.add('is-exit');
        window.setTimeout(() => {
            loader.remove();
        }, reducedMotion ? 0 : 460);
    };

    const delay = reducedMotion ? 0 : 280;
    if (document.readyState === 'complete') {
        window.setTimeout(complete, delay);
    } else {
        window.addEventListener(
            'load',
            () => {
                window.setTimeout(complete, delay);
            },
            { once: true }
        );
        window.setTimeout(complete, 2300);
    }
}

function setupCurrentYear() {
    const year = new Date().getFullYear();
    document.querySelectorAll('.year').forEach((node) => {
        node.textContent = String(year);
    });
}

function setupActiveNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
        const target = link.getAttribute('href');
        if (target === currentPath) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        }
    });
}

function setupMobileNavigation() {
    const nav = document.getElementById('site-nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelectorAll('.nav-links a');

    if (!nav || !toggle) {
        return;
    }

    const setOpenState = (isOpen) => {
        nav.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.textContent = isOpen ? 'Close' : 'Menu';
    };

    toggle.addEventListener('click', () => {
        const openNow = !nav.classList.contains('open');
        setOpenState(openNow);
    });

    links.forEach((link) => {
        link.addEventListener('click', () => setOpenState(false));
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) {
            setOpenState(false);
        }
    });
}

function setupSmoothScroll() {
    const buttons = document.querySelectorAll('[data-scroll-target]');
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const selector = button.getAttribute('data-scroll-target');
            if (!selector) {
                return;
            }
            const target = document.querySelector(selector);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupRevealAnimations() {
    const sections = document.querySelectorAll('.hidden');
    if (!sections.length) {
        return;
    }

    sections.forEach((section, index) => {
        const delay = Math.min((index % 6) * 65, 320);
        section.style.setProperty('--reveal-delay', `${delay}ms`);
    });

    if (!('IntersectionObserver' in window)) {
        sections.forEach((section) => section.classList.add('show-section'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, localObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show-section');
                    localObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    sections.forEach((section) => observer.observe(section));
}

function setupScrollEnhancements() {
    const nav = document.getElementById('site-nav');
    const progress = document.getElementById('scrollProgress');
    const backToTop = document.getElementById('backToTop');

    if (!nav && !progress && !backToTop) {
        return;
    }

    const onScroll = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const viewport = window.innerHeight;
        const fullHeight = document.documentElement.scrollHeight;
        const scrollable = Math.max(fullHeight - viewport, 1);
        const ratio = Math.min(scrollY / scrollable, 1);

        if (nav) {
            nav.classList.toggle('scrolled', scrollY > 24);
        }

        if (progress) {
            progress.style.transform = `scaleX(${ratio})`;
        }

        if (backToTop) {
            backToTop.classList.toggle('show', scrollY > 360);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function setupCounterAnimations() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) {
        return;
    }

    const animateCounter = (counter) => {
        if (counter.dataset.animated === 'true') {
            return;
        }
        counter.dataset.animated = 'true';

        const target = Number(counter.dataset.counterTarget || 0);
        const decimalPlaces = Number(counter.dataset.counterDecimal || 0);
        const suffix = counter.dataset.counterSuffix || '';
        const duration = 1300;
        const startTime = performance.now();

        const frame = (time) => {
            const progress = Math.min((time - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            const formatted = decimalPlaces > 0 ? current.toFixed(decimalPlaces) : Math.round(current).toString();
            counter.textContent = `${formatted}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };

        requestAnimationFrame(frame);
    };

    if (!('IntersectionObserver' in window)) {
        counters.forEach(animateCounter);
        return;
    }

    const counterObserver = new IntersectionObserver(
        (entries, localObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    localObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.65 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));
}

function setupContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');

    if (!form || !status) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
            status.textContent = 'Please complete all required fields before sending.';
            status.classList.add('show', 'error');
            return;
        }

        status.textContent = 'Message sent successfully. We will be in touch soon.';
        status.classList.remove('error');
        status.classList.add('show');
        form.reset();
        const messageCounter = document.getElementById('messageCount');
        if (messageCounter) {
            messageCounter.textContent = '0/500';
        }

        setTimeout(() => {
            status.classList.remove('show');
        }, 4500);
    });
}

function setupContactContext() {
    const form = document.getElementById('contactForm');
    if (!form) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const contextMap = [
        ['product', 'Product Demo'],
        ['package', 'Engagement Package'],
        ['resource', 'Resource Request'],
        ['solution', 'Solution Blueprint'],
    ];
    const match = contextMap.find(([key]) => params.has(key));

    if (!match) {
        return;
    }

    const [key, interest] = match;
    const context = params.get(key);
    const interestField = document.getElementById('interest');
    const sourceField = document.getElementById('sourceContext');
    const messageField = document.getElementById('message');

    if (interestField) {
        interestField.value = interest;
    }

    if (sourceField && context && !sourceField.value) {
        sourceField.value = context;
    }

    if (messageField && context && !messageField.value) {
        messageField.value = `I would like to discuss ${context}.`;
    }
}

function setupResourceSignup() {
    const forms = document.querySelectorAll('[data-newsletter-form]');
    if (!forms.length) {
        return;
    }

    forms.forEach((form) => {
        const status = form.querySelector('[data-newsletter-status]');
        if (!status) {
            return;
        }

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            if (!form.checkValidity()) {
                status.textContent = 'Please enter a valid email address.';
                status.classList.add('show', 'error');
                return;
            }

            status.textContent = 'You are subscribed. Watch your inbox for the next Zypher note.';
            status.classList.remove('error');
            status.classList.add('show');
            form.reset();

            window.setTimeout(() => {
                status.classList.remove('show');
            }, 4500);
        });
    });
}

function setupProductFilters() {
    const buttons = document.querySelectorAll('.filter-btn[data-filter]');
    const cards = document.querySelectorAll('.product-card[data-category]');
    const emptyState = document.getElementById('productEmptyState');

    if (!buttons.length || !cards.length) {
        return;
    }

    const applyFilter = (filter) => {
        let visibleCount = 0;

        cards.forEach((card) => {
            const category = card.getAttribute('data-category');
            const matches = filter === 'all' || category === filter;
            card.classList.toggle('is-filtered-out', !matches);
            card.setAttribute('aria-hidden', String(!matches));
            if (matches) {
                visibleCount += 1;
            }
        });

        buttons.forEach((button) => {
            const isActive = button.getAttribute('data-filter') === filter;
            button.classList.toggle('active', isActive);
            button.setAttribute('aria-pressed', String(isActive));
        });

        if (emptyState) {
            emptyState.classList.toggle('show', visibleCount === 0);
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter') || 'all';
            applyFilter(filter);
        });
    });

    const activeButton = document.querySelector('.filter-btn.active[data-filter]');
    applyFilter(activeButton?.getAttribute('data-filter') || 'all');
}

function setupFaqAccordion() {
    const items = document.querySelectorAll('.faq-item');
    if (!items.length) {
        return;
    }

    items.forEach((item) => {
        const button = item.querySelector('.faq-question');
        if (!button) {
            return;
        }

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            items.forEach((other) => {
                const otherButton = other.querySelector('.faq-question');
                other.classList.remove('open');
                if (otherButton) {
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            });

            if (!isOpen) {
                item.classList.add('open');
                button.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

function setupMessageCounter() {
    const textarea = document.getElementById('message');
    const counter = document.getElementById('messageCount');

    if (!textarea || !counter) {
        return;
    }

    const max = Number(textarea.getAttribute('maxlength')) || 500;
    if (textarea.dataset.counterBound === 'true') {
        counter.textContent = `${textarea.value.length}/${max}`;
        return;
    }

    const updateCounter = () => {
        counter.textContent = `${textarea.value.length}/${max}`;
    };

    textarea.addEventListener('input', updateCounter);
    textarea.dataset.counterBound = 'true';
    updateCounter();
}

function setupButtonMicroInteractions() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .rotator-btn, .filter-btn');
    if (!buttons.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener('pointerdown', (event) => {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            ripple.style.left = `${event.clientX - rect.left}px`;
            ripple.style.top = `${event.clientY - rect.top}px`;
            button.appendChild(ripple);
            window.setTimeout(() => ripple.remove(), 620);
        });
    });
}

function setupCardTilt() {
    const cards = document.querySelectorAll('.interactive-card');
    if (!cards.length) {
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        return;
    }

    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;
    if (!supportsFinePointer) {
        return;
    }

    cards.forEach((card) => {
        card.addEventListener('pointermove', (event) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const rotateY = ((event.clientX - centerX) / rect.width) * 7;
            const rotateX = ((centerY - event.clientY) / rect.height) * 7;

            card.style.setProperty('--card-rotate-x', `${rotateX.toFixed(2)}deg`);
            card.style.setProperty('--card-rotate-y', `${rotateY.toFixed(2)}deg`);
        });

        card.addEventListener('pointerleave', () => {
            card.style.setProperty('--card-rotate-x', '0deg');
            card.style.setProperty('--card-rotate-y', '0deg');
        });
    });
}

function setupHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) {
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsFinePointer = window.matchMedia('(pointer:fine)').matches;

    if (reducedMotion || !supportsFinePointer) {
        return;
    }

    hero.addEventListener('pointermove', (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
        const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;

        hero.style.setProperty('--hero-shift-x', `${(x * 36).toFixed(2)}px`);
        hero.style.setProperty('--hero-shift-y', `${(y * 36).toFixed(2)}px`);
    });

    hero.addEventListener('pointerleave', () => {
        hero.style.setProperty('--hero-shift-x', '0px');
        hero.style.setProperty('--hero-shift-y', '0px');
    });
}

function setupTestimonialRotator() {
    const stages = document.querySelectorAll('[data-rotator]');
    if (!stages.length) {
        return;
    }

    stages.forEach((stage) => {
        const cards = stage.querySelectorAll('[data-quote]');
        if (!cards.length) {
            return;
        }

        const previousButton = stage.querySelector('[data-rotator-prev]');
        const nextButton = stage.querySelector('[data-rotator-next]');
        let currentIndex = 0;
        let intervalId;

        const show = (nextIndex) => {
            currentIndex = (nextIndex + cards.length) % cards.length;
            cards.forEach((card, index) => {
                const active = index === currentIndex;
                card.classList.toggle('is-active', active);
                card.setAttribute('aria-hidden', String(!active));
            });
        };

        const stop = () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = undefined;
            }
        };

        const start = () => {
            stop();
            intervalId = setInterval(() => {
                show(currentIndex + 1);
            }, 5400);
        };

        previousButton?.addEventListener('click', () => {
            show(currentIndex - 1);
            start();
        });

        nextButton?.addEventListener('click', () => {
            show(currentIndex + 1);
            start();
        });

        stage.addEventListener('mouseenter', stop);
        stage.addEventListener('mouseleave', start);

        show(0);
        start();
    });
}
