# NestJS CRUD API with PostgreSQL

This project is a simple CRUD API built using Node.js, NestJS, TypeScript, and PostgreSQL. It allows users to manage posts with features like creating, reading, updating, and deleting posts.

## Prerequisites

- Node.js (v18)
- Docker and Docker Compose
- PostgreSQL (v15)

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone https://github.com/khaledesmail/Coding-Test.git
    cd Coding-Test
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create a `.env` file:**

    ```env
    add your own credentials
    ```

4. **Start PostgreSQL and App container:**

    ```bash
    docker-compose up -d
    ```

5. **Run the application in development mode:**

    ```bash
    npm run start:dev
    ```

6. **Access Swagger Documentation:**

    Open [http://localhost:3000/api](http://localhost:3000/api) to view the Swagger documentation.

## API Endpoints

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get a post by id
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post by id
- `DELETE /posts/:id` - Delete a post by id

- `POST /auth/register` - register a user
- `POST /auth/login` - login and get access token

## Authentication and Authorization

- JWT and Passport are used for authentication
- Users must register and login to create, update, or delete posts
- Different roles (admin, editor, reader) are assigned to users

## Unit Tests

Run unit tests with:

```bash
npm run test
npm run test:cov
```
##  Build and Production
```bash
npm run build
npm run start:prod
```

## Scaling the User Service

As the user base grows, it's essential to consider and implement strategies for scaling the user service. Below are potential strategies to handle increased loads:

### 1. Load Balancing

Implementing load balancing distributes incoming traffic across multiple instances of your application. This ensures that no single instance becomes a bottleneck and allows for better resource utilization.

### 2. Database Sharding

Database sharding involves horizontally partitioning your database to distribute data across multiple database servers. Each shard handles a subset of the data, reducing the load on individual database servers.

### 3. Caching Mechanisms

Utilize caching mechanisms to store frequently accessed data in a fast.

### 4. Horizontal Scaling

Consider deploying your application on multiple servers or containers to horizontally scale the user service.

### 5. Content Delivery Networks (CDN)

Use a Content Delivery Network to cache and deliver static assets, such as images and scripts, closer to users. This reduces latency and enhances the overall performance of your application.

### 6. Efficient Indexing and Query Optimization

Optimize database queries by ensuring proper indexing and analyzing query performance. This helps maintain fast response times even as the dataset grows.

### 7. Autoscaling

Leverage cloud providers' autoscaling features to automatically adjust the number of instances based on traffic and load. This ensures that your application can dynamically handle varying workloads.
