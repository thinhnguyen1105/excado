import { readdir } from 'fs-extra';
import { Application } from '@feathersjs/express';
import { logger, rootLocation } from '@app/core';
import { config } from '@app/config';
import { imageRouter } from '@app/website';
import { productImageMiddleware } from './modules/website/aggregates/image/multer/productImage.middleware';
import { uploadsRouter } from './modules/website/aggregates/uploads/uploads.router';
import { downloadsRouter } from './modules/website/aggregates/download/download.router';

export const bootstrapModules = async ({ server }: { server: Application<any> }) => {
  logger.info('[Server] Loading modules...');
  const rootDir = `${rootLocation}/server/modules`;
  const moduleNames = await readdir(rootDir);
  const excludedModules: string[] = ['.DS_Store'];
  const excludedAggregates: string[] = ['helpers', '.DS_Store'];
  for (const moduleName of moduleNames) {
    if (excludedModules.indexOf(moduleName) !== -1) {
      continue;
    }
    const moduleDir = `${rootDir}/${moduleName}`;
    logger.info(`[Server] Loading module '${moduleName}'...`);

    // add aggregates graphql
    logger.info(`[Server] [${moduleName}] Setup aggregates...`);
    const aggregateNames = await readdir(`${moduleDir}/aggregates`);

    for (const aggregateName of aggregateNames) {
      if (excludedAggregates.indexOf(aggregateName) !== -1 || aggregateName.indexOf('index') === 0) {
        continue;
      }
      logger.info(`[Server] [${moduleName}] Setup aggregate '${aggregateName}'...`);
      const serviceUrl = `./modules/${moduleName}/aggregates/${aggregateName}/${aggregateName}.service`;
      const service: any = require(serviceUrl).default;
      if (service) {
        logger.info(`[Server] [${moduleName}][${aggregateName}] Register service api...`);
        if (service.setup) {
          service.setup(server, `/api/${aggregateName}`);
        }
        server.use(`/api/${aggregateName}`, service);
        try {
          const hook = require(`./modules/${moduleName}/aggregates/${aggregateName}/${aggregateName}.hook`).default;
          server.service(`${config.web.api.prefix}/${aggregateName}`).hooks(hook);
        } catch (error) {
          // ignore hook not found
        }
      }
    }
  }

  // Upload images
  server.use('/api/image', productImageMiddleware.single('image'));
  server.use('/api/upload-image', imageRouter);
  server.use('/api/uploads', uploadsRouter);
  server.use('/api/downloads', downloadsRouter);
  logger.info('[Server] Done loading modules...');
};
