import http, { IncomingMessage, ServerResponse } from 'http';
import Router, { RouteHandler } from './router';

type Middleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => void;

class Server {
  private middlewares: Middleware[] = [];
  private router: Router;

  constructor() {
    this.router = new Router();
  }

  public use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  public get(path: string, handler: RouteHandler) {
    this.router.addRoute('GET', path, handler);
  }

  public post(path: string, handler: RouteHandler) {
    this.router.addRoute('POST', path, handler);
  }

  public put(path: string, handler: RouteHandler) {
    this.router.addRoute('PUT', path, handler);
  }

  public patch(path: string, handler: RouteHandler) {
    this.router.addRoute('PATCH', path, handler);
  }

  public delete(path: string, handler: RouteHandler) {
    this.router.addRoute('DELETE', path, handler)
  }

  public listen(port: number, callback?: () => void) {
    const server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    server.listen(port, callback);
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse) {
    const executeMiddlewares = (index: number) => {
      if (index < this.middlewares.length) {
        this.middlewares[index](req, res, () => executeMiddlewares(index + 1));
      } else {
        this.router.handle(req, res);
      }
    };

    executeMiddlewares(0);
  }
}

export default Server;
