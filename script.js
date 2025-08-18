// =================================================================
// INICIALIZAÇÃO DO FIREBASE (Versão Atualizada)
// =================================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  onSnapshot,
  query,
  orderBy,
  where,
  limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Configuração do Firebase (recomendo usar variáveis de ambiente em produção)
const firebaseConfig = {
  apiKey: "AIzaSyDIjEdtxSyamlwkJolyLDTbvJXt33UwCL0",
  authDomain: "bora-app-piracicaba.firebaseapp.com",
  projectId: "bora-app-piracicaba",
  storageBucket: "bora-app-piracicaba.appspot.com",
  messagingSenderId: "193650879035",
  appId: "1:193650879035:web:fc51106b02ac4cb0eb8a1e",
  measurementId: "G-XXXXXXXXXX" // Adicione se tiver o Firebase Analytics
};

// Inicialização segura
let app, db, auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("Firebase inicializado com sucesso");
} catch (error) {
  console.error("Erro na inicialização do Firebase:", error);
  // Fallback para dados locais ou tratamento de erro
}

// =================================================================
// GERENCIAMENTO DE ESTADO
// =================================================================
const state = {
  currentUser: null,
  events: [],
  currentFilter: 'todos'
};

// =================================================================
// FUNÇÕES DE DADOS MELHORADAS
// =================================================================

/**
 * Busca eventos com filtros e ordenação
 * @param {string} category - Categoria para filtrar
 * @param {number} maxResults - Número máximo de resultados
 */
async function fetchEvents(category = 'todos', maxResults = 20) {
  if (!db) {
    console.error("Firestore não inicializado");
    renderErrorState();
    return;
  }

  try {
    let eventsQuery = query(
      collection(db, "events"),
      orderBy("date", "asc"),
      limit(maxResults)
    );

    if (category !== 'todos') {
      eventsQuery = query(
        eventsQuery,
        where("category", "==", category)
    }

    const unsubscribe = onSnapshot(eventsQuery, 
      (snapshot) => {
        state.events = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        renderEvents(state.events);
      },
      (error) => {
        console.error("Erro na consulta:", error);
        renderErrorState();
      }
    );

    return unsubscribe; // Retorna a função para cancelar a inscrição

  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    renderErrorState();
  }
}

function renderErrorState() {
  if (eventListContainer) {
    eventListContainer.innerHTML = `
      <div class="error-state">
        <p>😕 Ops, não conseguimos carregar os eventos</p>
        <button id="retry-button">Tentar novamente</button>
      </div>
    `;
    document.getElementById('retry-button').addEventListener('click', () => fetchEvents(state.currentFilter));
  }
}

// =================================================================
// AUTENTICAÇÃO E SEGURANÇA
// =================================================================
function initAuth() {
  if (!auth) return;

  onAuthStateChanged(auth, (user) => {
    state.currentUser = user;
    updateUIForAuthState();
    
    // Atualiza eventos após autenticação
    fetchEvents(state.currentFilter);
  });
}

function updateUIForAuthState() {
  const createEventBtn = document.getElementById('create-event-btn');
  if (createEventBtn) {
    createEventBtn.style.display = state.currentUser ? 'block' : 'none';
  }
}

// =================================================================
// OTIMIZAÇÕES DE PERFORMANCE
// =================================================================

// Debounce para funções que lidam com scroll/resize
function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

// Cache simples para evitar re-renderizações desnecessárias
const eventCache = new Map();

function renderEvents(events) {
  if (!eventListContainer) return;

  // Verifica se os eventos são iguais aos anteriores
  const cacheKey = JSON.stringify(events);
  if (eventCache.get(cacheKey)) return;
  
  eventCache.set(cacheKey, true);
  
  // Restante da sua função renderEvents...
  // (mantenha sua implementação atual, mas adicione):
  if (events.length === 0) {
    eventListContainer.innerHTML = `
      <div class="empty-state">
        <p>🎉 Nenhum evento encontrado. Que tal criar o primeiro?</p>
      </div>
    `;
    return;
  }

  // ... sua implementação atual de renderização
}

// =================================================================
// INICIALIZAÇÃO DO APP
// =================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Verifica se o Firebase foi inicializado
  if (!db) {
    renderErrorState();
    return;
  }

  // Inicia autenticação
  initAuth();

  // Carrega eventos iniciais
  const unsubscribe = fetchEvents(state.currentFilter);

  // Limpeza ao sair da página
  window.addEventListener('beforeunload', () => {
    if (unsubscribe) unsubscribe();
  });

  // Registro do Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registrado:', registration);
        registration.update(); // Força atualização do SW
      })
      .catch(error => {
        console.error('Falha no registro do SW:', error);
      });
  }
});

// =================================================================
// ATUALIZAÇÕES PARA O SEU CÓDIGO EXISTENTE
// =================================================================

// 1. Adicione data-page aos seus navItems no HTML:
// <div class="nav-item" data-page="inicio" ...>

// 2. Atualize sua função showPage para usar o estado:
function showPage(pageId) {
  state.currentPage = pageId;
  // ... sua implementação atual
  if (pageId === 'inicio') {
    fetchEvents(state.currentFilter);
  }
}

// 3. Atualize o filterEvents para usar o estado:
function filterEvents(category) {
  state.currentFilter = category;
  fetchEvents(category);
}
