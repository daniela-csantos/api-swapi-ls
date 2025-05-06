
# Star Wars API Proxy

## Overview

This repository is a Star Wars API proxy built using NestJS, with integration for Redis to collect and log statistics, as well as handling API requests. The proxy communicates with the Star Wars API (SWAPI) and provides detailed statistics, such as the most accessed paths, average response times, and peak hours of access. It also utilizes guards and interceptors for robust error handling, security, and logging.

## Features

### Global Exception Filter (`AllExceptionsFilter`)

The project uses a global exception filter to handle errors gracefully across all routes, providing detailed error messages and status codes when necessary.

### API Key Guard (`ApiKeyGuard`)

A custom guard to verify the presence and validity of an API key in the request headers, ensuring that only authorized users can access the API.

### Logging Interceptor (`LoggingInterceptor`)

This interceptor logs API request statistics, such as request count and response duration, to Redis for later analysis. It tracks paths and logs the data every time a request is made.

### Stats Endpoint

The API includes an endpoint that exposes statistics such as:
- Most requested paths
- Average response time per path
- The busiest hour for each path

### Redis Integration

Redis is used to store request statistics, including the total number of requests and their response times, aggregated by the hour.

### Dockerized Setup

The project is dockerized and can be run using Docker Compose. It includes both the NestJS API and Redis containers.

---

## Project Structure

- **src/**: Source code folder containing controllers, services, interceptors, filters, and guards.
- **docker/**: Docker-related configuration files.
- **.github/workflows/**: GitHub Actions configuration for CI/CD.
- **.env**: Environment variables file (excluded from the repo for security reasons).
- **test/**: Test files for unit and integration testing.

---

## How to Run Locally

### Prerequisites

- Install Docker and Docker Compose on your machine.

### Running the API with Docker

1. Clone this repository:
   ```bash
   git clone https://github.com/your-repo/star-wars-api-proxy.git
   cd star-wars-api-proxy
   ```

2. Create a `.env` file based on the `.env.example` template and fill in the required values:
   ```bash
   cp .env.example .env
   ```

3. Run Docker Compose to start both the NestJS API and Redis containers:
   ```bash
   docker-compose up --build
   ```

4. The API will be available at `http://localhost:{PORT}` (replace `{PORT}` with the port specified in `.env`).

---

## Testing & Coverage

### Running Unit Tests

Unit tests can be run using Jest, the testing framework integrated with the project:

```bash
docker-compose exec api npm run test
```

### Running Test Coverage

To generate a test coverage report, run the following command:

```bash
docker-compose exec api npm run test:cov
```

The coverage report will be displayed in the terminal, showing which parts of the code are covered by tests.

---

## CI/CD Integration

This project includes a GitHub Actions configuration that automatically builds, tests, and deploys the application on each push to the `develop` or `main` branches.

### GitFlow Strategy

The repository follows GitFlow principles:
- **Main Branch**: Stable production-ready code.
- **Develop Branch**: All new features and bug fixes are merged here first.
- **Feature Branches**: Created from the `develop` branch for new features.

---

## Environment Variables

This project uses environment variables that need to be set in the `.env` file:
- `PORT`: The port the NestJS API will run on.
- `API_KEY`: The API key for authentication.
- `REDIS_HOST`: Redis hostname (should be `localhost` if running Redis locally).
- `REDIS_PORT`: Redis port (default is `6379`).

---

## API Documentation with Swagger

This application uses **Swagger** for automatic API documentation. Swagger provides an interactive UI where you can see and test all available API endpoints.

### How to Access the Swagger UI

Once the application is running, you can access the Swagger documentation at the following URL:

`http://localhost:3000/api`


### Features of the Swagger UI

- **Endpoint Details**: Each endpoint is listed with its HTTP method (GET, POST, PUT, DELETE, etc.), route, and available responses.
- **Request Parameters**: Swagger automatically detects and displays the parameters that each endpoint requires, including path parameters, query parameters, and request bodies.
- **Response Descriptions**: Each possible response (like 200, 400, 404, etc.) is documented with its description and potential response body structure.
- **Interactive Testing**: You can directly test the endpoints by providing sample data in the Swagger UI, making it easy to interact with the API.

### How the API is Documented

Swagger documentation is generated automatically by using decorators in the code:

- **`@ApiTags`**: Organizes endpoints into logical groups.
- **`@ApiOperation`**: Describes the action or purpose of the endpoint.
- **`@ApiResponse`**: Specifies possible responses, including success and error codes.
- **`@ApiParam`**: Defines request parameters like path variables or query parameters.

This documentation is always kept in sync with the actual API, meaning as new endpoints are added or modified, the documentation will be updated automatically.

### Example

Here is an example of how an endpoint is documented:

```typescript
@ApiTags('Stats')
@UseGuards(ApiKeyGuard)
@Controller()
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis
  ) { }

  @ApiOperation({ summary: 'Get previous queries stats' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @Get('stats')
  async getStats(): Promise<Object> {
    return await this.statsService.getStatsFromAllPaths()
  }

}
```

---


## Conclusion

This project is a fully functional API proxy for the Star Wars API, with detailed logging, error handling, and statistics collection. It's dockerized for easy setup and includes a CI/CD pipeline for automated testing and deployment.

Enjoy interacting with the Star Wars universe!

