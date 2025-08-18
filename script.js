// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =================================================================
// 1. CONFIGURAÇÃO DO FIREBASE
// COLOQUE SUAS CHAVES AQUI DENTRO!
// =================================================================
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig );
const db = getFirestore(app);

// =================================================================
// 2. SELETORES DE ELEMENTOS DA UI (DOM)
// =================================================================
const eventListContainer = document.getElementById('event-list');
const navItems = document.querySelectorAll('.nav-item');
const fab = document.querySelector('.fab');
const modalOverlay = document.getElementById('modalOverlay');
const modalCloseButton = document.querySelector('.modal-close');

// =================================================================
// 3. FUNÇÕES PRINCIPAIS
// =================================================================

/**
 * Busca os eventos do Firestore em tempo real e os renderiza na tela.
 */
function fetchAndRenderEvents() {
    const eventsCollection = collection(db, "events");
    onSnapshot(eventsCollection, (snapshot) => {
        const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (!eventListContainer) return;
        eventListContainer.innerHTML = ''; // Limpa a lista

        if (events.length === 0) {
            eventListContainer.innerHTML = '<p class="placeholder-text">Nenhum evento encontrado.</p>';
            return;
        }

        events.forEach(event => {
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                ${event.isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
                <div class="event-image" style="background: ${event.imageGradient || 'linear-gradient(45deg, #888, #555)'};">
                    ${event.imageType || 'EVENTO'}
                </div>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-date">${event.date}</div>
                    <div class="event-location">${event.location}</div>
                    <div class="event-stats">
                        <div class="going-count">+ ${event.going || 0} pessoas vão</div>
                        <div class="event-price">${event.price}</div>
                    </div>
                </div>
            `;
            eventListContainer.appendChild(card);
        });
    }, (error) => {
        console.error("Erro ao buscar eventos: ", error);
        eventListContainer.innerHTML = '<p class="placeholder-text" style="color: red;">Erro ao carregar eventos. Verifique o console.</p>';
    });
}

/**
 * Mostra a página correta com base no clique da navegação.
 * @param {string} pageId - O ID da página a ser exibida.
 */
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.toggle('active', page.id === `page-${pageId}`);
    });
    navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });
}

// =================================================================
// 4. EVENT LISTENERS (AÇÕES DO USUÁRIO)
// =================================================================

// Adiciona ouvintes de clique para a barra de navegação
navItems.forEach(item => {
    item.addEventListener('click', () => showPage(item.dataset.page));
});

// Adiciona ouvintes de clique para abrir e fechar o modal
fab.addEventListener('click', () => modalOverlay.hidden = false);
modalCloseButton.addEventListener('click', () => modalOverlay.hidden = true);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.hidden = true;
    }
});

// =================================================================
// 5. INICIALIZAÇÃO DO APP
// =================================================================

// Garante que o DOM está pronto antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderEvents();
});
