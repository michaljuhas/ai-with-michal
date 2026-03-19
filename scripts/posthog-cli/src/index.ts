export { program } from './cli';
export { loadConfig, setConfigValue, ConfigError } from './lib/config';
export { PostHogClient, createClient, ApiError } from './lib/client';
export { formatOutput } from './lib/output';
export { formatError } from './lib/errors';
export * as eventsResource from './resources/events';
export * as featureFlagsResource from './resources/feature-flags';
export * as personsResource from './resources/persons';
export * as queryResource from './resources/query';
export * as insightsResource from './resources/insights';
export * as dashboardsResource from './resources/dashboards';
export * as annotationsResource from './resources/annotations';
export * as cohortsResource from './resources/cohorts';
export * as projectsResource from './resources/projects';

// Run CLI when executed directly
if (require.main === module) {
  const { program: cli } = require('./cli');
  (cli as import('commander').Command).parseAsync(process.argv).catch((err: unknown) => {
    const { formatError: fe } = require('./lib/errors');
    console.error((fe as (e: unknown) => string)(err));
    process.exit(1);
  });
}
