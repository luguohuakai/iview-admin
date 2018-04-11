import env from './env';

let apis_prefix = env === 'production'
    ? 'https://api.srun.com/' // 正式环境
    : 'http://106.14.7.51/'; // 测试环境

let config = {
    env: env,
    api: apis_prefix
};
export default config;
