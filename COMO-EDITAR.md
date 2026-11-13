# Como editar o perfil

Todo o conteúdo fica em `perfil.json`. O `README.md` e as imagens da pasta `assets/` são gerados a partir dele;
não edite esses arquivos à mão, porque a próxima geração sobrescreve.

1. Abra `perfil.json` e altere o que quiser.
2. Gere de novo:

   ```bash
   node gerar.mjs
   ```

3. Abra `previa.html` no navegador para conferir.
4. Envie para o GitHub com `git add -A`, `git commit` e `git push`.

## O que cada campo faz

| Campo | Onde aparece |
|---|---|
| `nome`, `titulo`, `frase`, `selo` | Banner do topo |
| `sobre` | Parágrafos da primeira seção (um item por parágrafo) |
| `tecnologias` | Etiquetas da segunda seção |
| `projetos` | Cartões: `nome`, `descricao`, `tags` e `link` (com `link` vazio o cartão mostra "EM BREVE") |
| `contatos` | Botões do final; só aparecem os que têm `link` preenchido |
| `secoes` | Títulos das quatro seções |
| `cores.destaque` | A única cor de destaque (números, estrelas, sublinhado, botões) |
| `cores.ceu` | As quatro cores do céu do banner, de cima para baixo |
| `cores.sol`, `cores.silhueta` | Sol e prédios/palmeiras do banner |
| `cores.fundo`, `painel`, `borda`, `texto`, `suave` | Fundo e textos dos cartões e seções |

Para trocar o clima inteiro, mude só `cores.destaque` (por exemplo `#2de2e6` para ciano ou `#ffb347` para laranja).
