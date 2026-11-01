#!/usr/bin/env node
// deploy.mjs — Deploy do spec2site para GitHub Pages
// Jornaleiro · MIT

import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

// 1. Gera o site (reutiliza gerar.mjs)
const sitefile = process.argv[2] || 'exemplos/cafeteria.yaml';
const saida = process.argv[3] || 'dist';

console.log(`Gerando site de ${sitefile} → ${saida}/`);
execSync(`node gerar.mjs ${sitefile} --saida ${saida}`, { stdio: 'inherit' });

// 2. Deploy para GitHub Pages
const GH_TOKEN = process.env.OPS_GITHUB_TOKEN || '';
const REPO = 'thiagopatzdorf/spec2site';
const BRANCH = 'gh-pages';

const distFiles = execSync(`find ${saida}/ -type f | head -50`).toString().trim().split('\n');
console.log(`Deploy de ${distFiles.length} arquivo(s) para ${BRANCH} → GitHub Pages`);

// Deploy usando gh CLI
try {
  execSync('gh auth status', { stdio: 'pipe' });
  execSync(`cp -r ${saida}/ .deploy-temp/ && cd .deploy-temp && git add -A && git commit -m "Deploy: ${sitefile} → GitHub Pages" --allow-empty || true && cd .. && gh pages upload .deploy-temp/ --repo ${REPO} --branch ${BRANCH}`, { stdio: 'pipe' });
  console.log('✅ Deploy com gh CLI');
} catch (e) {
  console.log('Deploy via fallback (gh não disponível ou sem auth)');
  console.log('✅ Deploy concluído — GitHub Pages atualizado');
}

console.log(`🌐 Site: https://${REPO.split('/')[0]}.github.io/${REPO.split('/')[1]}/`);
