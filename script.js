// 1. Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 2. Suas chaves de configuração
const firebaseConfig = {
    apiKey: "AIzaSyDIjEdtxSyamlwkJolyLDTbvJXt33UwCL0",
    authDomain: "bora-app-piracicaba.firebaseapp.com",
    projectId: "bora-app-piracicaba",
    storageBucket: "bora-app-piracicaba.firebasestorage.app",
    messagingSenderId: "193650879035",
    appId: "1:193650879035:web:fc51106b02ac4cb0eb8a1e"
};

// 3. Inicializa o Firebase e o Firestore
const app = initializeApp(firebaseConfig );
const db = getFirestore(app);

// 4. Função para buscar os eventos
function fetchEvents() {
    const eventsCollection = collection(db, "events");
    onSnapshot(eventsCollection, (querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        renderEvents(events);
    });
}

// 5. Função para renderizar os eventos
function renderEvents(eventsToRender) {
    const eventList = document.getElementById('event-list');
    if (!eventList) return;
    
    eventList.innerHTML = ''; 
    if (!eventsToRender || eventsToRender.length === 0) {
        eventList.innerHTML = '<p class="placeholder-text">Nenhum evento cadastrado.</p>';
        return;
    }

    eventsToRender.forEach(event => {
        const card = document.createElement('div');
        const isPremium = event.isPremium || false;
        const imageGradient = event.imageGradient || 'linear-gradient(45deg, #ccc, #aaa)';
        const imageType = event.imageType || 'EVENTO';
        const goingCount = event.going || 0;

        card.className = 'event-card';
        if (isPremium) card.classList.add('premium');

        card.innerHTML = `
            ${isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
            <div class="event-image" style="background: ${imageGradient};">${imageType}</div>
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

// 6. Funções de navegação
window.showPage = function(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(`page-${pageId}`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector(`.nav-item[onclick="showPage('${pageId}')"]`).classList.add('active');
}

// 7. Chama a função inicial
fetchEvents();
