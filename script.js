document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. INICIALIZAÇÃO DE ÍCONES (LUCIDE ICONS)
       ========================================================================== */
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       2. CONTROLE DA NAVBAR (ROLAGEM E MENU MOBILE)
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const iconOpen = mobileMenuToggle.querySelector('.icon-open');
    const iconClose = mobileMenuToggle.querySelector('.icon-close');

    // Adiciona classe scrolled ao rolar a página
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Destaque de link ativo ao rolar
        detectActiveSection();
    });

    // Toggle do Menu Mobile
    mobileMenuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        
        if (isActive) {
            iconOpen.style.display = 'none';
            iconClose.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Evita scroll do fundo
        } else {
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Fechar menu mobile ao clicar em algum link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            iconOpen.style.display = 'block';
            iconClose.style.display = 'none';
            document.body.style.overflow = '';
        });
    });

    // Função para destacar o menu de acordo com a seção atual na tela
    function detectActiveSection() {
        const scrollPosition = window.scrollY + 120; // offset do header
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    /* ==========================================================================
       3. EFEITO DE BRILHO AO MOVER O MOUSE (BENTO GRID - ESTILO TECH)
       ========================================================================== */
    const bentoCards = document.querySelectorAll('.bento-card');
    
    bentoCards.forEach(card => {
        const glow = card.querySelector('.card-glow');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // Coordenada X relativa ao card
            const y = e.clientY - rect.top;  // Coordenada Y relativa ao card
            
            if (glow) {
                glow.style.setProperty('--x', `${x}px`);
                glow.style.setProperty('--y', `${y}px`);
            }
        });
    });

    /* ==========================================================================
       4. ANIMAÇÃO DE ELEMENTOS AO ROLAR A PÁGINA (REVEAL ON SCROLL)
       ========================================================================== */
    // Adicionamos classes de animação aos cards e cabeçalhos
    const scrollAnimateElements = [
        ...document.querySelectorAll('.bento-card'),
        ...document.querySelectorAll('.galeria-item'),
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.experiencia-row'),
        ...document.querySelectorAll('.localizacao-card'),
        ...document.querySelectorAll('.localizacao-map-container')
    ];

    scrollAnimateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    // Configurando o Intersection Observer
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                scrollObserver.unobserve(entry.target); // Para rodar a animação apenas uma vez
            }
        });
    }, {
        threshold: 0.1, // Dispara quando 10% do elemento está visível
        rootMargin: '0px 0px -50px 0px' // Margem inferior de segurança
    });

    scrollAnimateElements.forEach(el => {
        scrollObserver.observe(el);
    });


    /* ==========================================================================
       6. ANIMAÇÃO DE CONTADORES (SEÇÃO ESTATÍSTICAS)
       ========================================================================== */
    const estatisticasSection = document.querySelector('.section-estatisticas');
    const estatisticaNumbers = document.querySelectorAll('.estatistica-number');
    let animatedStats = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedStats) {
                animateNumbers();
                animatedStats = true;
            }
        });
    }, { threshold: 0.5 });

    if (estatisticasSection) {
        statsObserver.observe(estatisticasSection);
    }

    function animateNumbers() {
        estatisticaNumbers.forEach(num => {
            const targetValue = parseInt(num.getAttribute('data-value'), 10);
            const duration = 2000; // Duração de 2 segundos para a contagem
            const startTime = performance.now();

            function updateNumber(currentTime) {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1);
                
                // Função de easing out cubic para desacelerar no final
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                
                const currentValue = Math.floor(easeProgress * targetValue);
                num.textContent = currentValue;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    num.textContent = targetValue;
                }
            }

            requestAnimationFrame(updateNumber);
        });
    }

    /* ==========================================================================
       7. SLIDER PREMIUM DA GALERIA (CARROSSEL INTERATIVO MULTI-INSTÂNCIA)
       ========================================================================== */
    const sliderContainers = document.querySelectorAll('.gallery-slider-container');

    sliderContainers.forEach(container => {
        const slides = container.querySelectorAll('.slide-item');
        const prevBtn = container.querySelector('.slider-arrow.prev');
        const nextBtn = container.querySelector('.slider-arrow.next');
        const dotsContainer = container.querySelector('.slider-dots');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        if (totalSlides > 0 && dotsContainer) {
            // Gerar os indicadores (dots) dinamicamente
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetInterval();
                });
                dotsContainer.appendChild(dot);
            }

            const dots = dotsContainer.querySelectorAll('.dot');

            function goToSlide(index) {
                slides[currentSlide].classList.remove('active');
                dots[currentSlide].classList.remove('active');
                
                currentSlide = (index + totalSlides) % totalSlides;
                
                slides[currentSlide].classList.add('active');
                dots[currentSlide].classList.add('active');
            }

            function nextSlide() {
                goToSlide(currentSlide + 1);
            }

            function prevSlide() {
                goToSlide(currentSlide - 1);
            }

            // Eventos das Setas
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetInterval();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetInterval();
                });
            }

            // Auto play (troca a cada 5 segundos)
            function startInterval() {
                slideInterval = setInterval(nextSlide, 5000);
            }

            function resetInterval() {
                clearInterval(slideInterval);
                startInterval();
            }

            // Inicializa o autoplay
            startInterval();

            // Suporte a swipe no mobile
            let touchStartX = 0;
            let touchEndX = 0;

            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, { passive: true });

            function handleSwipe() {
                if (touchStartX - touchEndX > 50) {
                    nextSlide();
                    resetInterval();
                } else if (touchEndX - touchStartX > 50) {
                    prevSlide();
                    resetInterval();
                }
            }
        }
    });

    /* ==========================================================================
       8. LÓGICA DO LIGHTBOX GENÉRICO (AMPLIAÇÃO DE IMAGENS)
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close-btn');
    const lightboxPrev = document.getElementById('lightbox-prev-btn');
    const lightboxNext = document.getElementById('lightbox-next-btn');

    let lightboxItems = [];
    let currentLightboxIndex = 0;

    // Coleta todos os elementos que têm imagens ampliáveis
    const triggers = document.querySelectorAll('[data-lightbox-src]');
    
    triggers.forEach((trigger, index) => {
        const src = trigger.getAttribute('data-lightbox-src');
        const caption = trigger.getAttribute('data-lightbox-caption') || '';
        
        lightboxItems.push({ src, caption });

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentLightboxIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxContent() {
        const item = lightboxItems[currentLightboxIndex];
        if (item) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = item.src;
                lightboxCaption.textContent = item.caption;
                lightboxImg.style.opacity = '1';
            }, 150);
        }
    }

    function nextLightboxImage() {
        if (lightboxItems.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex + 1) % lightboxItems.length;
        updateLightboxContent();
    }

    function prevLightboxImage() {
        if (lightboxItems.length <= 1) return;
        currentLightboxIndex = (currentLightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
        updateLightboxContent();
    }

    // Event Listeners dos botões do Lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            nextLightboxImage();
        });
    }

    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            prevLightboxImage();
        });
    }

    // Fechar ao clicar fora da imagem (no overlay escuro)
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // Suporte ao teclado (Esc, setas)
    document.addEventListener('keydown', (e) => {
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextLightboxImage();
            } else if (e.key === 'ArrowLeft') {
                prevLightboxImage();
            }
        }
    });

    /* ==========================================================================
       9. RASTREAMENTO DE CONVERSÃO (GOOGLE ADS)
       ========================================================================== */
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (typeof gtag_report_conversion === 'function') {
                if (btn.target === '_blank') {
                    // Para links que abrem em nova aba, envia a conversão sem redirecionar na aba atual
                    gtag_report_conversion();
                } else {
                    // Para links que abrem na mesma aba, usa o fluxo padrão do Google com callback
                    e.preventDefault();
                    gtag_report_conversion(btn.href);
                }
            }
        });
    });
});
