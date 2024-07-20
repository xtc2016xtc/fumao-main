// src/app/api/feishu/token/route.ts

export async function POST(request: Request) {
    // 获取body请求参数
    const formData = await request.formData();
  
    // 获取授权码
    const code = formData.get('code');
  
    // 构造获取app_access_token的请求body
    const body = {
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET,
    };
  
    // 获取app_access_token的请求url
    const app_access_token_url = 'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal';
  
    // 获取app_access_token
    const result = await fetch(app_access_token_url,
      {
        body: JSON.stringify(body),
        method: 'POST'
      }
    ).then((res) => res.json());
  
    // 从结果中取出app_access_token
    const app_access_token = result['app_access_token'];
  
    // 构造获取access_token的请求body
  
    const access_token_body = {
      grant_type: 'authorization_code',
      code,
    };
  
    // 请求获取access_token的url
    const access_token_url = 'https://open.feishu.cn/open-apis/authen/v1/oidc/access_token';
  
    const access_token_result = await fetch(access_token_url, {
      headers: {
        Authorization: `Bearer ${app_access_token}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(access_token_body),
      method: 'POST',
    })
      .then((res) => res.json())
      .catch((error) => {
        console.log(error, 'error');
      });
  
  
    // 返回access_token
    return Response.json(access_token_result.data);
  }
  