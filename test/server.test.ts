import request from 'supertest';
import http from 'http';
import { beforeEach, describe, expect, test } from 'vitest'
import Server from '../src/server';

describe('Custom Server Framework', () => {
  let app: Server;

  beforeEach(() => {
    app = new Server();
  });

  test('should respond to GET requests', async () => {
    app.get('/test', (req, res) => {
      res.statusCode = 200;
      res.end('GET Request Success');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).get('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('GET Request Success');
  });

  test('should respond to POST requests', async () => {
    app.post('/test', (req, res) => {
      res.statusCode = 201;
      res.end('POST Request Success');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).post('/test');
    expect(response.status).toBe(201);
    expect(response.text).toBe('POST Request Success');
  });

  test('should handle middleware before route', async () => {
    app.use((req, res, next) => {
      res.setHeader('X-Custom-Header', 'Middleware Applied');
      next();
    });

    app.get('/middleware-test', (req, res) => {
      res.statusCode = 200;
      res.end('Middleware Test Success');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).get('/middleware-test');
    expect(response.status).toBe(200);
    expect(response.headers['x-custom-header']).toBe('Middleware Applied');
    expect(response.text).toBe('Middleware Test Success');
  });

  test('should support PUT requests', async () => {
    app.put('/test', (req, res) => {
      res.statusCode = 200;
      res.end('PUT Request Success');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).put('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('PUT Request Success');
  });

  test('should support PATCH requests', async () => {
    app.patch('/test', (req, res) => {
      res.statusCode = 200;
      res.end('PATCH Request Success');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).patch('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('PATCH Request Success');
  });

  test('should support DELETE requests', async () => {
    app.delete('/test', (req, res) => {
      res.statusCode = 200;
      res.end('DELETE Request Success');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).delete('/test');
    expect(response.status).toBe(200);
    expect(response.text).toBe('DELETE Request Success');
  });

  test('should call multiple middlewares in order', async () => {
    let middlewareOrder = '';

    app.use((req, res, next) => {
      middlewareOrder += '1';
      next();
    });

    app.use((req, res, next) => {
      middlewareOrder += '2';
      next();
    });

    app.get('/middleware-order', (req, res) => {
      res.statusCode = 200;
      res.end('Middleware Order Test');
    });

    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).get('/middleware-order');
    expect(response.status).toBe(200);
    expect(middlewareOrder).toBe('12');
  });

  test('should return 404 for unhandled routes', async () => {
    const server = http.createServer((req, res) => app['handleRequest'](req, res));

    const response = await request(server).get('/not-found');
    expect(response.status).toBe(404);
    expect(response.text).toBe('Not Found');
  });
});
