/**
 * @module providers/feishu
 */

export default function Feishu(config: any): any {
    const apiUserUrl = 'https://open.feishu.cn/open-apis/authen/v1/user_info';
    const apiAUthUrl = 'https://open.feishu.cn/open-apis/authen/v1/authorize';
  
    // 开发环境
    const devBaseUrl = process.env.NEXTAUTH_URL;
  
    // 生产环境
    const prodBaseUrl = process.env.NEXTAUTH_URL_PRO;
  
    const baseUrl = process.env.NODE_ENV === 'development' ? devBaseUrl : prodBaseUrl;
  
    return {
      id: 'feishu',
      name: 'feishu',
      type: 'oauth',
      authorization: {
        url: apiAUthUrl,
        params: {
          scope: '',
          app_id: config.clientId,
          redirect_uri: encodeURI(
            `${baseUrl}/api/auth/callback/feishu`
          ),
          state: 'RANDOMSTATE',
        },
      },
      token: {
        url: `${baseUrl}/api/feishu/token`,
      },
      userinfo: {
        url: apiUserUrl,
        async request({ tokens, provider }: any) {
          // 拿到上一步获取到的token，调用飞书获取用户信息的接口，获取用户信息
          const profile = await fetch(provider.userinfo?.url as URL, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              'User-Agent': 'authjs',
            },
          }).then(async (res) => await res.json());
  
          return profile.data;
        },
      },
      profile(profile: any) {
        // 选择想要的参数设置的session里 
        return {
          id: profile.open_id.toString(),
          name: profile.name ?? profile.login,
          image: profile.avatar_thumb,
        };
      },
      options: config,
    };
  }
  