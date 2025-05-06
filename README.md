
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
   git clone git@github.com:daniela-csantos/api-swapi-ls.git
   cd api-swapi-ls
   ```

2. Run Docker Compose to start both the NestJS API and Redis containers:
   ```bash
   docker-compose up --build
   ```

3. The API will be available at `http://localhost:{PORT}` (replace `{PORT}` with the port specified in `.env`).

---

## Testing & Coverage

### Running Unit Tests

Unit tests can be run using Jest, the testing framework integrated with the project:

```bash
npm run test
```

### Running Test Coverage

To generate a test coverage report, run the following command:

```bash
npm run test:cov
```

The coverage report will be displayed in the terminal, showing which parts of the code are covered by tests.

---


### GitFlow Strategy

The repository follows GitFlow principles:
- **Main Branch**: Stable production-ready code.
- **Feature Branches**: Created from the `main` branch for new features.
- **Task Branches**: Created from the `main` branch for tasks whithin features.

---

## Environment Variables

This project uses environment variables that need to be set in the `.env` file:
- `SWAPI_BASE_URL`: SWAPI API.
- `CORS_ORIGIN`: The origins you allow calling for your API.
- `PORT`: The port the NestJS API will run on.
- `API_KEY`: The API key for authentication.
- `REDIS_HOST`: Redis hostname (should be `localhost` if running Redis locally).
- `REDIS_PORT`: Redis port (default is `6379`).

---

## API Documentation with Swagger

This application uses **Swagger** for automatic API documentation. Swagger provides an interactive UI where you can see and test all available API endpoints.

### How to Access the Swagger UI

Once the application is running, you can access the Swagger documentation at the following URL:

`http://localhost:3001/api`



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

