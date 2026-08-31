# Portfólio — Sara Godner

## Como adicionar as fotos
Nenhuma foto foi enviada junto com o pedido, então o site está preparado com um
retrato de reserva (as iniciais "SG" sobre fundo azul) até que as fotos reais
sejam adicionadas. Para usar as fotos de Sara:

1. Coloque os arquivos dentro de `img/sara/` com estes nomes exatos:
   - `sara-retrato.jpg` — foto de rosto/retrato, usada na seção Início (proporção vertical, aprox. 4:5)
   - `sara-forum.jpg` — foto no Fórum ou em contexto profissional, usada em Sobre
   - `sara-estudos.jpg` — foto em ambiente de estudos, usada em Sobre (proporção vertical, aprox. 3:4)
2. Assim que os arquivos existirem com esses nomes, eles aparecem automaticamente —
   não é preciso alterar o HTML.

## Como editar
- Textos e estrutura: `index.html`
- Cores, tipografia, espaçamentos: `css/style.css` (as cores estão centralizadas
  no topo do arquivo, em `:root`)
- Menu mobile, rolagem do cabeçalho e formulário: `js/script.js`

## Formulário de contato
O formulário funciona no navegador (validação, mensagem de confirmação), mas
ainda não está conectado a um serviço de envio de e-mail, pois isso exige um
back-end ou um serviço externo (ex.: Formspree, EmailJS, ou um servidor
próprio). O comentário no `script.js`, na função de `submit`, indica onde
integrar esse serviço quando desejar receber as mensagens de fato.

## Redes sociais e e-mail
Os links de WhatsApp, Instagram, LinkedIn e o e-mail em `index.html` estão como
espaço reservado (`href="#"` e um endereço de exemplo). Substitua pelos dados
reais de Sara antes de publicar.

## Publicar o site
A pasta é um site estático simples — pode ser publicada diretamente em serviços
como Netlify, Vercel ou GitHub Pages, bastando enviar a pasta inteira.