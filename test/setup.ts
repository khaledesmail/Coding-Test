import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { beforeAll, afterAll } from '@jest/globals'; // Import from Jest

let postgresContainer: StartedTestContainer;

beforeAll(async () => {
  try {
    console.log('Hello before------>');
    postgresContainer = await new GenericContainer('postgres')
      .withExposedPorts(5432)
      .start();

    console.log(`PostgreSQL container started successfully`);
  } catch (error) {
    console.error('Error starting PostgreSQL container:', error);
  }
});

afterAll(async () => {
  if (postgresContainer) {
    await postgresContainer.stop();
    console.log('PostgreSQL container stopped');
  }
});
