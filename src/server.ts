import { startServer } from './app';
import { env } from './config/env';

const start = async () => {
  const app = await startServer();
  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();