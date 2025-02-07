// @deno-types="npm:@types/express@4.17.15"
import express, { NextFunction, Request, Response } from "npm:express@4.18.2";
import router from "./routes/routes.ts";
const app = express();
const PORT = Number(Deno.env.get("PORT")) || 3000;

app.use(express.json());
app.get("/", (_req: Request, res: Response, next: NextFunction) => {
  res.status(200).send("Hello from Deno and Express!");
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
