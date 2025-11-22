// script.js - extracted from inline scripts in index.html

// Pré-carregar imagens existentes na pasta (relativas ao arquivo)
window.preloadGallery = [
    'img.frente.jpeg',
    'img.fente.retr.jpeg',
    'foto1.jpeg','foto2.jpeg','foto3.jpeg','foto4.jpeg','foto5.jpeg','foto6.jpeg','foto7.jpeg','foto8.jpeg','foto9.jpeg','foto10.jpeg',
    'foto11.jpeg','foto12.jpeg','foto13.jpeg','foto14.jpeg','foto15.jpeg','foto16.jpeg','foto17.jpeg','foto18.jpeg','foto19.jpeg','foto20.jpeg',
    'foto21.jpeg','foto22.jpeg','foto23.jpeg','foto24.jpeg','foto25.jpeg','foto26.jpeg','foto27.jpeg','foto28.jpeg'
];

(function(){
    const openBtn = document.getElementById('openGalleryBtn');
    const input = document.getElementById('galleryInput');
    const preview = document.getElementById('galleryPreview');
    const mainPhotoContainer = document.querySelector('.gallery-main');
    // lista ordenada das fontes das imagens exibidas na galeria (miniaturas -> lightbox)
    const gallerySources = [];
    let currentIndex = -1;

    function isImage(file){
        return file && file.type && file.type.startsWith('image/');
    }

    openBtn.addEventListener('click', ()=> input.click());

    input.addEventListener('change', (e)=>{
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            if(!isImage(file)) return;
            const reader = new FileReader();
            reader.onload = function(ev){
                const url = ev.target.result;
                addThumbnail(url, file.name);
            };
            reader.readAsDataURL(file);
        });
        // reset input so same file can be selected again if needed
        input.value = '';
    });

    function addThumbnail(src, name){
        const item = document.createElement('div');
        item.className = 'thumb-item';

        const img = document.createElement('img');
        img.src = src;
        img.alt = name || 'imagem selecionada';
        img.tabIndex = 0;
        img.addEventListener('click', ()=> setMain(src));
        img.addEventListener('keypress', (ev)=>{ if(ev.key === 'Enter') setMain(src); });
        // abrir em tela cheia (lightbox) ao clicar na miniatura
        img.addEventListener('click', ()=> openLightbox(src));

        item.appendChild(img);
        // registrar índice e fonte na lista ordenada
        const idx = gallerySources.length;
        gallerySources.push(src);
        item.dataset.index = idx;
        preview.appendChild(item);

        // if first thumbnail, set as main
        if(preview.children.length === 1){
            setMain(src);
        }
    }

    function setMain(src){
        const existing = mainPhotoContainer.querySelector('img');
        if(existing){
            existing.src = src;
            // garantir que clicar na imagem principal abra o lightbox
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

    // se houver imagens pré-carregadas, adiciona-as à galeria
    if(Array.isArray(window.preloadGallery) && window.preloadGallery.length){
        window.preloadGallery.forEach(src => {
            try{ addThumbnail(src, src); }catch(e){ console.warn('Erro ao pré-carregar', src, e); }
        });
    }

    /* Lightbox (overlay) handling with navigation arrows */
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

    // prevent background scroll while lightbox open
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
            // imagem não encontrada na lista; apenas mostre sem navegação
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
        // fechar ao clicar fora da imagem (no overlay)
        if(e.target === lbOverlay) closeLightbox();
    });
    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', prevImage);
    lbNext.addEventListener('click', nextImage);

})();
