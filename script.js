// =================================================================
// INICIALIZAÇÃO DO FIREBASE
// =================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Suas chaves de configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDIjEdtxSyamlwkJolyLDTbvJXt33UwCL0",
    authDomain: "bora-app-piracicaba.firebaseapp.com",
    projectId: "bora-app-piracicaba",
    storageBucket: "bora-app-piracicaba.firebasestorage.app",
    messagingSenderId: "193650879035",
    appId: "1:193650879035:web:fc51106b02ac4cb0eb8a1e"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig );
const db = getFirestore(app);

// =================================================================
// SELETORES DE ELEMENTOS DA UI (DOM)
// =================================================================
const eventListContainer = document.getElementById('event-list');
const pages = document.querySelectorAll('.page');
const navItems = document.querySelectorAll('.nav-item');
const fab = document.querySelector('.fab');
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseButton = document.querySelector('.modal-close');

// =================================================================
// FUNÇÕES DE RENDERIZAÇÃO E UI
// =================================================================

/**
 * Desenha os cards de evento na tela.
 * @param {Array} events - Uma lista de objetos de evento.
 */
function renderEvents(events) {
    if (!eventListContainer) return;

    eventListContainer.innerHTML = ''; // Limpa a lista antes de renderizar

    if (events.length === 0) {
        eventListContainer.innerHTML = '<p class="placeholder-text">Nenhum evento encontrado.</p>';
        return;
    }

    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        
        const isPremium = event.isPremium || false;
        const imageGradient = event.imageGradient || 'linear-gradient(45deg, #888, #555)';
        const imageType = event.imageType || 'EVENTO';
        const goingCount = event.going || 0;

        if (isPremium) {
            card.classList.add('premium');
        }

        card.innerHTML = `
            ${isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
            <div class="event-image" style="background: ${imageGradient};">
                ${imageType}
            </div>
            <div class="event-info">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date}</div>
                <div class="event-location">${event.location}</div>
                <div class="event-stats">
                    <div class="going-count">+ ${goingCount} pessoas vão</div>
                    <div class="event-price">${event.price}</div>
                </div>
            </div>
        `;
        eventListContainer.appendChild(card);
    });
}

/**
 * Mostra uma página específica e atualiza a navegação.
 * @param {string} pageId - O ID da página a ser mostrada (ex: 'inicio').
 */
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.toggle('active', page.id === `page-${pageId}`);
    });
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
}

function openModal() {
    modalOverlay.hidden = false;
}

function closeModal() {
    modalOverlay.hidden = true;
}

// =================================================================
// LÓGICA DE DADOS (FIREBASE)
// =================================================================

/**
 * Busca os eventos da coleção 'events' no Firestore em tempo real.
 */
function fetchEvents() {
    const eventsCollection = collection(db, "events");
    onSnapshot(eventsCollection, (querySnapshot) => {
        const eventsData = [];
        querySnapshot.forEach((doc) => {
            eventsData.push({ id: doc.id, ...doc.data() });
        });
        renderEvents(eventsData);
    }, (error) => {
        console.error("Erro ao buscar eventos: ", error);
        if (eventListContainer) {
            eventListContainer.innerHTML = '<p class="placeholder-text" style="color: red;">Erro ao carregar eventos.</p>';
        }
    });
}

// =================================================================
// EVENT LISTENERS (OUVINTES DE EVENTOS)
// =================================================================

// Navegação principal
navItems.forEach(item => {
    item.addEventListener('click', () => showPage(item.dataset.page));
});

// Botão flutuante e modal
fab.addEventListener('click', openModal);
modalCloseButton.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// =================================================================
// INICIALIZAÇÃO DO APLICATIVO
// =================================================================

// Inicia a busca de eventos assim que o script é carregado
fetchEvents();

// Registro do Service Worker para PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/bora/sw.js')
            .then(reg => console.log('Service Worker registrado com sucesso.', reg))
            .catch(err => console.error('Falha ao registrar Service Worker:', err));
    });
}
