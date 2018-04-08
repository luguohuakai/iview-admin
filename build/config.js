import Env from './env';

console.error(Env);

let apis_prefix = Env === 'production' ? 'https://api.srun.com/' : 'http://106.14.7.51/';

console.error(apis_prefix);
let config = {
    env: Env,
    api: apis_prefix
};
export default config;
