import { IncomingMessage, ServerResponse } from 'http';

export type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

export interface Route {
  path: string;
  method: string;
  handler: RouteHandler;
}

class Router {
  private routes: Route[] = [];

  public addRoute(method: string, path: string, handler: RouteHandler) {
    this.routes.push({ method, path, handler });
  }

  public handle(req: IncomingMessage, res: ServerResponse) {
    const { url, method } = req;
    const route = this.routes.find(route => route.path === url && route.method === method);
    
    if (route) {
      route.handler(req, res);
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }
}

export default Router;
