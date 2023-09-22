const app = require("./app/server");
require("dotenv").config();
require("./database/connection");

app.listen(process.env.PORT, () => {
  console.log(process.env.URL_SERVER);
});
