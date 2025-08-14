// =================================================================
// CONFIGURAÇÃO DO FIREBASE (USANDO MÓDULOS MODERNOS)
// =================================================================

// 1. Importa as funções necessárias diretamente dos links do Firebase
// <<< MUDANÇA IMPORTANTE: Adicionamos 'getFirestore' e 'collection' aqui
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Suas chaves de configuração (as mesmas de antes )
const firebaseConfig = {
  apiKey: "AIzaSyDjEdtxSyam1wkJolyLDTbvJXt33UwCL0",
  authDomain: "bora-app-piracicaba.firebaseapp.com",
  projectId: "bora-app-piracicaba",
  storageBucket: "bora-app-piracicaba.firebasestorage.app",
  messagingSenderId: "193650879035",
  appId: "1:193650879035:web:fc51106b02ac4cb0eb8a1e"
};

// 3. Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // <<< MUDANÇA IMPORTANTE: Esta linha conecta ao banco de dados

// =================================================================
// FUNÇÃO PARA RENDERIZAR (DESENHAR) OS EVENTOS NA TELA
// =================================================================
function renderEvents(eventsToRender) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = ''; 

    if (!eventsToRender || eventsToRender.length === 0) {
        eventList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum evento encontrado.</p>';
        return;
    }

    eventsToRender.forEach(event => {
        const card = document.createElement('div');
        const isPremium = event.isPremium || false;
        const imageGradient = event.imageGradient || 'linear-gradient(45deg, #888, #555)';
        const imageType = event.imageType || '🎉 EVENTO';
        const goingCount = event.going || 0;

        card.className = 'event-card';
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
        
        eventList.appendChild(card);
    });
}

// =================================================================
// FUNÇÃO PARA BUSCAR OS EVENTOS DO FIREBASE
// =================================================================
function fetchEvents() {
    const eventsCollection = collection(db, "events");
    onSnapshot(eventsCollection, (querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        renderEvents(events);
    }, (error) => {
        console.error("Erro ao buscar eventos: ", error);
        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '<p style="text-align: center; color: #d9534f;">Não foi possível carregar os eventos.</p>';
    });
}

// =================================================================
// FUNÇÕES GLOBAIS (PRECISAM ESTAR NO 'window' por causa do Módulo)
// =================================================================
window.openModal = function() {
    document.getElementById('eventModal').style.display = 'flex';
}

window.closeModal = function() {
    document.getElementById('eventModal').style.display = 'none';
}

window.selectPlan = function(element) {
    document.querySelectorAll('.pricing-option').forEach(option => {
        option.classList.remove('selected');
    });
    element.classList.add('selected');
    
    const selectedPrice = element.querySelector('.price').textContent;
    const button = document.querySelector('.submit-btn');
    
    if (selectedPrice === 'GRÁTIS') {
        button.textContent = 'Publicar Evento Grátis';
    } else {
        button.textContent = `Publicar Evento - ${selectedPrice}`;
    }
}

// =================================================================
// LÓGICA DOS FILTROS E NAVEGAÇÃO
// =================================================================
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

// =================================================================
// INICIALIZAÇÃO DO APP
// =================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/bora/sw.js');
    });
}

fetchEvents(); // Busca os eventos do Firebase
