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
