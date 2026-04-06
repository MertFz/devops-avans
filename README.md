# DevOps Avans Project 🚀

Full-stack application with microservices architecture, message queuing, and robust monitoring.

## Service Status

| Service | Status | Description |
| :--- | :--- | :--- |
| **Avans API** | ![CI Status](https://github.com/MertFz/devops-avans/actions/workflows/CI-API.yml/badge.svg) | Main entry point (Express) |
| **Background Worker** | ![CI Status](https://github.com/MertFz/devops-avans/actions/workflows/CI-API.yml/badge.svg) | Processes orders via RabbitMQ |
| **Monitoring** | Online | Prometheus & Grafana |

## Architecture

- **`avans-api`**: Handles GET / health and POST /order. Publishes orders to `rabbitmq`.
- **`worker-service`**: Consumes `orders` from RabbitMQ and stores them in its own database.
- **`rabbitmq`**: Acts as the message broker for service communication.
- **`prometheus`**: Scrapes metrics from services (API/Worker runtime and DB).
- **`grafana`**: Visualizes metrics with custom dashboards.

## Getting Started

1.  **Clone the repository.**
2.  **Run with Docker Compose:**
    ```bash
    docker-compose up -d --build
    ```
3.  **Access services:**
    - API: `http://localhost:3000`
    - Grafana: `http://localhost:4000` (admin/admin)
    - Prometheus: `http://localhost:9090`
    - RabbitMQ Management: `http://localhost:15672` (guest/guest)

## Testing

Run tests locally:
```bash
# API Tests
cd week1 && npm test

# Worker Tests
cd worker-service && npm test
```
