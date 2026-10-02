const routes = {
    '#/home': 'html/home.html',
    '#/projetos': 'html/projetos.html',
    '#/cadastro': 'html/cadastro.html'
};

const projetosDados = [
    {
        id: 'idoso',
        titulo: 'Geração Sênior',
        status: 'Ativo',
        descricao: 'Resgate, e cuidados especiais para animais idosos.',
        inspiracao: 'Gaia e Baltazhar'
    },
    {
        id: 'filhotes',
        titulo: 'Recomeço',
        status: 'Ativo',
        descricao: 'Resgate e cuidados para animais de 0 a 2 anos',
        inspiracao: 'Marrom e Sharapova'
    },
    {
        id: 'gatos',
        titulo: 'CaTo: Canto do Gato',
        status: 'Ativo',
        descricao: 'Resgate, acolhimento e convivência entre cães e gatos',
        inspiracao: 'Pelugra'
    }
];

function criarCardProjeto(projeto) {
    return `
    <article class="card-secao span-4" id="${projeto.id}">
        <h3>
            ${projeto.titulo}
            <span class="badge badge-sucesso" role="status">${projeto.status}</span>
        </h3>
        <p>Inspiração: ${projeto.inspiracao}</p>
        <p>Foco: ${projeto.descricao}</p>
    </article>
    `
};

function renderizarProjetos() {
    const containerProjetos = document.getElementById('lista-projetos');
    if (!containerProjetos) return;

    containerProjetos.innerHTML = projetosDados.map(criarCardProjeto).join('');
};

const appContainer = document.getElementById('app');

async function renderView() {
    let rawHash = window.location.hash || '#/home';
    
    let routePath = rawHash;
    let internalAnchor = '';

    if (rawHash.includes('#', 2)) {
        const lastHashIndex = rawHash.lastIndexOf('#');
        routePath = rawHash.substring(0, lastHashIndex);
        internalAnchor = rawHash.substring(lastHashIndex);
    }

    const viewFile = routes[routePath] || routes['#/home'];

    try {
        const response = await fetch(viewFile);

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const htmlContent = await response.text();
        appContainer.innerHTML = htmlContent;
        renderizarProjetos();

        if (internalAnchor) {
            const targetElement = document.querySelector(internalAnchor);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth'});
            }
        } else {
            window.scrollTo(0,0);
        }
    } catch (error) {
        console.error('Erro ao carregar a página: ', error);
        appContainer.innerHTML = `
            <section class="alerta alerta-atencao span-12" style="margin: 2rem auto;">
                <p> Não foi possível carregar o conteúdo solicitado. Tente novamente mais tarde.</p>
            </section>
        `;
    }
}

window.addEventListener('hashchange', renderView);

window.addEventListener('DOMContentLoaded', renderView);