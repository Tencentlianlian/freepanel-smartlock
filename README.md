# 门锁免开发面板

<img width=300 src=https://qcloudimg.tencent-cloud.cn/raw/308452a3b34c60ba34de7cac91352944.png />



如果您还不了解腾讯连连 h5 面板，可以查看[快速入门](https://cloud.tencent.com/document/product/1081/49027)及[开发指南](https://cloud.tencent.com/document/product/1081/49028)

#### whistle 配置

```shell
developing.script/developing.js https://127.0.0.1:9000/index.js
developing.style/developing.css https://127.0.0.1:9000/index.css
```
或者使用[免代理模式](https://cloud.tencent.com/document/product/1081/67441#proxy-free-mode)

### 开发

```shell
yarn

yarn dev --productId=productId --deviceName=deviceName

# 或者修改 package.json 中的 dev:p 命令对应的 productId 和 deviceName，然后直接执行 yarn dev:p
yarn dev:p

# 生产构建
yarn build
```

