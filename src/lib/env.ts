const environment = process.env.SITE_ENV;
export const isProductionBuild = environment
  ? environment === "production"
  : process.env.WORKERS_CI_BRANCH === "main";
