const express = require("express");
require("dotenv").config();

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/posts.routes");
const commentRouter = require("./routes/comments.routes");
const { sequelize } = require("./models");

const app = express();

app.use(express.json());

app.use(authRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

app.listen(3000, async () => {
  console.log("✅ 서버가 연결되었습니다!");
  await sequelize.authenticate();
  console.log("✅ DB가 인증되었습니다!");
});
