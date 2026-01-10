import { APIRequestContext } from '@playwright/test';

export interface TestUser {
  email: string;
  password: string;
  name: string;
}

/**
 * Creates a new test user via the API
 * Returns the created user credentials
 */
export async function createTestUser(
  request: APIRequestContext,
  baseURL: string = 'http://localhost:3000'
): Promise<TestUser> {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(7);
  
  const testUser: TestUser = {
    email: `test-${timestamp}-${randomId}@example.com`,
    password: 'TestPassword123!',
    name: `Test User ${timestamp}`
  };

  const response = await request.post(`${baseURL}/api/v1/users`, {
    data: {
      email: testUser.email,
      password: testUser.password,
      name: testUser.name
    }
  });

  if (!response.ok()) {
    const responseBody = await response.text();
    throw new Error(`Failed to create test user: ${response.status()} ${responseBody}`);
  }

  return testUser;
}

/**
 * Logs in a user via the API and returns the auth cookies
 */
export async function loginUser(
  request: APIRequestContext,
  user: TestUser,
  baseURL: string = 'http://localhost:3000'
): Promise<string[]> {
  const response = await request.post(`${baseURL}/api/v1/login`, {
    data: {
      email: user.email,
      password: user.password
    }
  });

  if (!response.ok()) {
    const responseBody = await response.text();
    throw new Error(`Failed to login user: ${response.status()} ${responseBody}`);
  }

  // Extract cookies from response headers
  const cookies = response.headers()['set-cookie'];
  return cookies ? cookies.split(',') : [];
}

/**
 * Creates a test user and logs them in, returning both user data and auth cookies
 */
export async function createAndLoginTestUser(
  request: APIRequestContext,
  baseURL: string = 'http://localhost:3000'
): Promise<{ user: TestUser; cookies: string[] }> {
  const user = await createTestUser(request, baseURL);
  const cookies = await loginUser(request, user, baseURL);
  
  return { user, cookies };
}