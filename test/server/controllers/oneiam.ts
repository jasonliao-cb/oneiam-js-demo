import crypto from "crypto";
import { Request, Response } from "express";
import querystring from "querystring";

export function authenticate(req: Request, res: Response) {
  const session = req.session!;

  session.state = crypto.randomBytes(16).toString("hex");
  session.silent = (req.query.silent === "true");
  session.next = req.query.next;

  res.redirect("https://auth.careerbuilder.com/connect/authorize?" + querystring.stringify({
    client_id: "OC1FA9D28B",
    redirect_uri: req.protocol + "://" + req.get("host") + "/oneiam/callback",
    response_type: "code",
    scope: "openid profile",
    state: session.state,
    prompt: session.silent ? "none" : null
  }));
}

export function callback(req: Request, res: Response) {
  const session = req.session!;

  const state = session.state;
  const silent = session.silent;
  const next = session.next;

  if (!req.query.state || req.query.state !== state) {
    return res.status(401).send("Unauthorized");
  }

  delete session.state;
  delete session.silent;
  delete session.next;

  session.authenticated = false;
  res.clearCookie("oneiam_ss");

  if (req.query.code) {
    session.authenticated = true;
    res.cookie("oneiam_ss", req.query.session_state);
  }

  if (silent) {
    res.end();
  } else {
    res.redirect(next || "/");
  }
}
