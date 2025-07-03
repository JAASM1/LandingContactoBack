import env from 'dotenv'
import app from "./src/app.js";
import concectDB from "./src/config/db.js";

env.config()

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await concectDB();
    app.listen(PORT, () => {
      console.log(`Server running in the port ${PORT}`);
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    process.exit(1);
  }
};

startServer()