document.addEventListener('DOMContentLoaded', () => {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    const welcomeSection = document.getElementById('welcome');
    const soundButton = document.getElementById('toggle-sound');
    const breathingCircle = document.querySelector('.breathing-circle');
    
    // Initialize enhanced background
    createFloatingHearts();
    
    // Initialize bouquet functionality
    initVirtualBouquet();
    
    // Initialize interactive notes
    initInteractiveNotes();
    
    // Initialize password-protected letter
    initPasswordLetter();
    
    // Remove any existing error messages
    const removeErrorMessages = () => {
        const errorMessages = document.querySelectorAll('.missing-files-warning');
        errorMessages.forEach(msg => msg.remove());
    };
    removeErrorMessages();
    
    // Single sound file for everything
    let soundFile = new Audio('sounds/sound.mp3');
    soundFile.loop = true;
    soundFile.volume = 0.7;
    
    // Preload sound
    function preloadSound() {
        try {
            soundFile.load();
            console.log("Sound preloaded");
        } catch (error) {
            console.error("Error preloading sound:", error);
        }
    }
    
    // Call preload function
    preloadSound();
    
    let soundPlaying = false;
    
    // Toggle sound
    soundButton.addEventListener('click', () => {
        if (soundPlaying) {
            soundFile.pause();
            soundButton.textContent = 'Turn Sound On';
            soundPlaying = false;
        } else {
            // Try to play sound
            soundFile.play().then(() => {
                console.log("Sound playing successfully");
                soundButton.textContent = 'Turn Sound Off';
                soundPlaying = true;
                
                // If we're already in the breathing section, make sure text is updated
                if (isElementVisible(document.getElementById('breathing'))) {
                    startBreathingCycle();
                }
            }).catch(error => {
                console.error('Audio play failed:', error);
                alert("Unable to play sound. Please check if your browser allows autoplay or if the sound file exists.");
            });
        }
    });
    
    // Function to check if element is visible
    const isElementVisible = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0
        );
    };
    
    // Breathing animation with emojis
    const breathingContainer = document.querySelector('.breath-container');
    const inhaleEmoji = document.querySelector('.inhale-emoji');
    const exhaleEmoji = document.querySelector('.exhale-emoji');
    const breathText = document.querySelector('.breathing-text');
    
    if (breathingContainer) {
        // Track breathing state
        let isInhaling = true;
        
        // Add click handler to breathing container to help with autoplay restrictions
        breathingContainer.addEventListener('click', () => {
            if (!soundPlaying) {
                // Try to enable sound when container is clicked
                soundFile.play().then(() => {
                    console.log("Sound playing successfully after click");
                    soundButton.textContent = 'Turn Sound Off';
                    soundPlaying = true;
                    startBreathingCycle();
                }).catch(error => {
                    console.error('Audio play failed after click:', error);
                });
            }
        });
        
        // Monitor the breathing section visibility
        const breathingSection = document.getElementById('breathing');
        const breathingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startBreathingCycle();
                } else {
                    stopBreathingCycle();
                }
            });
        }, { threshold: 0.5 });
        
        if (breathingSection) {
            breathingObserver.observe(breathingSection);
        }
        
        let breathingInterval;
        
        function startBreathingCycle() {
            // Initial state
            isInhaling = true;
            breathText.textContent = "Inhale";
            showInhaleEmoji();
            
            // Clear any existing interval
            if (breathingInterval) clearInterval(breathingInterval);
            
            // Set up the breathing cycle
            breathingInterval = setInterval(() => {
                if (isInhaling) {
                    // Switching to exhale
                    breathText.textContent = "Exhale";
                    showExhaleEmoji();
                } else {
                    // Switching to inhale
                    breathText.textContent = "Inhale";
                    showInhaleEmoji();
                }
                isInhaling = !isInhaling;
            }, 3500); // Half of the 7s animation cycle
        }
        
        function stopBreathingCycle() {
            if (breathingInterval) clearInterval(breathingInterval);
            breathText.textContent = "Breathe";
            hideAllEmojis();
        }
        
        function showInhaleEmoji() {
            if (inhaleEmoji && exhaleEmoji) {
                inhaleEmoji.style.opacity = "1";
                exhaleEmoji.style.opacity = "0";
            }
        }
        
        function showExhaleEmoji() {
            if (inhaleEmoji && exhaleEmoji) {
                inhaleEmoji.style.opacity = "0";
                exhaleEmoji.style.opacity = "1";
            }
        }
        
        function hideAllEmojis() {
            if (inhaleEmoji && exhaleEmoji) {
                inhaleEmoji.style.opacity = "0";
                exhaleEmoji.style.opacity = "0";
            }
        }
    }
    
    // Check if sound file exists
    function checkFileExists(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(true);
                } else {
                    callback(false);
                }
            }
        };
        xhr.send();
    }
    
    // Show welcome section initially
    welcomeSection.classList.add('active');
    
    // Check if element is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.7) &&
            rect.bottom >= 0
        );
    };
    
    // Create a function to make all sections before the current one active too
    const activatePreviousSections = (currentSectionIndex) => {
        for (let i = 0; i <= currentSectionIndex; i++) {
            sections[i].classList.add('active');
        }
    };
    
    // Check which section is in view and activate it
    const checkSections = () => {
        let lastActiveIndex = -1;
        
        sections.forEach((section, index) => {
            if (isInViewport(section)) {
                section.classList.add('active');
                lastActiveIndex = Math.max(lastActiveIndex, index);
            }
        });
        
        // Activate all sections before the last active one
        if (lastActiveIndex >= 0) {
            activatePreviousSections(lastActiveIndex);
        }
    };
    
    // Smooth scroll to section
    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth'
            });
        }
    };
    
    // Add stars background to welcome section
    const addStars = () => {
        const starsContainer = document.createElement('div');
        starsContainer.classList.add('stars-container');
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            // Random position
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            
            // Random size
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Random animation delay
            star.style.animationDelay = `${Math.random() * 5}s`;
            
            starsContainer.appendChild(star);
        }
        
        welcomeSection.appendChild(starsContainer);
    };
    
    // Add CSS for stars
    const addStarsCSS = () => {
        const style = document.createElement('style');
        style.textContent = `
            .stars-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: 1;
            }
            
            .star {
                position: absolute;
                background-color: #fff;
                border-radius: 50%;
                opacity: 0.5;
                animation: twinkle 5s infinite ease-in-out;
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.2; }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    };
    
    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            scrollToSection('encouragement');
        });
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', checkSections);
    
    // Also check sections on initial load and after a small delay to ensure all content is visible
    checkSections();
    window.addEventListener('load', () => {
        checkSections();
        // Check again after a short delay to catch any sections that might have been missed
        setTimeout(checkSections, 500);
    });
    
    // Add a scroll trigger that checks more frequently while scrolling
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            checkSections();
        }, 100);
    });
    
    // Initialize
    addStarsCSS();
    addStars();
    checkSections();
    
    // Add special animation to note elements
    const notes = document.querySelectorAll('.note');
    notes.forEach(note => {
        note.addEventListener('mouseenter', () => {
            note.style.zIndex = '10';
        });
        
        note.addEventListener('mouseleave', () => {
            note.style.zIndex = '1';
        });
    });
    
    // Handle photo placeholder click
    const photoPlaceholder = document.querySelector('.photo-placeholder');
    if (photoPlaceholder) {
        photoPlaceholder.addEventListener('click', () => {
            photoPlaceholder.innerHTML = `
                <p>To add photos, replace this placeholder with &lt;img&gt; tags pointing to your images, or use the FileReader API to allow direct uploads.</p>
            `;
        });
    }
    
    // YouTube Player Widget
    const playerWidget = document.getElementById('player-widget');
    const closePlayerBtn = document.getElementById('close-player');
    const currentSongTitle = document.getElementById('current-song-title');
    const playButtons = document.querySelectorAll('.play-button');
    
    // Create YouTube player element
    let youtubePlayer;
    let isSmallScreen = window.innerWidth <= 768;
    
    // Handle widget positioning on scroll
    function updateWidgetPosition() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.scrollHeight;
        
        // Only adjust position if player is active and we're on a small screen
        if (playerWidget.classList.contains('active') && isSmallScreen) {
            if (scrollY + windowHeight >= documentHeight - 100) {
                // Near bottom of page, switch to absolute positioning
                playerWidget.style.position = 'absolute';
                playerWidget.style.top = (documentHeight - 220) + 'px';
                playerWidget.style.bottom = 'auto';
            } else {
                // Reset to fixed positioning
                playerWidget.style.position = 'fixed';
                playerWidget.style.top = 'auto';
                playerWidget.style.bottom = '20px';
            }
        }
    }
    
    // Load YouTube API
    function loadYouTubeAPI() {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
    
    // Initialize when API is ready
    window.onYouTubeIframeAPIReady = function() {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '100%',
            width: '100%',
            playerVars: {
                'autoplay': 1,
                'controls': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };
    
    function onPlayerReady(event) {
        // Player is ready
        console.log('YouTube player is ready');
    }
    
    // Open player widget and play video
    function openPlayerWithVideo(videoId, songTitle) {
        currentSongTitle.textContent = songTitle;
        playerWidget.classList.add('active');
        
        // If player is already initialized, load and play the video
        if (youtubePlayer && youtubePlayer.loadVideoById) {
            youtubePlayer.loadVideoById(videoId);
        } else {
            // Create a temporary iframe until the API is loaded
            const tempIframe = document.createElement('iframe');
            tempIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
            tempIframe.width = '100%';
            tempIframe.height = '100%';
            tempIframe.frameBorder = '0';
            tempIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            tempIframe.allowFullscreen = true;
            
            const playerContainer = document.getElementById('youtube-player');
            playerContainer.innerHTML = '';
            playerContainer.appendChild(tempIframe);
        }
        
        // Update widget position
        updateWidgetPosition();
    }
    
    // Close player widget
    closePlayerBtn.addEventListener('click', () => {
        playerWidget.classList.remove('active');
        if (youtubePlayer && youtubePlayer.stopVideo) {
            youtubePlayer.stopVideo();
        }
    });
    
    // Add click events to all play buttons
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const musicPlayer = e.currentTarget.closest('.music-player');
            const videoId = musicPlayer.dataset.youtubeId;
            const songTitle = musicPlayer.querySelector('.song-title').textContent;
            openPlayerWithVideo(videoId, songTitle);
        });
    });
    
    // Add scroll and resize event listeners
    window.addEventListener('scroll', updateWidgetPosition);
    window.addEventListener('resize', () => {
        isSmallScreen = window.innerWidth <= 768;
        updateWidgetPosition();
    });
    
    // Load YouTube API
    loadYouTubeAPI();
    
    // Function to initialize Virtual Bouquet
    function initVirtualBouquet() {
        const revealBouquetBtn = document.getElementById('reveal-bouquet');
        const bouquetDisplay = document.querySelector('.bouquet-display');
        
        if (revealBouquetBtn && bouquetDisplay) {
            revealBouquetBtn.addEventListener('click', function() {
                // Hide the message and button
                const bouquetMessage = document.querySelector('.bouquet-message');
                bouquetMessage.style.display = 'none';
                
                // Show the bouquet display with animation
                bouquetDisplay.style.display = 'block';
                
                // Add a small confetti effect
                createConfetti();
            });
        }
    }
    
    // Function to create a simple confetti effect
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'confetti-container';
        
        // Add the confetti container to the DOM
        const surprise = document.querySelector('.virtual-bouquet');
        surprise.appendChild(confettiContainer);
        
        // Add style for confetti
        const style = document.createElement('style');
        style.textContent = `
            .confetti-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: var(--medium-purple);
                opacity: 0.8;
                animation: fall 4s ease-out forwards;
            }
            
            @keyframes fall {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(500px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Create confetti pieces
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random position, size, color and animation
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 10 + 5}px`;
            confetti.style.background = getRandomColor();
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            
            confettiContainer.appendChild(confetti);
        }
        
        // Remove confetti after animation completes
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 5000);
    }
    
    // Helper function to get random colors for confetti
    function getRandomColor() {
        const colors = [
            'var(--medium-purple)', 
            'var(--light-purple)', 
            'var(--dark-purple)', 
            'var(--pale-lavender)', 
            '#ff9ff3', // Pink
            '#feca57'  // Yellow
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Function to create floating hearts background
    function createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        if (!heartsContainer) return;
        
        // Add more hearts dynamically
        const heartSymbols = ['❤', '💕', '💖', '💗', '💓', '💞'];
        const heartCount = 15;
        
        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
            
            // Random initial position
            heart.style.left = `${Math.random() * 100}%`;
            heart.style.top = `${Math.random() * 100 + 100}%`; // Start below the screen
            
            // Random size
            const size = Math.random() * 20 + 10; // 10-30px
            heart.style.fontSize = `${size}px`;
            
            // Random animation duration
            const duration = Math.random() * 10 + 10; // 10-20s
            heart.style.animationDuration = `${duration}s`;
            
            // Random animation delay
            heart.style.animationDelay = `${Math.random() * 10}s`;
            
            // Random opacity
            heart.style.opacity = (Math.random() * 0.5 + 0.2).toString(); // 0.2-0.7
            
            // Add heart to container
            heartsContainer.appendChild(heart);
        }
        
        // Add heart styles
        const style = document.createElement('style');
        style.textContent = `
            .floating-heart {
                position: absolute;
                color: var(--light-purple);
                animation: float-heart 15s linear infinite;
                pointer-events: none;
            }
            
            @keyframes float-heart {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(0.8);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                50% {
                    transform: translate(${Math.random() > 0.5 ? '+' : '-'}30px, -50vh) rotate(${Math.random() * 360}deg) scale(1);
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.2;
                }
                100% {
                    transform: translate(${Math.random() > 0.5 ? '+' : '-'}50px, -100vh) rotate(${Math.random() * 720}deg) scale(0.8);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Function to initialize the interactive notes in the Appreciation Wall
    function initInteractiveNotes() {
        const notes = document.querySelectorAll('.note.unopened');
        
        notes.forEach(note => {
            note.addEventListener('click', function() {
                // Only apply animation if not already opened
                if (!this.classList.contains('opened')) {
                    this.classList.add('opened');
                    
                    // Add a small confetti burst when opening
                    createNoteConfetti(this);
                    
                    // Play a soft sound effect if sound is enabled
                    if (soundPlaying) {
                        playNoteOpenSound();
                    }
                }
            });
        });
    }
    
    // Function to create a small confetti burst when opening a note
    function createNoteConfetti(noteElement) {
        const noteRect = noteElement.getBoundingClientRect();
        const centerX = noteRect.left + noteRect.width / 2;
        const centerY = noteRect.top + noteRect.height / 2;
        
        // Create confetti container
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'note-confetti-container';
        confettiContainer.style.position = 'fixed';
        confettiContainer.style.left = '0';
        confettiContainer.style.top = '0';
        confettiContainer.style.width = '100%';
        confettiContainer.style.height = '100%';
        confettiContainer.style.pointerEvents = 'none';
        confettiContainer.style.zIndex = '9999';
        document.body.appendChild(confettiContainer);
        
        // Create confetti pieces
        const colors = [
            'var(--medium-purple)',
            'var(--light-purple)',
            'var(--dark-purple)',
            'var(--pale-lavender)',
            '#ff9ff3'
        ];
        
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'note-confetti';
            
            // Position at center of the note
            confetti.style.position = 'fixed';
            confetti.style.left = `${centerX}px`;
            confetti.style.top = `${centerY}px`;
            
            // Random size
            const size = Math.random() * 8 + 5;
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            
            // Random color
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random shape
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            
            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 5 + 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            // Apply animation
            confetti.animate([
                { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                { transform: `translate(${vx * 20}px, ${vy * 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 1000 + 500,
                easing: 'cubic-bezier(0, .9, .57, 1)',
                fill: 'forwards'
            });
            
            confettiContainer.appendChild(confetti);
        }
        
        // Remove container after animation
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 2000);
    }
    
    // Function to play a soft sound when opening a note
    function playNoteOpenSound() {
        try {
            // Create a soft note sound using AudioContext
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create oscillator
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Set properties
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(700, audioContext.currentTime + 0.1);
            
            // Set volume
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
            
            // Connect and start
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Could not play note sound effect:', error);
        }
    }
    
    // Function to initialize password protection for love letter
    function initPasswordLetter() {
        const unlockButton = document.getElementById('unlock-letter');
        const passwordInput = document.getElementById('letter-password');
        const passwordMessage = document.getElementById('password-message');
        const letterContent = document.querySelector('.letter-content');
        const passwordContainer = document.querySelector('.letter-password-wrapper');
        
        if (!unlockButton || !passwordInput || !letterContent) return;
        
        // Set up event listeners
        unlockButton.addEventListener('click', checkPassword);
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                checkPassword();
            }
        });
        
        // Check if password is correct
        function checkPassword() {
            const password = passwordInput.value.trim();
            const validPasswords = ['bossing', 'love', 'Bossing', 'Love', 'BOSSING', 'LOVE'];
            
            if (validPasswords.includes(password)) {
                // Success - show letter content
                passwordMessage.textContent = 'Unlocked with love! ❤️';
                passwordMessage.className = 'password-message success';
                
                // Show letter with animation
                setTimeout(() => {
                    passwordContainer.style.display = 'none';
                    letterContent.style.display = 'block';
                    letterContent.classList.add('unlocked');
                    
                    // Create heart particles on success
                    createHeartParticles();
                }, 1000);
            } else if (password === '') {
                // Empty input
                passwordMessage.textContent = 'Please enter our endearment';
                passwordMessage.className = 'password-message error';
            } else {
                // Wrong password - angry emoji with steam as in the photo
                passwordMessage.innerHTML = 'Hmmm di mo alam ha <span class="angry-emoji">😤</span>';
                passwordMessage.className = 'password-message error';
                
                // Shake effect on input
                passwordInput.classList.add('shake');
                setTimeout(() => {
                    passwordInput.classList.remove('shake');
                }, 500);
            }
        }
        
        // Function to create floating hearts when password is correct
        function createHeartParticles() {
            const paperElement = document.querySelector('.paper');
            const heartSymbols = ['❤️', '💕', '💖', '💗'];
            
            // Add heart animation style
            const style = document.createElement('style');
            style.textContent = `
                @keyframes floatHeart {
                    0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 0.8; }
                    100% { transform: translate(var(--tx), -100px) rotate(var(--tr)); opacity: 0; }
                }
                
                .heart-particle {
                    position: absolute;
                    font-size: var(--size);
                    animation: floatHeart var(--duration) ease-out forwards;
                    z-index: 10;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
            
            // Create hearts
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.className = 'heart-particle';
                    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                    
                    // Random position at the bottom of the paper
                    const paperRect = paperElement.getBoundingClientRect();
                    const heartX = Math.random() * paperRect.width;
                    heart.style.left = `${heartX}px`;
                    heart.style.bottom = '0';
                    
                    // Random animation properties
                    heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
                    heart.style.setProperty('--tr', `${Math.random() * 360}deg`);
                    heart.style.setProperty('--size', `${Math.random() * 20 + 20}px`);
                    heart.style.setProperty('--duration', `${Math.random() * 2 + 2}s`);
                    
                    // Add to paper
                    paperElement.appendChild(heart);
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (heart.parentNode) {
                            heart.parentNode.removeChild(heart);
                        }
                    }, 4000);
                }, i * 100); // Stagger creation
            }
        }
        
        // Add shake animation for wrong password
        const shakeStyle = document.createElement('style');
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
            
            .shake {
                animation: shake 0.5s ease;
            }
        `;
        document.head.appendChild(shakeStyle);
    }
}); 