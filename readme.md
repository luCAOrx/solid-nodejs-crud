<h1 align="center">SOLID CRUD Node.js</h1>

<p align="center">
  <a href="#descrição">Descrição</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#conteúdo-técnico">Conteúdo técnico</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#requisitos">Requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#inicializando-a-aplicação">Inicializando a aplicação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <br/>
  <a href="#executando-a-aplicação">Executando a aplicação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#documentação-da-api">Documentação da API</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#teste">Teste</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#comandos-do-docker-compose">Comandos do docker-compose</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#licença">Licença</a>
</p>

# Descrição
Este é um teste para desenvolvedores

## Introdução

Este projeto possui um banco de dados fake em [fakeData.js](./test/in-memory-database/in-memory-user-database.ts) com apenas um registro.
A ideia é melhorar e o CRUD escrito nos 4 arquivos de teste abaixo.

Será a validada a forma de escrita de código.
Escreva códigos que humanos consigam entender.

Fique a vontade para fazer modificações nos serviços, comentários em código, estrutura, mas seja objetivo.

## teste 1

[GET em /user](./src/infra/http/controllers/get-user/get-user-controller.ts)

Possuímos neste arquivo um serviço que faz uma busca no banco fake e retorna um registro.
Este código funciona, mas é possível melhorar.
Veja o que pode deixar ele melhor escrito e mais performático.

## teste 2

[POST em /users](./src/infra/http/controllers/register-user/register-user-controller.ts), descubra a intenção dele e o corrija.

## teste 3

[DELETE em /user](./src/infra/http/controllers/delete-user/delete-user-controller.ts)

Este procura um usuário e o deleta da base.
Retorne sucesso para o client caso realmente tenha sido excluído e deixe o código mais performático.

## teste 4

[PUT em /user](./src/infra/http/controllers/update-user/update-user-controller.ts)

Atualiza os dados de um usuário especifico.

## teste 5

[GET em /user](./src/infra/http/controllers/get-user/get-user-controller.ts)

Retorne quantas vezes determinado usuário foi lido no <a href="#teste-1">teste 1</a>.

## teste 6

[Middleware](./src/infra/http/middlewares/ensure-authenticated-middleware.ts)

Defina uma forma de criar permissão para o usuário, defina se o usuário pode deletar ou atualizar usuários. Crie um middleware para validar essas permissões e adicione no <a href="#teste-4">teste 4</a> e <a href="#teste-3">teste 3</a>.
 
## Conteúdo técnico
- [DDD](https://khalilstemmler.com/articles/domain-driven-design-intro/)
- [TDD](https://khalilstemmler.com/articles/test-driven-development/introduction-to-tdd/)
- [SOLID](https://www.youtube.com/watch?v=vAV4Vy4jfkc)
- [Value Objects](https://khalilstemmler.com/articles/typescript-value-object/)
- [In Memory Database](https://www.martinfowler.com/bliki/InMemoryTestDatabase.html)
- [Factory Pattern](https://www.digitalocean.com/community/tutorials/js-factory-pattern)
 
## Tecnologias
- [Node.js LTS](https://nodejs.org/pt-br/)
- [Express](https://expressjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Prisma](https://www.prisma.io/)
- [Jwt](https://jwt.io/)
- [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [JestJS](https://jestjs.io/)
- [Supertest](https://github.com/ladjs/supertest#readme)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Requisitos
- [Node.js LTS](https://nodejs.org/pt-br/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Inicializando a aplicação

### Subir os containers do docker
```bash
sudo make up
```

### Instalar as dependências
```bash
npm install
```

### Adicione as variáveis de ambiente
Renomeie o arquivo `.env.example` para `.env` e altere se necessário os valores das variáveis.

### Execute as migrações
```bash
npx prisma migrate dev
```

### Execute a aplicação em modo de desenvolvimento
```bash
npm run start:dev
```

## Executando a aplicação

### modo de desenvolvimento
```bash
npm run start:dev
```

### modo de produção
```bash
npm run start:prod
```

## Teste

### testes unitários
```bash
npm run test
```

### observar alterações nos testes
```bash
npm run test:watch
```


### testes e2e (ponta à ponta)
```bash
npm run test:e2e
```

### cobertura de testes
```bash
npm run test:cov
```

## Comandos do docker-compose
### Subir os containers
```bash
sudo make up
```

### Remover os containers
```bash
sudo make down
```

#### Banco de dados
##### Subir o container
```bash
sudo make start-database
```

##### Mostrar os logs
```bash
sudo make logs-database
```

##### Reiniciar o container
```bash
sudo make restart-database 
```

##### Parar o container
```bash
sudo make stop-database 
```

#### Servidor
##### Subir o container
```bash
sudo make start-server
```

##### Mostrar os logs
```bash
sudo make logs-server
```

##### Reiniciar o container
```bash
sudo make restart-server 
```

##### Parar o container
```bash
sudo make stop-server 
```
  
## Licença
Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
