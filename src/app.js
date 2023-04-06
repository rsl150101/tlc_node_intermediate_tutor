const express = require("express");
const { sequelize } = require("./models");

const app = express();

app.listen(3000, async () => {
  console.log("✅ 서버가 연결되었습니다!");
  await sequelize.authenticate();
  console.log("✅ DB가 인증되었습니다!");
});
