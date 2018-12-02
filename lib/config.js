
const environments = {};

// Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort': 3001,
  'envName' : 'staging',
  'hashingSecret': 'ThisIsASecret',
  'stripe': {'api_key': 'sk_test_4eC39HqLyjWDarjtT1zdp7dc'},
  'mailgun': {
    'authName':'api',
    'authKey':'4eb597ab52696412819dbd127d850023-059e099e-47ad91d3',
    'domainName': 'sandbox4ad3570e8b094345a9a508f7b5557078',
    'dns': 'marek.pirple@sandbox123.mailgun.org'
   }
};

// Production environment
environments.production = {
    'httpPort' : 5000,
    'httpsPort': 5001,
    'envName' : 'production',
    'hashingSecret' : 'ThisIsAlsoASecret',
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging

const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;