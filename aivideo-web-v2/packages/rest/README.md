## 生成schema
```
pnpm generate
```

## 使用

```
import { getApiClient } from '@aivideo/rest';
const apiClient = getApiClient();
apiClient.GET("/api/alarm/v2/datapoints/").then(r=>{
  console.log(r);
})
```