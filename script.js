// =================================================================
// CONFIGURAÇÃO DO FIREBASE
// Cole aqui as suas chaves que você pegou do Firebase Console
// =================================================================
const firebaseConfig = {
  // COLE SUAS CHAVES AQUI DENTRO
  // Exemplo:
  // apiKey: "AIzaSy...",
  // authDomain: "bora-app-piracicaba.firebaseapp.com",
  // ...etc
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig );
const db = firebase.firestore(); // Inicializa o banco de dados Firestore

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
    });
}


// =================================================================
// FUNÇÕES E LÓGICA DO APP (MODAL, NAVEGAÇÃO, ETC.)
// =================================================================
// (As funções do modal e da navegação continuam as mesmas de antes)
function openModal() {
    document.getElementById('eventModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// ... (outras funções que você queira adicionar no futuro)


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


