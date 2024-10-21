import environment from './enviromentDev'

let config = {
  // All config value will be here
}

config = { ...config, ...environment }

export default config
