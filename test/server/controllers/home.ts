import { Request, Response } from "express";

export function home(req: Request, res: Response) {
  res.send(`<!DOCTYPE html>
    <html>
      <head>
      <base></head>
      <body>
        <script src="/oneiam.js"></script>
        <script>
          var oneiam = new Oneiam({
            issuer: "https://wwwtest.auth.careerbuilder.com",
            clientId: "demo_client_id"
          });
        </script>
      </body>
    </html>
  `);
}
