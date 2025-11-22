// script.js - extracted from inline scripts in index.html

// Pré-carregar imagens existentes na pasta (relativas ao arquivo)
window.preloadGallery = [
    'img.frente.jpeg',
    'img.fente.retr.jpeg',
    'foto1.jpeg','foto2.jpeg','foto3.jpeg','foto4.jpeg','foto5.jpeg','foto6.jpeg','foto7.jpeg','foto8.jpeg','foto9.jpeg','foto10.jpeg',
    'foto11.jpeg','foto12.jpeg','foto13.jpeg','foto14.jpeg','foto15.jpeg','foto16.jpeg','foto17.jpeg','foto18.jpeg','foto19.jpeg','foto20.jpeg',
    'foto21.jpeg','foto22.jpeg','foto23.jpeg','foto24.jpeg','foto25.jpeg','foto26.jpeg','foto27.jpeg','foto28.jpeg'
];


// Função "Ver Galeria": mostra/oculta a galeria ao clicar no botão
document.addEventListener('DOMContentLoaded', function() {
    const viewBtn = document.getElementById('viewGalleryBtn');
    const gallerySection = document.getElementById('gallerySection');
    const preview = document.getElementById('galleryPreview');
    const mainPhotoContainer = document.querySelector('.gallery-main');
    const gallerySources = [];
    let currentIndex = -1;

    // Alternar visibilidade da galeria
    viewBtn.addEventListener('click', function() {
        if (gallerySection.style.display === 'none' || gallerySection.style.display === '') {
            gallerySection.style.display = 'block';
            viewBtn.textContent = 'Ocultar Galeria';
        } else {
            gallerySection.style.display = 'none';
            viewBtn.textContent = 'Ver Galeria';
        }
    });

    function addThumbnail(src, name){
        const item = document.createElement('div');
        item.className = 'thumb-item';
        const img = document.createElement('img');
        img.src = src;
        img.alt = name || 'imagem';
        img.tabIndex = 0;
        img.addEventListener('click', ()=> setMain(src));
        img.addEventListener('keypress', (ev)=>{ if(ev.key === 'Enter') setMain(src); });
        img.addEventListener('click', ()=> openLightbox(src));
        item.appendChild(img);
        const idx = gallerySources.length;
        gallerySources.push(src);
        item.dataset.index = idx;
        preview.appendChild(item);
        if(preview.children.length === 1){
            setMain(src);
        }
    }

    function setMain(src){
        const existing = mainPhotoContainer.querySelector('img');
        if(existing){
            existing.src = src;
            existing.onclick = function(){ openLightbox(src); };
        } else {
            const img = document.createElement('img');
            img.className = 'main-photo';
            img.src = src;
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', ()=> openLightbox(src));
            mainPhotoContainer.innerHTML = '';
            mainPhotoContainer.appendChild(img);
        }
    }

    // Carregar imagens pré-definidas
    if(Array.isArray(window.preloadGallery) && window.preloadGallery.length){
        window.preloadGallery.forEach(src => {
            try{ addThumbnail(src, src); }catch(e){ console.warn('Erro ao pré-carregar', src, e); }
        });
    }

    // Lightbox (overlay) com navegação
    const lightbox = document.createElement('div');
    lightbox.id = 'lightboxOverlay';
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = '<div class="lightbox-content">'
        + '<button id="lightboxPrev" class="lightbox-nav lightbox-prev" aria-label="Anterior">◀</button>'
        + '<img id="lightboxImg" alt="Imagem em tela cheia">'
        + '<button id="lightboxNext" class="lightbox-nav lightbox-next" aria-label="Próxima">▶</button>'
        + '<button id="lightboxClose" class="lightbox-close">✕</button>'
        + '</div>';
    document.body.appendChild(lightbox);

    const lbOverlay = document.getElementById('lightboxOverlay');
    const lbImg = document.getElementById('lightboxImg');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    let _previousBodyOverflow = '';

    function showAt(index){
        if(index < 0 || index >= gallerySources.length) return;
        currentIndex = index;
        lbImg.src = gallerySources[currentIndex];
        lbOverlay.style.display = 'flex';
        _previousBodyOverflow = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
    }

    function openLightbox(src){
        const idx = gallerySources.indexOf(src);
        if(idx === -1){
            lbImg.src = src;
            currentIndex = -1;
            lbOverlay.style.display = 'flex';
            _previousBodyOverflow = document.body.style.overflow || '';
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', onKeyDown);
            return;
        }
        showAt(idx);
        document.addEventListener('keydown', onKeyDown);
    }

    function closeLightbox(){
        lbOverlay.style.display = 'none';
        lbImg.src = '';
        document.body.style.overflow = _previousBodyOverflow;
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e){
        if(e.key === 'Escape') return closeLightbox();
        if(e.key === 'ArrowRight') return nextImage();
        if(e.key === 'ArrowLeft') return prevImage();
    }

    function nextImage(){
        if(gallerySources.length === 0) return;
        if(currentIndex === -1) return;
        const nxt = (currentIndex + 1) % gallerySources.length;
        showAt(nxt);
    }

    function prevImage(){
        if(gallerySources.length === 0) return;
        if(currentIndex === -1) return;
        const prev = (currentIndex - 1 + gallerySources.length) % gallerySources.length;
        showAt(prev);
    }

    lbOverlay.addEventListener('click', function(e){
        if(e.target === lbOverlay) closeLightbox();
    });
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', prevImage);
    lbNext.addEventListener('click', nextImage);
});
