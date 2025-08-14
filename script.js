// =================================================================
// BANCO DE DADOS TEMPORÁRIO DE EVENTOS
// Para adicionar um novo evento, basta copiar um bloco e alterar as informações.
// =================================================================
const eventsData = [
    {
        title: "Rodeio de Piracicaba 2025",
        date: "HOJE • 21:00",
        location: "📍 Parque do Engenho Central",
        going: 234,
        price: "R$ 25",
        category: "Rodeios",
        imageType: "🤠 RODEIO",
        imageGradient: "linear-gradient(45deg, #ff6b6b, #ee5a24)",
        isPremium: true
    },
    {
        title: "Festa da ESALQ",
        date: "SEXTA • 22:30",
        location: "📍 Atlética ESALQ",
        going: 89,
        price: "R$ 15",
        category: "Festas",
        imageType: "🎉 FESTA",
        imageGradient: "linear-gradient(45deg, #9c88ff, #8c7ae6)",
        isPremium: false
    },
    {
        title: "Show de Sertanejo",
        date: "SÁBADO • 20:00",
        location: "📍 Arena Piracicaba",
        going: 156,
        price: "R$ 40",
        category: "Shows",
        imageType: "🎵 SHOW",
        imageGradient: "linear-gradient(45deg, #ffa726, #ff7043)",
        isPremium: false
    },
    {
        title: "Chopada da UNIMEP",
        date: "DOMINGO • 15:00",
        location: "📍 Campus UNIMEP",
        going: 67,
        price: "R$ 20",
        category: "Festas",
        imageType: "🍻 CHOPADA",
        imageGradient: "linear-gradient(45deg, #26de81, #20bf6b)",
        isPremium: true
    }
];

// =================================================================
// FUNÇÃO PARA RENDERIZAR (DESENHAR) OS EVENTOS NA TELA
// =================================================================
function renderEvents(eventsToRender) {
    const eventList = document.getElementById('event-list');
    eventList.innerHTML = ''; // Limpa a lista antes de desenhar

    if (eventsToRender.length === 0) {
        eventList.innerHTML = '<p style="text-align: center; color: #888;">Nenhum evento encontrado para esta categoria.</p>';
        return;
    }

    eventsToRender.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';
        if (event.isPremium) {
            card.classList.add('premium');
        }

        card.innerHTML = `
            ${event.isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
            <div class="event-image" style="background: ${event.imageGradient};">
                ${event.imageType}
            </div>
            <div class="event-info">
                <div class="event-title">${event.title}</div>
                <div class="event-date">${event.date}</div>
                <div class="event-location">${event.location}</div>
                <div class="event-stats">
                    <div class="going-count">+ ${event.going} pessoas vão</div>
                    <div class="event-price">${event.price}</div>
                </div>
            </div>
        `;
        
        eventList.appendChild(card);
    });
}


// =================================================================
// FUNÇÕES E LÓGICA DO APP (MODAL, NAVEGAÇÃO, FILTROS)
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

// Lógica dos Filtros
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', function() {
        // Atualiza o estilo do botão de filtro
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        const selectedCategory = this.getAttribute('data-category');
        
        if (selectedCategory === 'Todos') {
            renderEvents(eventsData); // Mostra todos os eventos
        } else {
            const filteredEvents = eventsData.filter(event => event.category === selectedCategory);
            renderEvents(filteredEvents); // Mostra apenas os eventos filtrados
        }
    });
});

// Lógica da Navegação (simulação)
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
        navigator.serviceWorker.register('/bora/sw.js')
        .then(registration => {
            console.log('Service Worker registrado com sucesso!');
        })
        .catch(registrationError => {
            console.log('Falha ao registrar o Service Worker:', registrationError);
        });
    });
}

// Renderiza a lista inicial de eventos quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    renderEvents(eventsData);
});

