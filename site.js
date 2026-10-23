// Site do Cifra: o idioma da primeira visita, as seções que aparecem ao rolar e a conferência do APK.
// Sem JavaScript a página funciona inteira: o idioma troca pelos links PT e EN, e o APK se confere
// no terminal.
(() => {
  const CHAVE = 'cifra.idioma';
  const pagina = document.documentElement.lang === 'en' ? 'en' : 'pt';
  const ENDERECO = { pt: '/', en: '/en/' };

  function lido() {
    try {
      const valor = localStorage.getItem(CHAVE);
      return valor === 'pt' || valor === 'en' ? valor : null;
    } catch {
      return null;
    }
  }
  function guardar(idioma) {
    try {
      localStorage.setItem(CHAVE, idioma);
    } catch {
      // Sem armazenamento: o painel pergunta de novo na próxima visita.
    }
  }

  // Idioma: quem já escolheu vai direto para a sua página; na primeira visita, o painel pergunta.
  const escolhido = lido();
  if (escolhido && escolhido !== pagina) {
    location.replace(ENDERECO[escolhido] + location.hash);
    return;
  }
  const painel = document.querySelector('[data-estado="pedirIdioma"]');
  for (const link of document.querySelectorAll('a[data-idioma]')) {
    link.addEventListener('click', (evento) => {
      const idioma = link.dataset.idioma;
      guardar(idioma);
      if (idioma === pagina) {
        evento.preventDefault();
        if (painel) painel.hidden = true;
      }
    });
  }
  if (painel && !escolhido) {
    painel.hidden = false;
    painel.querySelector('a[data-idioma]')?.focus();
  }

  // Seções que aparecem ao rolar. Quem já está na tela nunca some; sem suporte, tudo fica visível.
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          const alvo = entrada.target;
          if (entrada.isIntersecting) {
            alvo.classList.remove('oculto');
            alvo.classList.add('visto');
            observador.unobserve(alvo);
          } else if (!alvo.classList.contains('visto')) {
            alvo.classList.add('oculto');
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );
    for (const alvo of document.querySelectorAll('[data-reveal]')) observador.observe(alvo);
  }

  // Conferência do APK: o SHA-256 sai do Web Crypto, no próprio navegador; o arquivo não é enviado.
  const zona = document.getElementById('soltar');
  const entrada = document.getElementById('arquivo');
  if (!zona || !entrada || !window.crypto?.subtle) return;
  zona.hidden = false;
  for (const aviso of document.querySelectorAll('[data-sem-script]')) aviso.hidden = true;
  const esperado = (document.getElementById('esperado')?.textContent ?? '').trim().toLowerCase();
  const calculado = document.querySelector('[data-estado="temCalculado"]');
  const COR = { neutra: '#262A26', boa: '#C6F432', ruim: '#FF5A43' };
  let estado = 'vazio';

  function borda(arrastando) {
    const boa = arrastando || estado === 'confere';
    zona.style.borderColor = boa ? COR.boa : estado === 'diferente' || estado === 'erro' ? COR.ruim : COR.neutra;
  }
  function mostrar(novo, hex) {
    estado = novo;
    for (const nome of ['calculando', 'confere', 'diferente', 'erro']) {
      const elemento = document.querySelector(`[data-estado="${nome}"]`);
      if (elemento) elemento.hidden = nome !== novo;
    }
    if (calculado) {
      calculado.textContent = hex;
      calculado.hidden = !hex;
    }
    borda(false);
  }
  async function conferir(arquivo) {
    if (!arquivo) return;
    mostrar('calculando', '');
    try {
      const resumo = await crypto.subtle.digest('SHA-256', await arquivo.arrayBuffer());
      const hex = Array.from(new Uint8Array(resumo), (b) => b.toString(16).padStart(2, '0')).join('');
      mostrar(!esperado ? 'calculado' : hex === esperado ? 'confere' : 'diferente', hex);
    } catch {
      mostrar('erro', '');
    }
  }

  entrada.addEventListener('change', () => conferir(entrada.files?.[0]));
  zona.addEventListener('dragover', (evento) => {
    evento.preventDefault();
    borda(true);
  });
  zona.addEventListener('dragleave', () => borda(false));
  zona.addEventListener('drop', (evento) => {
    evento.preventDefault();
    borda(false);
    conferir(evento.dataTransfer?.files[0]);
  });
})();
