import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { sequelize } from "./database/config";
import commentRouter from "./routers/commentRouter";
import { consoleLogger } from "./utils/logger";

dotenv.config();

const app = express();
const port = 5004;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

sequelize
  .authenticate()
  .then(() => consoleLogger.info("Database connected successfully"))
  .catch(error => {
    consoleLogger.info("Error when connecting to database...: " + error);
    consoleLogger.error(error.stack);
  });

app.get("/", (req, res) => {
  res.send("Hello World! from Comment API");
});

//comments and subcomments
app.get("/comments", commentRouter);
app.get("/comments/:id", commentRouter);
app.post("/comments", commentRouter);
app.put("/comments/:id", commentRouter);
app.delete("/comments/:id", commentRouter);
app.get("/subcomments", commentRouter);
app.get("/subcomments/:id", commentRouter);
app.post("/subcomments", commentRouter);
app.put("/subcomments/:id", commentRouter);
app.delete("/subcomments/:id", commentRouter);

app.listen(port, () => {
  consoleLogger.info("Starting running CommentAPI app...");
  consoleLogger.info(`App listening on port ${port}!`);
});
