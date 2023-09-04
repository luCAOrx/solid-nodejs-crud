include .env

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down --remove-orphans

.PHONY: start-server
start-server:
	docker-compose start solid-nodejs-crud-server

.PHONY: start-database
start-database:
	docker-compose start solid-nodejs-crud-database

.PHONY: restart-server
restart-server:
	docker-compose restart solid-nodejs-crud-server

.PHONY: restart-database
restart-database:
	docker-compose restart solid-nodejs-crud-database

.PHONY: logs-server
logs-server:
	docker-compose logs -f solid-nodejs-crud-server

.PHONY: logs-database
logs-database:
	docker-compose logs -f solid-nodejs-crud-database

.PHONY: stop-server
stop-server:
	docker-compose stop solid-nodejs-crud-server

.PHONY: stop-database
stop-database:
	docker-compose stop solid-nodejs-crud-database

.PHONY: test-unit
test-unit:
	docker-compose exec -u node solid-nodejs-crud-server sh -c 'npm run test'

.PHONY: test-e2e
test-e2e:
	docker-compose exec -u node solid-nodejs-crud-server sh -c 'npm run test:e2e'

.PHONY: test-watch-e2e
test-watch-e2e:
	docker-compose exec -u node solid-nodejs-crud-server sh -c 'npm run test:watch:e2e'

.PHONY: server-container-terminal
server-container-terminal:
	docker-compose exec -u node solid-nodejs-crud-server sh
