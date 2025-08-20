# LaudoPro

LaudoPro é uma plataforma web para clínicas e laboratórios gerenciarem exames médicos, permitindo upload seguro de laudos e acesso por pacientes. O sistema suporta perfis distintos para administradores e pacientes, garantindo acesso restrito às funcionalidades correspondentes.

## Funcionalidades Principais

### Autenticação e Autorização

Sistema de login seguro com JSON Web Tokens (JWT) para perfis ADMIN e PACIENTE.

### Painel do Administrador

Dashboard com estatísticas gerais.

Gerenciamento completo (CRUD) de pacientes.

Gerenciamento de exames: cadastro, alteração de status e upload de laudos (PDF, imagens).

### Portal do Paciente

Dashboard de boas-vindas.

Visualização e download do histórico de exames e laudos.

Gerenciamento de perfil pessoal.

## Tecnologias Utilizadas

### Backend

Java 17

Spring Boot 3.5.3

Spring Security / JWT

Spring Data JPA (Hibernate)

Maven

Springdoc OpenAPI (Swagger) para documentação da API

### Frontend

Angular

### Banco de Dados

MySQL 8.0

### Infraestrutura e Orquestração

Docker

Docker Compose

## Pré-requisitos

Antes de iniciar, instale as seguintes ferramentas:

- [Git](https://git-scm.com/)
- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)


## Como Executar a Aplicação

O ambiente completo (backend, frontend e banco de dados) é orquestrado pelo Docker Compose. Siga os passos abaixo:

1. Clonar o Repositório
    ```bash
    git clone https://github.com/gustavo1902/LaudoPro.git

    cd LaudoPro
   ```

2. Configurar Variáveis de Ambiente

Crie um arquivo .env na raiz do projeto com o seguinte conteúdo (altere JWT_SECRET para um valor seguro):

```bash
JWT_SECRET=KeyProducao
JWT_EXPIRATION_MS=86400000
```

3. Modificar o docker-compose.yml

Adicione a referência ao arquivo .env no serviço backend do docker-compose.yml:

```bash
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: laudopro-backend
  ports:
    - "8081:8080"
  env_file:
    - ./.env
  environment:
    SPRING_DATASOURCE_URL: jdbc:mysql://mysql_db:3306/laudopro_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true
    SPRING_DATASOURCE_USERNAME: laudopro_user
    SPRING_DATASOURCE_PASSWORD: laudopro_password_dev
    SPRING_JPA_HIBERNATE_DDL_AUTO: update
    APP_JWT_SECRET: ${JWT_SECRET}
    APP_JWT_EXPIRATION_MILLISECONDS: ${JWT_EXPIRATION_MS}
  depends_on:
    mysql_db:
      condition: service_healthy
  restart: on-failure
```

No application.properties do Spring Boot, referencie as variáveis:

```bash
app.jwt-secret=${APP_JWT_SECRET}
app.jwt-expiration-milliseconds=${APP_JWT_EXPIRATION_MILLISECONDS}
```

4. Iniciar os Contêineres

Execute o comando na raiz do projeto:

```bash
docker-compose up -d --build
```

A aplicação estará pronta quando os contêineres estiverem em execução.

## Acessando a Aplicação

Frontend (Aplicação Principal): http://localhost:4200

Backend (Documentação da API): http://localhost:8081/swagger-ui.html


### Comandos Úteis do Docker Compose

Iniciar serviços em segundo plano:

```bash
docker-compose up -d
```

Parar os serviços:
```bash
docker-compose down
```

Parar e remover contêineres, redes e volumes:

```bash
docker-compose down -v
```

Visualizar logs em tempo real (exemplo: backend):
```bash
docker-compose logs -f backend
```

Forçar reconstrução das imagens:

```bash
docker-compose up -d --build
```

Acessar terminal de um contêiner (exemplo: backend):
```bash
docker-compose exec backend /bin/sh
```

### Estrutura do Projeto
```bash
.
├── backend/              # Código-fonte do backend Spring Boot
├── frontend/             # Código-fonte do frontend Angular
├── .env                  # Variáveis de ambiente (local)
└── docker-compose.yml    # Orquestração dos contêineres
```
