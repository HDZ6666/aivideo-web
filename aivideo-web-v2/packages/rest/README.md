## 生成schema
```
pnpm generate
```

## 请求库[openapi-fetch](https://openapi-ts.dev/openapi-fetch/h)

## 使用示例
- GET
```
import { getApiClient } from '@aivideo/rest';
const apiClient = getApiClient();
apiClient.GET("/api/alarm/v2/datapoints/").then(r=>{
  console.log(r);
})
```
- POST
```
import { getApiClient } from '@aivideo/rest';
const apiClient = getApiClient();

const {
  data, // only present if 2XX response
  error, // only present if 4XX or 5XX response
} = await client.GET("/blogposts/{post_id}", {
  params: {
    path: { post_id: "123" },
  },
});

await client.POST("/blogposts", {
  body: {
    title: "My New Post",
  },
});
```