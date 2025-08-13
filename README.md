# LaudoPro

LaudoPro é uma plataforma web desenvolvida para clínicas e laboratórios gerenciarem exames médicos, realizarem o upload de laudos e disponibilizá-los de forma segura para os pacientes. O sistema possui perfis de acesso distintos para administradores e pacientes, garantindo que cada usuário tenha acesso apenas às funcionalidades pertinentes.

## Funcionalidades Principais

Autenticação e Autorização: Sistema de login seguro com JSON Web Tokens (JWT) para os perfis ADMIN e PACIENTE.

Painel do Administrador:

Dashboard com estatísticas gerais.

Gerenciamento completo (CRUD) de pacientes.

Gerenciamento de exames, incluindo cadastro, alteração de status e upload de arquivos de laudo (PDF, Imagens).

Portal do Paciente:

Dashboard de boas-vindas.

Visualização e download do histórico de exames e laudos.

Gerenciamento do próprio perfil.

Tecnologias Utilizadas
Backend:

Java 17

Spring Boot 3.5.3

Spring Security / JWT

Spring Data JPA (Hibernate)

Maven

Springdoc OpenAPI (Swagger) para documentação da API

Frontend:

Angular

Banco de Dados:

MySQL 8.0

Infraestrutura e Orquestração:

Docker

Docker Compose

## Como Executar

Para executar o LaudoPro, siga as instruções abaixo:

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
2. Clone este repositório em sua máquina local.
3. Navegue até o diretório do projeto.
4. Execute o seguinte comando para iniciar os contêineres:

```bash
docker compose up -d --build
```