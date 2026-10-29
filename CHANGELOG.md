# Changelog

## 0.3.0 — 2026-10-29

- Bloco `precos`: tabela de planos em cards com nome, preço, lista de recursos, botão CTA e plano em destaque ("★ Mais popular").
- Bloco `faq`: seção de perguntas frequentes em `<details><summary>`, expansível, zero JavaScript.
- Exemplo `cafeteria.yaml` ganhou seção de planos mensais (3 cards) na página inicial e FAQ na página Sobre.
- Zero dependências adicionadas.

## 0.2.2 — 2026-10-29

- Favicon SVG automático: ícone com a cor do tema (`S` estilizado), inline via `data:` — zero assets.
- `og:image` automática: banner SVG com nome e descrição do site, inline via `data:`.
- `twitter:card = summary_large_image` nas páginas.
- Nenhuma dependência adicionada — tudo inline.

## 0.2.1 — 2026-10-28

- `sitemap.xml` automático: com `url` no sitefile (ou `--url` na linha de comando), o sitemap nasce com todas as páginas do site.
- `robots.txt` ganhou linha `Sitemap:` apontando pro sitemap quando a URL existe.
- URL sem `http(s)://` para o gerador com mensagem clara.

## 0.2.0 — 2026-10-28

- Bloco `galeria`: grade de fotos responsiva com legenda, `loading="lazy"` e hover suave.
- Imagens locais (caminho relativo ao sitefile) são copiadas automaticamente pra `<saida>/imagens/`; URLs `http(s)` e `data:` passam direto.
- Imagem apontada e não achada agora para o gerador com mensagem clara.
- Exemplo `cafeteria.yaml` ganhou galeria com 6 ilustrações SVG em `exemplos/imagens/`.

## 0.1.0 — 2026-10-28

- Primeiro commit público: um `sitefile.yaml` gera um site estático.
- Parser YAML embutido, feito sob medida pro formato (zero dependências).
- Blocos: `hero`, `texto`, `lista`, `contato`.
- Navegação entre páginas, tema por cor, responsivo, meta tags básicas.
- Exemplo completo de duas páginas: `exemplos/cafeteria.yaml`.
