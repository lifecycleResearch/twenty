/**
 * Vercel serverless entry point for the Twenty NestJS backend.
 *
 * The NestJS app is bootstrapped once and cached across warm invocations.
 * Build must run before this function is invoked — `packages/twenty-server/dist/`
 * is included via the `includeFiles` setting in vercel.json.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Resolve the built NestJS dist relative to this file
const DIST = path.join(__dirname, '..', 'packages', 'twenty-server', 'dist');

let cachedHandler = null;

async function buildHandler() {
  const { NestFactory } = require('@nestjs/core');
  const { useContainer } = require('class-validator');
  const session = require('express-session');
  const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.mjs');
  const bytes = require('bytes');

  const { setPgDateTypeParser } = require(path.join(DIST, 'database/pg/set-pg-date-type-parser'));
  const { AppModule } = require(path.join(DIST, 'app.module'));
  const { LoggerService } = require(path.join(DIST, 'engine/core-modules/logger/logger.service'));
  const { getSessionStorageOptions } = require(path.join(DIST, 'engine/core-modules/session-storage/session-storage.module-factory'));
  const { TwentyConfigService } = require(path.join(DIST, 'engine/core-modules/twenty-config/twenty-config.service'));
  const { UnhandledExceptionFilter } = require(path.join(DIST, 'filters/unhandled-exception.filter'));
  const { settings } = require(path.join(DIST, 'engine/constants/settings'));
  const { generateFrontConfig } = require(path.join(DIST, 'utils/generate-front-config'));

  setPgDateTypeParser();

  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
    bufferLogs: false,
  });

  const logger = app.get(LoggerService);
  const twentyConfigService = app.get(TwentyConfigService);

  app.useLogger(logger);
  app.useGlobalFilters(new UnhandledExceptionFilter());

  app.use(session(getSessionStorageOptions(twentyConfigService)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const maxFileSize = settings.storage.maxFileSize;

  app.useBodyParser('json', { limit: maxFileSize });
  app.useBodyParser('urlencoded', { limit: maxFileSize, extended: true });

  app.use('/graphql', graphqlUploadExpress({ maxFieldSize: bytes(maxFileSize), maxFiles: 10 }));
  app.use('/metadata', graphqlUploadExpress({ maxFieldSize: bytes(maxFileSize), maxFiles: 10 }));

  generateFrontConfig();

  await app.init();

  return app.getHttpAdapter().getInstance();
}

module.exports = async (req, res) => {
  if (!cachedHandler) {
    cachedHandler = await buildHandler();
  }
  cachedHandler(req, res);
};
