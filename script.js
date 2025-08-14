// Funções do App
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

// Registro do Service Worker para o PWA
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
