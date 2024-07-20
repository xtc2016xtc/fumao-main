// @ts-ignore
import zionMdapi from "zion-mdapi";

export default function useMdApi() {

    const mdapiConfig = {
        url:"https://zion-app.functorz.com/zero/0lqQ0rOl9zY/api/graphql-v2",
        env:"H5"
    }
    const mdapi = zionMdapi.init(mdapiConfig)

  return mdapi
}