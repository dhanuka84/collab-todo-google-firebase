# Collaborative Todo App - Makefile

BACKEND_DIR=backend
FRONTEND_DIR=frontend

install:
	cd $(BACKEND_DIR) && npm install
	cd $(FRONTEND_DIR) && npm install

dev-backend:
	cd $(BACKEND_DIR) && npm run dev

dev-frontend:
	cd $(FRONTEND_DIR) && npm run dev

dev:
	(cd $(BACKEND_DIR) && npm run dev) & (cd $(FRONTEND_DIR) && npm run dev)

build-backend:
	cd $(BACKEND_DIR) && npm run build

build-frontend:
	cd $(FRONTEND_DIR) && npm run build

build: build-backend build-frontend

docker-build:
	docker compose build

docker-up:
	docker compose up

docker-up-detached:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f


clean:
	rm -rf $(BACKEND_DIR)/dist
	rm -rf $(FRONTEND_DIR)/dist
