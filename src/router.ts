import { IncomingMessage, ServerResponse } from 'http';

export type RouteHandler = (req: IncomingMessage, res: ServerResponse) => void;

export interface Route {
  path: string;
  method: string;
  handler: RouteHandler;
}

class Router {
  private routes: Map<string, Map<string, RouteHandler>> = new Map();

  public addRoute(method: string, path: string, handler: RouteHandler) {
    if (!this.routes.has(method)) {
      this.routes.set(method, new Map());
    }
    this.routes.get(method)!.set(path, handler);
  }

  public handle(req: IncomingMessage, res: ServerResponse) {
    const { url, method } = req;
    
    if (!method || !url) {
      res.statusCode = 400;
      res.end('Bad Request');
      return;
    }

    const methodRoutes = this.routes.get(method);
    
    if (methodRoutes) {
      const handler = methodRoutes.get(url);
      if (handler) {
        handler(req, res);
        return;
      }
    }

    res.statusCode = 404;
    res.end('Not Found');
  }
}

export default Router;
