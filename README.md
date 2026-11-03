# spec2site

Um único arquivo YAML descreve o site inteiro. Um comando gera o site estático, pronto pra servir em qualquer lugar.

```bash
node gerar.mjs exemplos/cafeteria.yaml --saida dist
```

Abra `dist/index.html` e o site está lá: responsivo, com tema por cor, navegação entre páginas e meta tags básicas. Zero dependências, zero build.

## Por quê

Site simples demais pra morrer na mão de obra de montar header, caçar tipografia e copiar CSS. O `spec2site` parte do contrário: você escreve o **sitefile** — nome, páginas e blocos — e o gerador cuida do resto. E como o sitefile é só texto estruturado, dá pra escrever à mão **ou ditar a um agente de IA**.

> Nasceu na [Genesis Innovation](https://genesisinnovation.io), da cabeça do James-02. O diário de obra sai no LinkedIn do Thiago Patzdorf.

## O sitefile

```yaml
nome: Café da Serra
idioma: pt-BR
descricao: Torra pequena toda semana, direto pra xícara.
url: https://cafe-da-serra.exemplo.com
tema:
  cor: "#a05c2c"
paginas:
  - id: inicio
    titulo: Início
    blocos:
      - tipo: hero
        titulo: Café colhido na serra, torrado hoje
        texto: Grãos de origem única, torra pequena e entrega em até 48h.
```

O exemplo completo com duas páginas está em `exemplos/cafeteria.yaml`.

Fotos também são bloco — e imagem local vira asset do site sozinha:

```yaml
      - tipo: galeria
        titulo: Da colheita pra xícara
        itens:
          - imagem: imagens/colheita.svg
            legenda: Colheita seletiva, só cereja madura
```

Imagens com caminho relativo ao sitefile são copiadas pra `dist/imagens/`; URLs `https` entram direto.

Tem `url` no sitefile (ou `--url` no comando)? O gerador emite também o `sitemap.xml` com todas as páginas e um `robots.txt` que aponta pra ele. Sem `url`, o site nasce do mesmo jeito — só sem sitemap.

### Blocos

- `hero` — título grande, texto e botão
- `texto` — seção com parágrafos
- `lista` — grade de itens com título e texto
- `galeria` — grade de fotos com legenda (imagens locais viram assets do site)
- `precos` — tabela de planos em cards: nome, preço, lista de recursos, botão CTA. Use `destaque: true` no plano principal.
- `faq` — perguntas frequentes expansíveis (`<details>`), zero JavaScript
- `contato` — chamada final com botão

### Formato aceito

Parser YAML embutido, feito sob medida pro sitefile: mapas aninhados por indentação, listas com `-`, strings (nuas ou entre aspas), números e booleanos. Comentários em linha própria (`#` no começo da linha). Sem âncoras, sem multiline — ainda.

## Roadmap

- v0.2 — ✓ bloco galeria · ✓ `sitemap.xml` · ✓ favicon/OG image
- v0.3 (concluído) — ✓ `--serve` · ✓ `init` · ✓ `--version`
- v0.4 (concluído) — ✓ npm publish (@thiagopatzdorf/spec2site) · ✓ `npm run deploy` para GitHub Pages
- v1.0 ✓ formato do sitefile congelado e documentado


---

## Referência do sitefile

Este documento descreve **cada campo** do sitefile e **cada tipo de bloco** que o gerador suporta. A versão do formato é `>=0.2` (congelada a partir de v0.2).

### Topo do arquivo

```yaml
nome: Meu Site            # nome exibido no <title> e header (obrigatório)
idioma: pt-BR             # código de idioma (padrão: pt-BR)
descricao: Meu site estático  # texto para meta description
url: https://meusite.com    # URL base — ativa sitemap.xml e robots.txt
tema:
  cor: "#2563eb"           # cor primária (hex)
  cor2: "#7c3aed"          # cor secundária (opcional)
```

### Páginas

Cada página gera um arquivo HTML separada (`<id>.html`). Mínimo: 1 página.

```yaml
paginas:
  - id: home                # id único da página (obrigatório)
    titulo: Home            # título da aba do navegador
    blocos:                 # lista de blocos (obrigatório)
      # blocos aqui
```

### Blocos — referência completa

#### `hero`
O bloco de destaque inicial.

```yaml
- tipo: hero
  titulo: Bem-vindo!
  texto: Um subtítulo descritivo.
  botao: Saiba mais
  link: https://exemplo.com
```

Campos: `titulo` (obrigatório), `texto` (opcional), `botao` (opcional), `link` (opcional, requer `botao`).

#### `texto`
Seção com um ou mais parágrafos.

```yaml
- tipo: texto
  titulo: Sobre nós
  paragrafos:
    - Primeiro parágrafo.
    - Segundo parágrafo.
```

Campos: `titulo` (opcional), `paragrafos` (obrigatório, lista de strings).

#### `lista`
Grade de itens com título e texto.

```yaml
- tipo: lista
  titulo: Recursos
  itens:
    - titulo: Rápido
      texto: Zero dependências, site estático puro.
    - titulo: Simples
      texto: Um arquivo YAML, nada de build.
```

Campos: `titulo` (opcional), `itens` (obrigatório, lista com `titulo` + `texto`).

#### `galeria`
Grade de imagens com legenda.

```yaml
- tipo: galeria
  titulo: Nosso time
  itens:
    - imagem: img/foto1.svg
      legenda: Ana, fundadora
    - imagem: https://exemplo.com/foto2.png
      legenda: Carlos, dev
```

Campos: `titulo` (opcional), `itens` (obrigatório). `imagem` aceita caminho local (vira asset) ou URL.

#### `precos`
Tabela de planos em cards.

```yaml
- tipo: precos
  titulo: Planos
  intro: Escolha o ideal.
  planos:
    - plano: Básico
      preco: R$ 29/mês
      recursos:
        - 1 site
        - Suporte por email
      botao: Assinar
      link: https://wa.me/123
    - plano: Pro
      destaque: true
      preco: R$ 59/mês
      recursos:
        - 5 sites
        - Suporte prioritário
      botao: Assinar agora
      link: https://wa.me/456
```

Campos: `titulo` (opcional), `intro` (opcional), `planos` (obrigatório, lista com `plano`, `preco`, `recursos` (lista), `destaque` (booleano, opcional), `botao` (opcional), `link` (opcional)).

#### `faq`
Perguntas frequentes expansíveis — zero JavaScript.

```yaml
- tipo: faq
  titulo: Dúvidas
  perguntas:
    - pergunta: Qual o prazo?
      resposta: Entregamos em até 48h.
    - pergunta: Tem garantia?
      resposta: Sim, 30 dias.
```

Campos: `titulo` (opcional), `perguntas` (obrigatório, lista com `pergunta` + `resposta`).

#### `contato`
Chamada final com botão — ideal no fim do site.

```yaml
- tipo: contato
  titulo: Vamos conversar
  texto: Entre em contato pelo WhatsApp.
  botao: WhatsApp
  link: https://wa.me/5521999999999
```

Campos: `titulo` (opcional), `texto` (opcional), `botao` (obrigatório se `link` presente), `link` (opcional).

### Comandos

```bash
# Gerar site a partir de um sitefile
node gerar.mjs sitefile.yaml --saida dist

# Gerar e servir localmente
node gerar.mjs sitefile.yaml --serve

# Inicializar um novo sitefile
npx @thiagopatzdorf/spec2site init sitefile.yaml --serve
```

### Parser

Parser YAML embutido — não depende de `js-yaml` ou qualquer biblioteca externa. Aceita:
- Mapas aninhados por indentação (2 espaços)
- Listas com `-`
- Strings (nuas ou entre aspas duplas)
- Números e booleanos (`true`/`false`)
- Comentários em linha própria (`#` no começo da linha)

Limites atuais: sem âncoras YAML, sem multiline, sem aliases.

## Licença

MIT. Veja [LICENSE](LICENSE).
