/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
 
var devenv=(process.env.NODE_ENV==='development')?'-DEVELOPMENT':'';
var debuglevel=(devenv.length>2)?'trace':'info';
exports.config = {
  /**
   * Array of application names.
   */
  app_name : ['EducationalAggregator'+devenv+''],
  /**
   * Your New Relic license key.
   */
  license_key : '22bdf73b93dbbcb1eb263c23cb1a60df03bb480f',
  logging : {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level : debuglevel
  }
};
