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
    `;
}

function renderizarProjetos() {
    const containerProjetos = document.getElementById('lista-projetos');
    if (!containerProjetos) return;

    containerProjetos.innerHTML = projetosDados.map(criarCardProjeto).join('');
};

const appContainer = document.getElementById('app');

function validarCampo(campo) {
    const campoValido = campo.checkValidity();

    if (!campoValido) {
        campo.classList.add('campo-invalido');
        campo.classList.remove('campo-valido');
    } else {
        campo.classList.remove('campo-invalido');
        campo.classList.add('campo-valido');
    }
    return campoValido;
}

function carregarDadosSalvos() {
    const form = document.getElementById('form-cadastro');
    if (!form) return;

    const dadosSalvos = localStorage.getItem('cadastroParceiro');
    if (dadosSalvos) {
        try {
            const dadosFormulario = JASON.parse(dadosSalvos);
            Object.keys(dadosFormulario).forEach(key => {
                const campo = form.querySelector(`[name="${key}"]`);
                if (campo) {
                    campo.value = dadosFormulario[key];
                    validarCampo(campo);
                }
            });
        } catch (error) {
            console.error('Erro ao ler s dados do localStorage: ', error);
        }
    }    
}

function validarFormulario() {
    const form = document.getElementById('form-cadastro');

    console.log('formulario: ', form);
    if (!form) return;

    const campos = form.querySelectorAll('input, textarea, select');
    const modalSucesso = document.getElementById('modal-sucesso');

    carregarDadosSalvos();

    campos.forEach(campo => {
        campo.addEventListener('input', function () {
            validarCampo(campo)
        });
        campo.addEventListener('blur', function () {
            validarCampo(campo)
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let formValido = true;
        const dadosFormulario = {};

        campos.forEach(campo => {
            if (!validarCampo(campo)) {
                formValido = false;
            } else if (campo.name) {
                dadosFormulario[campo.name] = campo.value;
            }
        });

        if (formValido) {
            localStorage.setItem('cadastroParceiro', JSON.stringify(dadosFormulario));

            if (modalSucesso) {
                modalSucesso.style.opacity = 0.9;
                modalSucesso.style.pointerEvents = 'auto';
            }
            
            form.reset();
            campos.forEach(c => c.classList.remove('campo-valido','campo-invalido'));
        
        } else {
            consle.warn('Campos Inconsistentes!')
        } console.log(dadosFormulario);
    });

    if (modalSucesso) {
        const btnFechar = modalSucesso.querySelector('.modal-fechar, .btn-modal-concluir, [href="#/cadastro"]');
        if (btnFechar) {
            btnFechar.addEventListener('click', function (e) {
                e.preventDefault();
                modalSucesso.style.opacity = 0;
                modalSucesso.style.pointerEvents = 'none';
                window.location.hash = '#/cadastro';
            });
        }
    } 
}

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
        validarFormulario();

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