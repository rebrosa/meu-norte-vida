# Cenários de teste manual do MVP

Criado em 27/11/2026. Use somente contas de teste e dados fictícios. Preencha a coluna Resultado com OK, Falhou ou a data do teste.

| # | Cenário | Passos | Resultado esperado | Resultado |
|---|---|---|---|---|
| 1 | Cadastro e login | Criar uma conta de teste, confirmar o e-mail e entrar | Entra no app e vê o aviso de senha (10+ caracteres) | |
| 2 | Verificação de segurança | Escolher "em perigo agora" e depois "não" | "Sim" mostra os contatos de emergência; "não" segue para o início | |
| 3 | Novo registro | Criar um episódio com data, intensidade e marcadores | Salva e aparece na lista de registros | |
| 4 | Minha decisão | Escrever a carta e editar depois | Fica uma carta por pessoa, editável | |
| 5 | Botão "Estou pensando em voltar" | Escolher o sentimento e seguir os 3 passos | Mostra a própria carta, os 3 registros mais intensos e o timer de 15 minutos | |
| 6 | Respirar com IA e limite | Fazer 11 pedidos seguidos (no Lovable) | 10 respostas normais e o 11º com a mensagem de limite | |
| 7 | Três idiomas | Trocar EN, PT e DE em telas diferentes | Textos, datas e contatos mudam: PT mostra Brasil (190, 180); EN e DE mostram 112, 110 e 116 016 | |
| 8 | Isolamento entre contas | Entrar com a conta B em janela anônima | Não vê nenhum registro nem carta da conta A (nos dois sentidos) | |
| 9 | Excluir a conta | Digitar a palavra de confirmação (APAGAR, DELETE ou LÖSCHEN) | Sai da sessão e o login antigo não funciona mais | |
| 10 | Dois endereços | Repetir login e navegação no Lovable e no Cloudflare | Lovable completo; no Cloudflare tudo funciona, menos o Respirar | |

## Depois do cenário 6
Limpar a contagem no Supabase: `delete from public.ai_usage where user_id = '...'` (conforme o PR nº 4).

## Ainda fora destes cenários
- Política de privacidade: citar que o texto do Respirar vai para um serviço de IA externo e a regra de exclusão de conta.
- Alemão sem revisão de falante nativo; layout em celular real e leitor de tela.
