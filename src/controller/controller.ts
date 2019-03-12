import { Context } from 'koa';
import * as Router from 'koa-router';
import 'reflect-metadata';

const requestMethod: Record<string, string> = {
  Head: 'head',
  Options: 'options',
  Get: 'get',
  Put: 'put',
  Patch: 'patch',
  Post: 'post',
  Delete: 'delete',
};

interface IDecoratedRoute {
  method: string;
  path: string;
  name: string;
  middleware: IMiddleware[];
}
interface Dict {
  [id: string]: any;
}

type IMiddleware = (ctx: Context, next: () => any) => any;

export class DecoratedRoute implements IDecoratedRoute {
  method: string;
  path: string;
  name: string;
  middleware: IMiddleware[];

  constructor(options: IDecoratedRoute) {
    this.method = options.method;
    this.path = options.path;
    this.name = options.name;
    this.middleware = options.middleware ? options.middleware : [];
  }
}

function Route(method: string, path: string, middleware: IMiddleware[]) {
  return (target: any, name: string) => {
    const routes: DecoratedRoute[] = Reflect.hasMetadata('routing:routes', target)
      ? Reflect.getMetadata('routing:routes', target)
      : [];
    routes.push(new DecoratedRoute({ method, path, name, middleware }));
    Reflect.defineMetadata('routing:routes', routes, target);
  };
}

// tslint:disable-next-line:max-classes-per-file
export class BaseController {
  getRouter() {
    const controllerRouter: Router = Reflect.getMetadata('routing:router', this);
    const controllerMiddleware: IMiddleware[] = Reflect.getMetadata('routing:middleware', this);

    controllerRouter.use(...controllerMiddleware);

    const routes: DecoratedRoute[] = Reflect.getMetadata('routing:routes', this) || [];

    routes.forEach((r) => {
      (controllerRouter as Dict)[r.method](r.path, ...r.middleware, async (ctx: Context) => {
        await (this as Dict)[r.name](ctx);
      });
    });

    return controllerRouter;
  }

  protected makeResponse(data: any) {
    return { success: true, data };
  }
}

export function Controller(pathPrefix: string, ...middleware: IMiddleware[]) {
  return (constructor: any) => {
    const router = new Router();
    router.prefix(pathPrefix);
    Reflect.defineMetadata('routing:router', router, constructor.prototype);
    Reflect.defineMetadata('routing:middleware', middleware, constructor.prototype);
  };
}
export function Head(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Head, path, middleware);
}

export function Options(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Options, path, middleware);
}

export function Get(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Get, path, middleware);
}

export function Put(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Put, path, middleware);
}

export function Post(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Post, path, middleware);
}

export function Patch(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Patch, path, middleware);
}

export function Delete(path: string, ...middleware: IMiddleware[]) {
  return Route(requestMethod.Delete, path, middleware);
}
