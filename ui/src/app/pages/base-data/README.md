# 基础数据模块

本模块包含质量管理系统的基础数据管理功能：

## 功能模块

### 1. 缺陷管理 (defects)
- 路径: `/default/base-data/defects`
- 功能:
  - 缺陷列表查询
  - 新增缺陷
  - 编辑缺陷
  - 删除缺陷
  - 启用/禁用缺陷

### 2. 物料管理 (materials)
- 路径: `/default/base-data/materials`
- 功能:
  - 物料列表查询
  - 新增物料
  - 编辑物料
  - 删除物料

### 3. 工序管理 (processes)
- 路径: `/default/base-data/processes`
- 功能:
  - 工序列表查询
  - 新增工序
  - 编辑工序
  - 删除工序

## 技术栈

- Angular 21+ (Standalone Components)
- NG-ZORRO (TQMS for Angular)
- RxJS

## API 配置

后端 API 地址通过代理配置，开发环境下代理到 `https://localhost:44312/`

## 使用说明

1. 确保后端服务正在运行在 https://localhost:44312/
2. 启动前端项目: `npm start`
3. 访问 http://localhost:4201/
4. 导航到基础数据模块: `/default/base-data/[defects|materials|processes]`
