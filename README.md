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
- v0.3 (em andamento) — ✓ blocos `precos` e `faq` · segundo tema de cor
- v0.4 — `npx spec2site`, deploy num comando
- v1.0 — formato do sitefile congelado e documentado

## Licença

MIT. Veja [LICENSE](LICENSE).
