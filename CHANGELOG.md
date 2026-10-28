# Changelog

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
