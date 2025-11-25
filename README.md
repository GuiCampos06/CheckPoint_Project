# CheckPOINT — Sistema de Gestão de Lazer, Tempo e Finanças

## *Centro Paula Souza – Faculdade de Tecnologia de Franca “Dr. Thomaz Novelino”*

*Curso:* Tecnólogo em Desenvolvimento de Software Multiplataforma (DSM)
*Projeto Orientado (P.O):* Guilherme Barbosa B. Campos
*Integrantes:* Guilherme B. B. Campos, Cauã H. Nascimento, Gabriel H. Ferreira, Rodrigo Avelar Santos
*Ano:* 2025-2

---

# 📘 Descrição do Projeto

O *CheckPOINT* é uma aplicação desenvolvida para auxiliar usuários a equilibrar vida social, tempo e finanças. Ele funciona como um *assistente inteligente* para organização de eventos pessoais e coletivos, fornecendo ao usuário ferramentas para planejar encontros, dividir despesas, monitorar limites financeiros e visualizar alertas sobre sua saúde financeira.

A proposta surgiu a partir da dificuldade comum de conciliar lazer, compromissos diários e finanças de forma organizada. O sistema utiliza conceitos práticos de *educação financeira* e *psicologia econômica*, fornecendo insights e relatórios personalizados.

---

# 🚀 Funcionalidades Principais

### *✔ 1. Gestão de Usuário*

* Cadastro e login com validação.
* Recuperação de senha.
* Edição de perfil e atualização de foto.

### *✔ 2. Gestão Financeira e de Tempo*

* Cadastro de limite de saldo.
* Monitoramento do orçamento.
* Sistema visual de alerta através do *Semáforo Financeiro*:

  * 🟢 *Verde:* Gastos seguros.
  * 🟡 *Amarelo:* Atenção.
  * 🔴 *Vermelho:* Gastos comprometendo o orçamento.

### *✔ 3. Gestão de Eventos (Rolês)*

* Criação de eventos com nome, data, local, quantidade de participantes e gastos.
* Listagem e visualização detalhada de eventos.
* Ligação automática entre gastos e eventos.

### *✔ 4. Relatórios e Insights*

* Resumo de gastos.
* Cálculo de valores por evento.
* Recomendações financeiras futuras.

---

# 🧭 Estórias de Usuário (User Stories)

* Registrar disponibilidade de tempo.
* Dividir despesas automaticamente com outros participantes.
* Receber alertas de gastos.
* Visualizar relatórios após cada evento.
* Compartilhar informações com uma futura comunidade de usuários.

---

# 📌 Requisitos Funcionais

* *RF001:* Cadastro de usuário.
* *RF002:* Definir orçamento e disponibilidade.
* *RF003:* Visualizar painel de gestão.
* *RF004:* Dividir despesas.
* *RF005:* Sistema de semáforo financeiro.
* *RF006:* Relatórios pós-evento.
* *RF007:* Alertas financeiros.

# 🔒 Requisitos Não Funcionais

* Interface intuitiva.
* Segurança dos dados (criptografia de senha).
* Alta disponibilidade.
* Código modular.
* Privacidade configurável.

---

# 📂 Casos de Uso

* *UC001:* Gerenciar usuário.
* *UC002:* Gerenciar orçamento e tempo.
* *UC003:* Visualizar painel.
* *UC004:* Gerenciar despesas de eventos.

---

# 🛠 Tecnologias Utilizadas

### *Frontend:*

* HTML5, CSS3, JavaScript

### *Backend:*

* Node.js (Express)
* Middleware de sessão (express-session)

### *Banco de Dados:*

* MySQL
* Tabelas: *users, **events, **gastos*

---

# ▶ Como Executar o Projeto

### *1. Clonar o repositório*


git clone https://github.com/seu-usuario/seu-repositório.git


### *2. Entrar na pasta backend*



### *3. Instalar dependências*


npm install


### *4. Configurar o Banco de Dados*

* Criar banco MySQL
* Executar script de criação das tabelas
* Configurar o arquivo conexao.js com suas credenciais

### *5. Rodar o servidor*


node app.js


Ou, se usar nodemon:


npm start


### *6. Acessar no navegador*


http://localhost:4000


---

# 📁 Estrutura Simplificada do Projeto


/project
│── /public
│   ├── css/
│   ├── js/
│   ├── img/
│   ├── *.html
│
│── /Backend
│   ├── /Controllers
│   ├── /Models
│   ├── /conexao
│   ├── app.js
│
└── README.md


---

# 👨‍💻 Equipe

* *Guilherme Barbosa B. Campos*
* *Cauã Henrique Nascimento*
* *Gabriel Henrique Ferreira*
* *Rodrigo Avelar Santos*

---

# 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais.

---

# 🏁 Conclusão

O *CheckPOINT* integra organização pessoal, controle financeiro e planejamento social em um único sistema eficiente. Seu desenvolvimento aplica conceitos fundamentais de engenharia de software, banco de dados, usabilidade e modelagem.

O sistema está em evolução e possui grande potencial para expansão com novas funcionalidades como comunidade, compartilhamento e relatórios inteligentes.
