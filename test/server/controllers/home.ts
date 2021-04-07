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
            issuer: "https://auth.careerbuilder.com",
            clientId: "OC1FA9D28B",
            alternateOrigins: ${
              req.query.alternateOrigins ?
                JSON.stringify([].concat(req.query.alternateOrigins)) :
                "undefined"
            }
          });
        </script>
      </body>
    </html>
  `);
}
