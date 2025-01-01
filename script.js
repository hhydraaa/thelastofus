// Sayfa yüklendiğinde ve yenilendiğinde en üste scroll
window.onload = () => {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}

// Sayfa yenilenmeden önce
window.onbeforeunload = () => {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}

// Hash değişiminde (URL'de # ile belirtilen kısım değiştiğinde)
window.onhashchange = () => {
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}

// DOMContentLoaded event'inde
document.addEventListener('DOMContentLoaded', () => {
    // Sayfayı en üste taşı
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });

    // Loading screen kontrolü
    const loadingScreen = document.querySelector('.loading-screen');
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 500);
    }, 2000);

    // Dil kontrolü
    const preferredLang = localStorage.getItem('preferredLanguage') || 'en';
    changeLang(preferredLang);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Audio Player
const song = document.getElementById('song');
const playBtn = document.querySelector('.play-btn');
const progress = document.querySelector('.progress');
const currentTime = document.querySelector('.current-time');
const totalTime = document.querySelector('.total-time');
const volumeSlider = document.querySelector('.volume-slider');
const volumeProgress = document.querySelector('.volume-progress');
const volumeIcon = document.querySelector('.volume-control i');

// Play/Pause
function togglePlay() {
    if (song.paused) {
        song.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        song.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

playBtn.addEventListener('click', togglePlay);

// Update Progress Bar
song.addEventListener('timeupdate', () => {
    const progressPercent = (song.currentTime / song.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    
    // Update current time
    const minutes = Math.floor(song.currentTime / 60);
    const seconds = Math.floor(song.currentTime % 60);
    currentTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

// Set Progress Bar on Click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = song.duration;
    song.currentTime = (clickX / width) * duration;
}

document.querySelector('.progress-bar').addEventListener('click', setProgress);

// Set Total Time when metadata is loaded
song.addEventListener('loadedmetadata', () => {
    const minutes = Math.floor(song.duration / 60);
    const seconds = Math.floor(song.duration % 60);
    totalTime.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});

// Volume Control
function setVolume(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = volumeSlider.clientWidth;
    let volume = clickX / width;
    
    // Sınırları kontrol et
    volume = Math.max(0, Math.min(1, volume));
    
    // Ses seviyesini ayarla
    song.volume = volume;
    volumeProgress.style.width = `${volume * 100}%`;
    
    // Volume icon'unu güncelle
    updateVolumeIcon(volume);
}

// Volume icon'unu güncelle
function updateVolumeIcon(volume) {
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Click ve drag events
volumeSlider.addEventListener('mousedown', (e) => {
    setVolume(e);
    document.addEventListener('mousemove', setVolume);
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', setVolume);
    });
});

// Volume icon click - Mute/Unmute
let previousVolume = 0.5;
volumeIcon.addEventListener('click', () => {
    if (song.volume > 0) {
        previousVolume = song.volume;
        song.volume = 0;
        volumeProgress.style.width = '0%';
        volumeIcon.className = 'fas fa-volume-mute';
    } else {
        song.volume = previousVolume;
        volumeProgress.style.width = `${previousVolume * 100}%`;
        updateVolumeIcon(previousVolume);
    }
});

// Reset when song ends
song.addEventListener('ended', () => {
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    progress.style.width = '0%';
    currentTime.textContent = '0:00';
});

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    }
});

// Hover effect for progress bar
const progressBar = document.querySelector('.progress-bar');
progressBar.addEventListener('mouseover', () => {
    progressBar.style.height = '6px';
});
progressBar.addEventListener('mouseout', () => {
    progressBar.style.height = '4px';
});

// Initialize volume
song.volume = 0.5;
volumeProgress.style.width = '50%';

// Playlist array'ini güncelle
const playlist = [
    {
        title: "Through The Valley",
        artist: "Ellie",
        file: "ttv.mp3",
        duration: "3:25"
    },
    {
        title: "True Faith",
        artist: "Ellie",
        file: "true-faith.mp3",
        duration: "3:42"
    },
    {
        title: "Take On Me",
        artist: "Ellie",
        file: "take-on-me.mp3",
        duration: "3:48"
    },
    {
        title: "Future Days",
        artist: "Joel",
        file: "future-days.mp3",
        duration: "3:06"
    },
    {
        title: "The Path",
        artist: "Gustavo Santaolalla",
        file: "the-path.mp3",
        duration: "4:15"
    }
];

let currentSongIndex = 0;

// Butonları seç
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const shuffleBtn = document.querySelector('.shuffle');
const repeatBtn = document.querySelector('.repeat');

// Shuffle ve repeat durumları
let isShuffling = false;
let isRepeating = false;

// Previous Song
prevBtn.addEventListener('click', () => {
    currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : playlist.length - 1;
    loadSong(currentSongIndex);
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    song.play();
});

// Next Song
nextBtn.addEventListener('click', () => {
    currentSongIndex = currentSongIndex < playlist.length - 1 ? currentSongIndex + 1 : 0;
    loadSong(currentSongIndex);
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    song.play();
});

// Shuffle Toggle
shuffleBtn.addEventListener('click', () => {
    isShuffling = !isShuffling;
    shuffleBtn.style.color = isShuffling ? 'var(--light-blue)' : 'var(--white)';
});

// Repeat Toggle
repeatBtn.addEventListener('click', () => {
    isRepeating = !isRepeating;
    repeatBtn.style.color = isRepeating ? 'var(--light-blue)' : 'var(--white)';
});

// Load Song
function loadSong(index) {
    const song = playlist[index];
    document.querySelector('.song-info h3').textContent = song.title;
    document.querySelector('.song-info p').textContent = song.artist;
    document.getElementById('song').src = `audios/${song.file}`;
    progress.style.width = '0%';
    currentTime.textContent = '0:00';
}

// Şarkı bittiğinde
song.addEventListener('ended', () => {
    if (isRepeating) {
        song.currentTime = 0;
        song.play();
    } else if (isShuffling) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentSongIndex && playlist.length > 1);
        currentSongIndex = newIndex;
        loadSong(currentSongIndex);
        song.play();
    } else {
        nextBtn.click(); // Sonraki şarkıya geç
    }
});

// Butonlara hover efekti ekle
[prevBtn, nextBtn, shuffleBtn, repeatBtn].forEach(btn => {
    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'scale(1.2)';
    });
    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'scale(1)';
    });
});

// Track click handler
document.querySelectorAll('.track').forEach((track, index) => {
    track.addEventListener('click', () => {
        // Active class'ı güncelle
        document.querySelector('.track.active')?.classList.remove('active');
        track.classList.add('active');
        
        // Şarkıyı yükle ve çal
        currentSongIndex = index;
        loadSong(currentSongIndex);
        song.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    });
});

// Tüm metinlerin çevirileri
const translations = {
    en: {
        // Navigation
        story: "Story",
        journey: "Journey",
        gallery: "Gallery",
        music: "Music", 
        loadingText: "LOADING",
        // Hero Section
        tagline: "When you're lost in the darkness, look for the light",
        
        // Story Section
        storyTitle: "THE STORY",
        storyTitle2: "A TALE OF VENGEANCE",
        storyText: "Five years after their dangerous journey across the post-pandemic United States, Ellie and Joel have settled down in Jackson, Wyoming. Living among a thriving community of survivors has allowed them to find peace, despite the constant threat of the infected and other, more desperate survivors.",
        storyQuote: "I'm gonna find... and I'm gonna kill... every last one of them.",

        // Journey Section
        journeyTitle: "THE JOURNEY",
        jackson: {
            title: "JACKSON",
            description: "Ellie and Joel have found a peaceful life in Jackson, Wyoming. Living safely within the community has been possible despite the threat of the infected and other survivors. Here, Ellie has developed her musical talent, strengthened her father-daughter relationship with Joel, and grown closer to Dina."
        },
        seattle: {
            title: "SEATTLE",
            description: "After a tragic event, Ellie begins a relentless pursuit of vengeance in Seattle's dangerous streets. She confronts ruthless groups like the Washington Liberation Front (WLF) and Seraphites. With Dina's support, she fights infected and enemies while trying to maintain her humanity."
        },
        santaBarbara: {
            title: "SANTA BARBARA",
            description: "Ellie's journey of vengeance concludes in the sunny shores of Santa Barbara, California. Here, she encounters the ruthless Rattlers group. Using all her skills and survival instincts, she wages both a physical and psychological battle. Ellie's superior combat abilities, intelligence, and determination make her a true survival master. However, the cost of revenge will leave deep scars on her soul."
        },

        // Gallery Section
        galleryTitle: "GALLERY",
        gallerySubtitle: "Moments from the journey",

        // Music Section
        musicTitle: "MUSICS",
        musicSubtitle: "The soundtrack of survival",
        nowPlaying: "Now Playing",
        composer: "Composer",
        composerText: "Two-time Academy Award-winning composer, capturing the soul of The Last of Us with his unique music. Minimal and emotional compositions perfectly reflect the game's atmosphere.",
        awards: "Academy Award Winner",
        performer: "Voice & Performance",
        performerText: "Voice actress Ashley Johnson, who plays Ellie, also showcases her musical talent. 'Through the Valley' and 'Take On Me' covers add depth to the game's emotional story.",
        awards2: "BAFTA Award Winner",
        soundtrackTitle: "Soundtrack",
        soundtrackText: "In the post-apocalyptic world, music becomes a symbol of hope and humanity. From acoustic guitar to minimal melodies, every note deepens the story.",
        soundtrackTag: "Minimal",
        soundtrackTag2: "Emotional",
        soundtrackTag3: "Atmospheric",
        duration: "Duration",
        volume: "Volume"
    },
    tr: {
        // Navigasyon
        story: "Hikaye",
        journey: "Yolculuk",
        gallery: "Galeri",
        music: "Müzik",
        loadingText: "YÜKLENİYOR",
        // Hero Section
        tagline: "Karanlıkta kaybolduğunda, ışığı ara",
        
        // Story Section
        storyTitle: "HİKAYE",
        storyTitle2: "BİR İNTİKAM HİKAYESİ",
        storyText: "Salgın sonrası Amerika Birleşik Devletleri'ndeki tehlikeli yolculuklarından beş yıl sonra, Ellie ve Joel Wyoming, Jackson'a yerleşti. Hayatta kalanlardan oluşan gelişen bir topluluk içinde yaşamak, enfekte olmuşların ve daha umutsuz hayatta kalanların sürekli tehdidine rağmen huzur bulmalarını sağladı.",
        storyQuote: "Onları bulacağım... ve öldüreceğim... her birini..",

        // Journey Section
        journeyTitle: "YOLCULUK",
        jackson: {
            title: "JACKSON",
            description: "Ellie ve Joel, Wyoming'deki Jackson kasabasında huzurlu bir yaşam sürmektedir. Topluluk içinde güvenli bir yaşam, enfekte olmuşların ve diğer hayatta kalanların tehdidine rağmen mümkün olmuştur. Ellie burada müzik yeteneğini geliştirmiş, Joel ile baba-kız ilişkisini güçlendirmiş ve Dina ile yakınlaşmıştır."
        },
        seattle: {
            title: "SEATTLE",
            description: "Trajik bir olay sonrası intikam yolculuğuna çıkan Ellie, Seattle'ın tehlikeli sokaklarında amansız bir takibe başlar. Washington Liberation Front (WLF) ve Seraphites gibi acımasız gruplarla karşı karşıya gelir. Bu yolculukta Dina'nın desteğiyle, enfekte olmuşlar ve düşmanlarla mücadele ederken, insanlığını korumaya çalışır."
        },
        santaBarbara: {
            title: "SANTA BARBARA",
            description: "Ellie'nin intikam yolculuğunun son durağı, Kaliforniya'nın güneşli sahillerindeki Santa Barbara'dır. Burada, Rattlers adlı acımasız bir grupla karşılaşır. Tüm yeteneklerini ve hayatta kalma içgüdülerini kullanarak, hem fiziksel hem de psikolojik bir savaş verir. Ellie'nin üstün dövüş yetenekleri, zekası ve kararlılığı, onu gerçek bir hayatta kalma ustası yapar. Ancak intikamın bedeli, onun ruhunda derin izler bırakacaktır."
        },

        // Gallery Section
        galleryTitle: "GALERİ",
        gallerySubtitle: "Yolculuktan kareler",

        // Music Section
        musicTitle: "MÜZİKLER",
        musicSubtitle: "Hayatta kalmanın müziği",
        nowPlaying: "Şimdi Çalıyor",
        composer: "Besteci",
        composerText: "İki Oscar ödüllü besteci, The Last of Us'un ruhunu benzersiz müziğiyle yakalıyor. Minimal ve duygusal kompozisyonlarıyla oyunun atmosferini mükemmel şekilde yansıtıyor.",
        awards: "Academy Ödülü Kazananı",
        performer: "Ses & Performans",
        performerText: "Ellie'yi canlandıran Ashley Johnson, karakterin müzikal yönünü de ustaca sergiliyor. 'Through the Valley' ve 'Take On Me' cover'larıyla oyunun duygusal derinliğini artırıyor.",
        awards2: "BAFTA Ödülü Kazananı",
        soundtrackTitle: "Müzik",
        soundtrackText: "Post-apokaliptik dünyada müzik, umut ve insanlığın sembolü haline geliyor. Akustik gitardan minimal melodilere, her nota hikayeyi derinleştiriyor.",
        soundtrackTag: "Minimal",
        soundtrackTag2: "Duygusal",
        soundtrackTag3: "Atmosferik",
        duration: "Süre",
        volume: "Ses"
    }
};

// changeLang fonksiyonunu güncelle
function changeLang(lang) {
    // Tüm metinleri önce gizle
    const fadeOut = () => {
        document.querySelectorAll('[data-translate]').forEach(element => {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.3s ease';
        });
    };

    // Metinleri değiştir ve göster
    const updateAndFadeIn = () => {
        // Dil butonlarını güncelle
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Metinleri güncelle
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[lang][key]) {
                element.textContent = translations[lang][key];
                element.style.opacity = '1';
            }
        });

        // Timeline içeriğini güncelle
        document.querySelectorAll('.timeline-item').forEach((item, index) => {
            const sections = ['jackson', 'seattle', 'santaBarbara'];
            const section = translations[lang][sections[index]];
            item.querySelector('h3').textContent = section.title;
            item.querySelector('p').textContent = section.description;
        });
    };

    // Sıralı işlem
    fadeOut();
    setTimeout(updateAndFadeIn, 300);

    // Dil tercihini kaydet
    localStorage.setItem('preferredLanguage', lang);
}

// Event listener'ları güncelle
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => changeLang(btn.dataset.lang));
});
