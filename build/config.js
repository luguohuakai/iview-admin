import Env from './env';

let apis_prefix = Env === 'production' ? 'https://api.srun.com/' : 'http://106.14.7.51/';

let config = {
    env: Env,
    api: apis_prefix
};
export default config;
