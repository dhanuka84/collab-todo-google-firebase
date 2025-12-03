# -----------------------------------------
# Collaborative Todo App - Makefile
# -----------------------------------------

# Paths
BACKEND_DIR=backend
FRONTEND_DIR=frontend

# -------------------------
# Install dependencies
# -------------------------

install:
	@echo " Installing backend dependencies..."
	cd $(BACKEND_DIR) && npm install
	@echo " Installing frontend dependencies..."
	cd $(FRONTEND_DIR) && npm install
	@echo " Dependencies installed."

# -------------------------
# Local development
# -------------------------

dev-backend:
	cd $(BACKEND_DIR) && npm run dev

dev-frontend:
	cd $(FRONTEND_DIR) && npm run dev

dev:
	@echo " Starting backend & frontend..."
	@echo " Backend on http://localhost:4000"
	@echo " Frontend on http://localhost:5173"
	(cd $(BACKEND_DIR) && npm run dev) & (cd $(FRONTEND_DIR) && npm run dev)

# -------------------------
# Build (production)
# -------------------------

build-backend:
	cd $(BACKEND_DIR) && npm run build

build-frontend:
	cd $(FRONTEND_DIR) && npm run build

build: build-backend build-frontend
	@echo " Full project build complete."

# -------------------------
# Docker Compose
# -------------------------

docker-build:
	@echo " Building Docker images..."
	docker-compose build

docker-up:
	@echo " Starting Docker Compose..."
	docker-compose up

docker-up-detached:
	@echo " Starting Docker Compose in detached mode..."
	docker-compose up -d

docker-down:
	@echo " Stopping Docker Compose..."
	docker-compose down

docker-restart:
	make docker-down
	make docker-up

docker-logs:
	docker-compose logs -f

# -------------------------
# Clean build artifacts
# -------------------------

clean:
	@echo " Cleaning build folders..."
	rm -rf $(BACKEND_DIR)/dist
	rm -rf $(FRONTEND_DIR)/dist
	@echo " Cleanup complete."
