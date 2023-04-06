const express = require("express");

const authRouter = require("./routes/auth.routes");
const postRouter = require("./routes/posts.routes");
const { sequelize } = require("./models");

const app = express();

app.use(express.json());

app.use(authRouter);
app.use("/posts", postRouter);

app.listen(3000, async () => {
  console.log("✅ 서버가 연결되었습니다!");
  await sequelize.authenticate();
  console.log("✅ DB가 인증되었습니다!");
});
