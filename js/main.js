/**
 * Main JavaScript - Navigation and Page Animations
 */

// Object list mapping (30 objects based on GLB files)
const OBJECTS = [
    { id: 1, nameKz: 'Өнер орталығы', nameRu: 'Центр искусств', nameEn: 'Art Center', modelFile: '' },
    { id: 2, nameKz: 'Центр «Анага Тагзым»', nameRu: 'Центр «Анага Тагзым»', nameEn: 'Anaga Tagzim Center', modelFile: '' },
    { id: 3, nameKz: 'Неке сарайы', nameRu: 'Дворец бракосочетания', nameEn: 'Wedding Palace', modelFile: 'Wedding_Palace.glb' },
    { id: 4, nameKz: '«ForteBank» акционерлік қоғамы', nameRu: 'Акционерное общество «ForteBank»', nameEn: 'ForteBank JSC', modelFile: 'ForteBank.glb' },
    { id: 5, nameKz: 'Қорқыт ата атындағы халықаралық әуежай', nameRu: 'Международный аэропорт имени Коркыт ата', nameEn: 'Korkyt Ata International Airport', modelFile: 'Airport.glb' },
    { id: 6, nameKz: 'Президенттік парк', nameRu: 'Президентский парк города Кызылорда', nameEn: 'Presidential Park', modelFile: 'Presidential_Park.glb' },
    { id: 7, nameKz: '«QazaqGaz» компаниясы', nameRu: 'Акционерное общество национальная компания «QazaqGaz»', nameEn: 'QazaqGaz National Company', modelFile: 'QazaqGaz.glb' },
    { id: 8, nameKz: 'Қызылорда облысы әкімдігі', nameRu: 'Акимат Кызылординской области', nameEn: 'Kyzylorda Region Akimat', modelFile: 'Akimat.glb' },
    { id: 9, nameKz: 'Теміржол вокзалы', nameRu: 'Железнодорожный вокзал с капитальным ремонтом', nameEn: 'Railway Station', modelFile: 'Railway_Station.glb' },
    { id: 10, nameKz: 'Қорқыт ата университеті', nameRu: 'Кызылординский университет имени Коркыт Ата', nameEn: 'Korkyt Ata University', modelFile: 'Korkyt_Ata_University.glb' },
    { id: 11, nameKz: '«Болашак» университеті', nameRu: 'Университет «Болашак»', nameEn: 'Bolashak University', modelFile: 'Bolashak_University.glb' },
    { id: 12, nameKz: 'Жастар орталығы', nameRu: 'Молодежный центр', nameEn: 'Youth Center', modelFile: 'Youth_Center.glb' },
    { id: 13, nameKz: 'Т. Жүргенов атындағы шығармашылық үйі', nameRu: 'Дом творчества имени Т. Жургенова', nameEn: 'T. Zhurgenov House of Creativity', modelFile: 'Zhurgenov_House.glb' },
    { id: 14, nameKz: 'Орталық мешіт', nameRu: 'Центральная мечеть «Акмешит-Сырдарья»', nameEn: 'Central Mosque Akmeshit-Syrdarya', modelFile: 'Central_Mosque.glb' },
    { id: 15, nameKz: '«Сыр Сүлейі» алеясы', nameRu: 'Аллея «Cыр Сулейи»', nameEn: 'Syr Suleyi Alley', modelFile: 'Alley_Syr_Suleyi.glb' },
    { id: 16, nameKz: '«Қорқыт Ата» ескерткіші', nameRu: 'Памятник «Коркыт Ата»', nameEn: 'Korkyt Ata Monument', modelFile: 'Korkyt_Ata_Monument.glb' },
    { id: 17, nameKz: 'Өшпес даңқ мемориалы', nameRu: 'Мемориал «Вечная слава»', nameEn: 'Eternal Glory Memorial', modelFile: 'Oshpes_Dank.glb' },
    { id: 18, nameKz: '«Сыр Ана» монументі', nameRu: 'Монумент «Сыр Ана»', nameEn: 'Syr Ана Monument', modelFile: 'Syr_Ana_Monument.glb' },
    { id: 19, nameKz: 'Асқар Тоқмағанбетов атындағы мәдениет үйі', nameRu: 'Дом культуры имени Аскара Токмаганбетова', nameEn: 'Askhar Tokmagambetov House of Culture', modelFile: 'A_Tokmaganbetov.glb', embedUrl: '' },
    { id: 20, nameKz: 'Сәбира Майқанова атындағы мәдениет үйі', nameRu: 'Дом культуры имени Сабиры Майкановой', nameEn: 'Sabira Maykanova House of Culture', modelFile: 'S_Maykanova.glb', embedUrl: '' },
    { id: 21, nameKz: '«Рухани жаңғыру» орталығы', nameRu: 'Центр «Рухани жаңғыру»', nameEn: 'Ruhani Zhangyru Center', modelFile: 'Ruhaniyat_Center.glb' },
    { id: 22, nameKz: 'Достық үйі', nameRu: 'Дом дружбы', nameEn: 'House of Friendship', modelFile: '' },
    { id: 23, nameKz: 'Ғани Мұратбаев атындағы орталық стадион', nameRu: 'Центральный стадион имени Гани Муратбаева', nameEn: 'Gani Muratbaev Central Stadium', modelFile: 'stadion.glb' },
    { id: 24, nameKz: '«Сыр бойының батырлары» ескерткіші', nameRu: 'Памятник «Батыры Сыр бойы»', nameEn: 'Monument "Batyrs of Syr Region"', modelFile: 'news_models/Syr_Suleileri.glb' },
    { id: 25, nameKz: '«Ақмешіт» мұражайы', nameRu: 'Музей «Акмешит»', nameEn: 'Akmeshit Museum', modelFile: 'news_models/Akmeshit_murazhai.glb' },
    { id: 26, nameKz: 'Қызылорда қаласындағы химия-биология бағытындағы Назарбаев Зияткерлік мектебі', nameRu: 'Назарбаев Интеллектуальная школа химико-биологического направления в городе Кызылорда', nameEn: 'Nazarbayev Intellectual School of Chemistry and Biology in Kyzylorda', modelFile: 'news_models/Nazanbayev_Zyatkerlik_Mektebi.glb' },
    { id: 27, nameKz: 'Евразия мәдени-спорт кешені', nameRu: 'Евразия культурно-спортивный комплекс', nameEn: 'Eurasia Cultural and Sports Complex', modelFile: 'news_models/Evraziya_sport_kesheni.glb' },
    { id: 28, nameKz: 'Мұз айдыны', nameRu: 'Ледовый дворец', nameEn: 'Ice Arena', modelFile: 'news_models/Muz_aidyni.glb' },
    { id: 29, nameKz: 'Қызылорда Облыстық Көркем сурет Галереясы', nameRu: 'Кызылординская областная художественная галерея', nameEn: 'Kyzylorda Regional Art Gallery', modelFile: 'news_models/Korkem_suret_galereya.glb' },
    { id: 30, nameKz: 'Мәдина Ералиева атындағы мәдениет үйі', nameRu: 'Дом культуры имени Мадины Ералиевой', nameEn: 'Madina Eralieva House of Culture', modelFile: '' }
];

/**
 * Get object name based on current language
 */
function getObjectName(obj) {
    const lang = langManager ? langManager.getCurrentLang() : 'kz';
    if (lang === 'ru') return obj.nameRu;
    if (lang === 'en') return obj.nameEn;
    return obj.nameKz;
}

/**
 * Initialize main page
 */
async function initMainPage() {
    // Load objects grid
    await loadObjectsGrid();

    // Setup scroll animations
    setupScrollAnimations();

    // Load hero content
    await loadHeroContent();
}

/**
 * Load objects grid on index page
 */
async function loadObjectsGrid() {
    const grid = document.getElementById('objectsGrid');
    if (!grid) return;

    // Названия только из OBJECTS в этом файле (UTF-8), без objects-list.txt —
    // иначе при порче .txt на диске снова появлялись «????» вместо текста.
    grid.innerHTML = '';
    OBJECTS.forEach((obj) => {
        const card = document.createElement('a');
        card.href = `object.html?id=${obj.id}`;
        card.className = 'object-card';
        card.innerHTML = `
            <div class="object-card-title">${getObjectName(obj)}</div>
        `;
        grid.appendChild(card);
    });
}

// Make function globally available
window.loadObjectsGrid = loadObjectsGrid;

/**
 * Load hero section content
 */
async function loadHeroContent() {
    const titleEl = document.getElementById('heroTitle');
    const introEl = document.getElementById('heroIntro');
    const objectsTitleEl = document.getElementById('objectsTitle');

    if (!titleEl || !introEl) return;

    const lang = langManager ? langManager.getCurrentLang() : 'kz';
    try {
        const res = await fetchTextUtf8(`data/${lang}/hero.txt`);
        if (res.ok) {
            const text = res.text;
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length >= 1) {
                titleEl.textContent = lines[0];
                if (lines.length >= 2) {
                    introEl.textContent = lines[1];
                }
                if (lines.length >= 3 && objectsTitleEl) {
                    objectsTitleEl.textContent = lines[2];
                }
            }
        }
    } catch (error) {
        console.warn('Hero content file not found, using defaults');
    }
}

// Make function globally available
window.loadHeroContent = loadHeroContent;

/**
 * Setup scroll animations
 */
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.object-card, .task-section, .model-viewer-container').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Load object page content
 */
async function loadObjectPage(objectId) {
    if (!objectId) {
        objectId = new URLSearchParams(window.location.search).get('id');
    }

    if (!objectId) {
        console.error('No object ID provided');
        return;
    }

    const lang = langManager ? langManager.getCurrentLang() : 'kz';

    try {
        // Load object content
        const content = await langManager.loadObjectContent(objectId);
        if (!content) {
            throw new Error('Failed to load object content');
        }

        // Update page title
        const titleEl = document.getElementById('objectTitle');
        if (titleEl) {
            titleEl.textContent = content.title || 'Жүктелуде...';
        }
        document.title = (content.title || 'Нысан') + ' | Білім беру сайты';

        // Update description
        const descEl = document.getElementById('objectDescription');
        if (descEl && content.description) {
            descEl.innerHTML = '<p>' + content.description.split('\n').join('</p><p>') + '</p>';
        }

        // Load images
        await loadObjectImages(objectId);

        // Update task content
        const taskEl = document.getElementById('taskContent');
        if (taskEl && content.task) {
            // Remove "Решение:" or "Шешуі:" and everything after
            let taskText = content.task;
            const solutionMarkers = ['Решение:', 'Шешуі:', 'Solution:', 'Жауабы:', 'Ответ:', 'Answer:'];
            for (const marker of solutionMarkers) {
                const index = taskText.indexOf(marker);
                if (index !== -1) {
                    taskText = taskText.substring(0, index).trim();
                    break;
                }
            }
            taskEl.innerHTML = '<p>' + taskText.split('\n').filter(line => line.trim()).join('</p><p>') + '</p>';
        }

        // Store answer for validation
        if (window.taskManager && content.answer) {
            window.taskManager.setCurrentAnswer(content.answer);
        }

        // Load 3D model or Iframe
        const obj = OBJECTS.find(o => o.id === parseInt(objectId));
        const viewerContainer = document.getElementById('modelViewer');
        const fullscreenBtn = document.getElementById('fullscreenBtn');

        if (obj && obj.embedUrl) {
            // Use Iframe
            if (viewerContainer) {
                viewerContainer.innerHTML = `
                    <iframe src="${obj.embedUrl}" 
                            frameborder="0" 
                            allowfullscreen 
                            mozallowfullscreen="true" 
                            webkitallowfullscreen="true" 
                            allow="autoplay; fullscreen; xr-spatial-tracking" 
                            xr-spatial-tracking 
                            execution-while-out-of-viewport 
                            execution-while-not-rendered 
                            web-share 
                            style="width: 100%; height: 100%; border: none;">
                    </iframe>
                `;
            }
            if (fullscreenBtn) {
                fullscreenBtn.style.display = 'none'; // Sketchfab has its own
            }
        } else if (window.modelViewer && typeof window.modelViewer.loadModel === 'function') {
            // Use Three.js
            if (obj && obj.modelFile) {
                try {
                    await window.modelViewer.loadModel(obj.modelFile);
                } catch (error) {
                    console.error('Error loading 3D model:', error);
                }
            }
            if (fullscreenBtn) {
                fullscreenBtn.style.display = 'block';
            }
        } else {
            console.warn('ModelViewer not initialized or loadModel not available');
            // Try to initialize viewer
            if (viewerContainer && typeof ModelViewer3D !== 'undefined') {
                window.modelViewer = new ModelViewer3D('modelViewer');
                if (obj && obj.modelFile) {
                    setTimeout(async () => {
                        try {
                            await window.modelViewer.loadModel(obj.modelFile);
                        } catch (error) {
                            console.error('Error loading 3D model after init:', error);
                        }
                    }, 500);
                }
            }
        }

    } catch (error) {
        console.error('Error loading object page:', error);
        const titleEl = document.getElementById('objectTitle');
        if (titleEl) {
            titleEl.textContent = 'Қате: Деректер жүктелмеді';
        }
    }
}

// Make function globally available
window.loadObjectPage = loadObjectPage;

/**
 * Load images for object
 */
async function loadObjectImages(objectId) {
    const galleryEl = document.getElementById('imageGallery');
    if (!galleryEl) return;

    // Mapping of object IDs to image file names
    const objectImages = {
        1: ['XXL_height.webp'], // Центр искусств
        2: ['feed.jpeg'], // Центр «Анага Тагзым»
        3: ['XL.webp'], // Дворец бракосочетания
        4: ['1539233318vqis7_1000x768.jpg'], // ForteBank
        5: ['1-5.webp'],
        6: ['1535456186_001.jpg'], // Президентский парк
        7: ['XXL_height.webp'],
        8: ['e6eoB7RLqa5R9HPC9ygRI4e_1ih7w63jUIKBfVBjNr3NMi1_0ZPM_RwzBFTxAkc35EESaDQPUbS6QQTmZIr_azr17VP-Fe6uVOA4yLsyHTOS88trboG051fbjXY7X0SduwsGSK-x54NcNwsJok4PPqguf39aInzP-Wt9027jhgBYqpoVtHDLgl3MCN7uDRQB.webp'],
        9: ['XXL_height.webp'],
        10: ['Kazakhstan_Qyzylorda_Universitet_Korkyt-Ata.jpg'], // Университет Коркыт Ата
        11: ['hqdefault.jpg'], // Университет Болашак
        12: ['shara-15.jpg'],
        13: ['i.webp'], // Дом творчества
        14: ['1536206452_mesht.jpg'], // Мечеть
        15: ['1535964944_001.jpg'],  // Аллея
        16: ['Korkyt-ata.jpg'], // Памятник «Коркыт Ата»
        17: ['image011.jpg'], // Мемориал «Вечная слава»
        18: ['сыр ана.jpg'], // Монумент «Сыр Ана»
        19: ['3.jpg'], // Дом культуры имени Аскара Токмаганбетова
        20: ['487540669_4346044205679992_2297677844093243506_n.jpg'], // Дом культуры Майкановой
        21: ['1538462150_article_b.jpeg'],  // Центр «Рухани жаңғыру»
        22: ['_gluster_2026_1_6_24b946658d5f0a6c37dfa9a5fc81d715_1280x720.jpg'],   // Дом дружбы
        23: ['stadium_new.jpg'],   // Стадион
        24: ['batyrs.jpg'],   // Памятник «Батыры Сыр бойы»
        25: ['museum.jpg'],   // Музей «Акмешит»
        26: ['nis.jpg'],   // НИШ ХБН г. Кызылорда
        27: ['eurasia.jpg'],   // Евразия КСК
        28: ['ice_arena.jpg'],   // Ледовый дворец
        29: ['gallery.jpg'],   // Областная художественная галерея
        30: ['madina_eralieva.jpg']    // Дом культуры имени Мадины Ералиевой
    };

    // Try to load image list first
    try {
        const res = await fetchTextUtf8(`images/object${objectId}/list.txt`);
        if (res.ok) {
            const imageList = res.text.split('\n').filter(line => line.trim());
            if (imageList.length > 0) {
                galleryEl.innerHTML = imageList.map(img => `
                    <div class="gallery-item">
                        <img src="images/object${objectId}/${img.trim()}" alt="Нысан суреті" loading="lazy" onerror="this.parentElement.style.display='none'">
                    </div>
                `).join('');
                return;
            }
        }
    } catch (error) {
        console.warn('Image list not found, using default images');
    }

    // Use default images from mapping
    galleryEl.innerHTML = '';
    const images = objectImages[parseInt(objectId)] || [];

    if (images.length > 0) {
        galleryEl.innerHTML = images.map(img => `
            <div class="gallery-item">
                <img src="images/object${objectId}/${img}" alt="Нысан суреті" loading="lazy" onerror="this.parentElement.style.display='none'">
            </div>
        `).join('');
    } else {
        galleryEl.innerHTML = '<p style="text-align: center; padding: 20px; color: var(--gray);">Суреттер қосылмаған</p>';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('index.html') || path === '/' || path.endsWith('/')) {
        initMainPage();
    } else if (path.includes('object.html')) {
        const objectId = new URLSearchParams(window.location.search).get('id');
        if (objectId) {
            loadObjectPage(objectId);
        }
    }
});
