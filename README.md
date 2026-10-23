# Site do Cifra

A página de apresentação do Cifra (https://appcifra.org): o que ele é, como funciona, o APK para baixar e como
conferir o download. Em português (`/`) e em inglês (`/en/`).

HTML, CSS e JavaScript puros, sem build e sem nada de fora: fontes, estilos e o script vêm do mesmo servidor, e
nenhuma página de terceiros é chamada. Funciona sem JavaScript. Com ele, a página pergunta o idioma na primeira
visita (a escolha fica no navegador), mostra as seções ao rolar e confere o APK: o SHA-256 é calculado no próprio
navegador (Web Crypto) e comparado com o desta página, sem o arquivo sair do computador.

## Arquivos

- `index.html` e `en/index.html`: a página, em português e em inglês, com o mesmo conteúdo. As telas do app são
  desenhos em HTML, sem imagem.
- `estilo.css`: os estilos.
- `site.js`: o idioma, as seções ao rolar e o verificador do APK.
- `icone.svg`: o ícone da aba.
- `fontes/`: Geist e Geist Mono, os mesmos arquivos do app (licença OFL, em `fontes/OFL.txt`).
- `vercel.json`: os cabeçalhos de segurança da hospedagem.

## A cada versão

Nas duas páginas: o número da versão, o link do APK (`releases/download/vX.Y.Z/cifra-X.Y.Z.apk` do repositório do
app) e o SHA-256 dele em `#esperado`, que o `gerar.sh` do app mostra no fim do build.

A impressão digital da chave e o endereço das doações não mudam. Antes de publicar, confira os dois com o
`docs/SPEC.md` do app.

## Ver no computador

Por um servidor local, não abrindo o arquivo direto: os caminhos começam em `/`, e a política de segurança da página
(CSP) só aceita o que vem do mesmo endereço. Por exemplo, nesta pasta: `python3 -m http.server 8000`, e abra
`http://127.0.0.1:8000`.

## Publicar

Cada push no `main` publica na Vercel, com os cabeçalhos do `vercel.json`: a mesma CSP da página, mais
`frame-ancestors 'none'` (que o `<meta>` não aceita), HSTS e os outros. Em outro servidor, copie a pasta inteira (sem
`.git`) para a raiz e mande os mesmos cabeçalhos.

## Licença

GPLv3, como o app (`LICENSE`). As fontes seguem a OFL.
