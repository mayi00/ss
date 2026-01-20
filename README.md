## 环境准备

> node >=20.19.0 || >=22.12.0
>
> pnpm >= 9.15.4

## 项目启动

```bash
# 安装 pnpm
npm install pnpm -g

# 设置镜像源
pnpm config set registry https://registry.npmmirror.com

# 安装依赖
pnpm install

# 启动服务
pnpm dev

# 本地开发访问地址
http://localhost:920
```

## 项目构建

```bash
# 测试环境打包
pnpm build:test

# 生产环境打包
pnpm build:prod
```

## 项目地址

[Gitee 源码](https://gitee.com/madt/ss)

[GitHub 源码](https://github.com/mayi00/ss)

[在线预览](https://mayi00.github.io/ss)
