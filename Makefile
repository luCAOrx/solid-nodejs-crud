include .env

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down --remove-orphans

.PHONY: start-database
start-database:
	docker start solid-nodejs-crud-database

.PHONY: restart-database
restart-database:
	docker restart solid-nodejs-crud-database

.PHONY: logs-database
logs-database:
	docker-compose logs -f solid-nodejs-crud-database

.PHONY: stop-database
stop-database:
	docker stop solid-nodejs-crud-database

.PHONY: start-server
start-server:
	docker start solid-nodejs-crud-server

.PHONY: restart-server
restart-server:
	docker restart solid-nodejs-crud-server

.PHONY: logs-server
logs-server:
	docker-compose logs -f solid-nodejs-crud-server

.PHONY: stop-server
stop-server:
	docker stop solid-nodejs-crud-server
