import * as path from "node:path";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { clc } from "@nestjs/common/utils/cli-colors.util";
import * as dayjs from "dayjs";
import { NextFunction, Request, Response } from "express";
import * as morgan from "morgan";
import { createStream } from "rotating-file-stream";

const format = `{
  "date": ":date[iso]",
  "method": ":method",
  "response-time": ":response-time ms",
  "total-time": ":total-time ms",
  "url": ":url",
  "status": :status,
  "ip": ":remote-addr",
  "user-agent": ":user-agent"
},`;

@Injectable()
export class ProdLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    morgan(format, {
      stream: createStream("http-logs.log", {
        interval: "3d",
        size: "10M",
        path: path.join("logs"),
      }),
    })(req, res, next);
  }
}

@Injectable()
export class DevLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    morgan(function (tokens, req, res) {
      const status = tokens.status(req, res);
      const url = tokens.url(req, res);
      const isSuccess = Number(status) < 400;
      let operation = "";
      // @ts-expect-error - The body is not defined in the Request type
      if (url.includes("graphql") && req.body?.operationName) {
        // @ts-expect-error - The body is not defined in the Request type
        operation = `| ${clc.yellow(req.body.operationName)}`;
      }

      return [
        `${clc.green("[BookRentalAPI] -")} ${dayjs(tokens.date(req, res, "iso")).format("MM/DD/YYYY, h:mm:ss A")} `,
        isSuccess ? clc.green("LOG") : clc.red("ERROR"),
        clc.yellow("[REQUEST]"),
        clc.green(tokens.method(req, res)),
        isSuccess ? clc.green(url) : clc.red(url),
        isSuccess ? clc.green(status) : clc.red(status),
        "|",
        clc.yellow(`${tokens["response-time"](req, res)}ms`),
        operation,
        "|",
        clc.green(tokens["remote-addr"](req, res)),
        "|",
        clc.green(tokens["user-agent"](req, res)),
      ].join(" ");
    })(req, res, next);
  }
}
