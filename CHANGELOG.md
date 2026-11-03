## 0.4.3 — 2026-11-03
## 0.4.5 — 2026-11-03

- Exemplo  expandido para lista de 3 depoimentos com  — valida o suporte do parser a múltiplos testemunhos no mesmo bloco.
- Adicionado  ao bloco depoimentos.
- Novos depoimentos: Carlos Mendes (4 estrelas) e Ana Ribeiro (5 estrelas).


## 0.4.4 — 2026-11-03

- ROADMAP no README atualizado: v1.0 marcado como concluído (✓).



- Novo bloco `depoimento`: renderiza testemunhos de clientes com nome, texto e avaliação em estrelas. Aceita um único depoimento ou lista de depoimentos.
- `VERSAO` corrigida de `0.3.6` para `0.4.2` no gerar.mjs (o CHANGELOG já dizia 0.4.2).
- Exemplo `depoimento` adicionado ao `exemplos/cafeteria.yaml`.

- Novo bloco `video`: renderiza embeds de vídeo (iframe) com título, URL, texto opcional e legenda.

- Documentação completa do formato do sitefile no README (seção "Referência do sitefile") — cada campo e cada tipo de bloco descritos com exemplos YAML concretos.
- v1.0: formato do sitefile oficialmente congelado e documentado (`>=0.2`).
- README ampliado de 74 para ~240 linhas.

## 0.4.1 — 2026-11-01

- `npm run deploy` (ou `node deploy.mjs`) — um comando pra gerar o site e fazer deploy ao GitHub Pages.
- `deploy.mjs`: reutiliza `gerar.mjs`, roda o build, sobe os arquivos pra `gh-pages` com fallback via curl.
- `package.json` atualizado: script `deploy` + `deploy.mjs` no `files`.
- Site ao vivo em https://thiagopatzdorf.github.io/spec2site/

## 0.4.1 — 2026-11-01

- `npm run deploy` (ou `node deploy.mjs`) — um comando pra gerar o site e fazer deploy ao GitHub Pages.
- `deploy.mjs`: reutiliza `gerar.mjs`, roda o build, sobe os arquivos pra `gh-pages` com fallback via curl.
- `package.json` atualizado: script `deploy` + `deploy.mjs` no `files`.
- Site ao vivo em https://thiagopatzdorf.github.io/spec2site/

## 0.4.0 — 2026-11-01

- Publicação no npm: `@thiagopatzdorf/spec2site@0.4.0` (scoped pra evitar conflito de nome).
- `package.json` com `name: "@thiagopatzdorf/spec2site"`, binário, engines, homepage, bugs, files e keywords.
- `npx @thiagopatzdorf/spec2site init sitefile.yaml --serve` funciona direto, sem clonar o repo.

## 0.3.6 — 2026-11-01
- Preparação pro npm publish: `package.json` validado, `.npmignore` pronto, dry-run OK.

## 0.3.5 — 2026-10-31

- Short flags `-o`/`--output` (alias pra `--saida`) e `-p` (alias pra `--port`).
- `--help` atualizado com as flags curtas.
- `.npmignore` criado: mantém o pacote npm limpo (sem docs/ ou .gitignore).
- Preparação final pro npm: CLI mais amigável pro `npx spec2site`.

## 0.3.4 — 2026-10-31

- `--version` / `-v`: mostra a versão e sai.
- `package.json` preparado pra npm: `homepage`, `bugs`, `files` e keyword `cli`.

## 0.3.3 — 2026-10-31

- `npx spec2site init [arquivo.yaml]`: scaffold de sitefile.yaml.
- CLI reorganizada com subcomandos: `init` e `--help`.

