import cookieSession from "cookie-session";
import express from "express";
import proxy from "http-proxy-middleware";
import path from "path";
import { version } from "../../package.json";
import { home } from "./controllers/home";
import * as oneiam from "./controllers/oneiam";

export const app = express();
export const ports = [3000, 3001];

app.use(cookieSession({ secret: "test" }));

app.get("/", home);
app.get("/oneiam/authenticate", oneiam.authenticate);
app.get("/oneiam/callback", oneiam.callback);

app.get("/oneiam.js", (_, res) => {
  res.sendFile(path.join(__dirname, `../../dist/oneiam-${version}.min.js`));
});

app.use(proxy({ target: "http://localhost:4200" }));
