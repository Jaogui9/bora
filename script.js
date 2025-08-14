// =================================================================
// CONFIGURAÇÃO DO FIREBASE (Sintaxe Corrigida)
// =================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDIjEdtxSyamlwkJolyLDTbvJXt33UwCL0",
  authDomain: "bora-app-piracicaba.firebaseapp.com",
  projectId: "bora-app-piracicaba",
  storageBucket: "bora-app-piracicaba.firebasestorage.app",
  messagingSenderId: "193650879035",
  appId: "1:193650879035:web:fc51106b02ac4cb0eb8a1e"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Inicializa o banco de dados Firestore

// =================================================================
// FUNÇÃO PARA RENDERIZAR (DESENHAR) OS EVENTOS NA TELA
// =================================================================
function renderEvents(eventsToRender) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = ''; 

    if (!eventsToRender || eventsToRender.length === 0) {
        eventList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum evento encontrado. Verifique sua conexão ou tente mais tarde.</p>';
        return;
    }

    eventsToRender.forEach(event => {
        const card = document.createElement('div');
        // Usa valores padrão caso os campos não existam no banco de dados
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
    db.collection("events").onSnapshot((querySnapshot) => {
        const events = [];
        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() });
        });
        renderEvents(events);
    }, (error) => {
        console.error("Erro ao buscar eventos: ", error);
        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '<p style="text-align: center; color: #d9534f;">Não foi possível carregar os eventos. Verifique o console para mais detalhes.</p>';
    });
}


// =================================================================
// FUNÇÕES E LÓGICA DO APP (MODAL, NAVEGAÇÃO, ETC.)
// =================================================================
function openModal() {
    document.getElementById('eventModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function selectPlan(element) {
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

// Garante que o PWA funcione
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/bora/sw.js');
    });
}

// Busca os eventos do Firebase assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();
});



