# 抽样方案配置 JSON 格式说明

## 概述

检验标准中的 `SamplingSchemeConfig` 字段使用 JSON 格式存储抽样方案的详细配置。本文档说明各种抽样类型的 JSON 格式。

## 通用结构

所有抽样方案配置都包含以下通用字段：

```json
{
  "schemeType": 1
}
```

- `schemeType`: 抽样类型
  - 1 = AQL抽样
  - 2 = C=0抽样
  - 3 = 计量抽样
  - 4 = 连续抽样
  - 5 = 跳批抽样

## 1. AQL抽样 (schemeType = 1)

### 配置格式

```json
{
  "schemeType": 1,
  "aqlConfig": {
    "aqlConfigId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "inspectionLevel": 6,
    "aqlValue": 0.65
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| aqlConfigId | string | 否 | AQL配置表的ID，关联到 AppAqlConfigs 表 |
| inspectionLevel | number | 否 | 检验水平 (1=S-1, 2=S-2, 3=S-3, 4=S-4, 5=I, 6=II, 7=III) |
| aqlValue | number | 否 | AQL值，如 0.01, 0.02, 0.04, 0.065, 0.1, 0.15, 0.25, 0.4, 0.65, 1.0, 1.5, 2.5, 4.0, 6.5, 10, 15, 25, 40 |

### 使用建议

- 推荐优先使用 `aqlConfigId` 关联已配置的AQL配置
- 如果需要灵活配置，可以直接指定 `inspectionLevel` 和 `aqlValue`

---

## 2. C=0抽样 (schemeType = 2)

### 配置格式

```json
{
  "schemeType": 2,
  "cZeroConfig": {
    "fixedSampleSize": 20,
    "acceptanceNumber": 0,
    "rejectionNumber": 1
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| fixedSampleSize | number | 否 | 固定样本量 |
| acceptanceNumber | number | 否 | 接收数(Ac)，C=0抽样通常设为0 |
| rejectionNumber | number | 否 | 拒收数(Re)，C=0抽样通常设为1 |

---

## 3. 计量抽样 (schemeType = 3)

### 配置格式

```json
{
  "schemeType": 3,
  "variableConfig": {
    "sampleSize": 50,
    "kValue": 2.0,
    "sigmaKnown": true
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| sampleSize | number | 否 | 样本量 |
| kValue | number | 否 | K值（接收常数） |
| sigmaKnown | boolean | 否 | σ是否已知（true=已知，false=未知） |

---

## 4. 连续抽样 (schemeType = 4)

### 配置格式

```json
{
  "schemeType": 4,
  "continuousConfig": {
    "iQualityLevel": 2,
    "samplePercentage": 10,
    "fFrequency": 5
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| iQualityLevel | number | 否 | 质量水平(i) |
| samplePercentage | number | 否 | 抽样百分比(%) |
| fFrequency | number | 否 | 频率(f) |

---

## 5. 跳批抽样 (schemeType = 5)

### 配置格式

```json
{
  "schemeType": 5,
  "skipLotConfig": {
    "skipLotNumber": 4,
    "iQualityLevel": 2,
    "lotSize": 1000
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| skipLotNumber | number | 否 | 跳批数 |
| iQualityLevel | number | 否 | 质量水平(i) |
| lotSize | number | 否 | 批量 |

---

## 完整示例

### 示例1: AQL抽样（使用AQL配置ID）

```json
{
  "schemeType": 1,
  "aqlConfig": {
    "aqlConfigId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
}
```

### 示例2: AQL抽样（直接配置参数）

```json
{
  "schemeType": 1,
  "aqlConfig": {
    "inspectionLevel": 6,
    "aqlValue": 0.65
  }
}
```

### 示例3: C=0抽样

```json
{
  "schemeType": 2,
  "cZeroConfig": {
    "fixedSampleSize": 25,
    "acceptanceNumber": 0,
    "rejectionNumber": 1
  }
}
```

### 示例4: 计量抽样

```json
{
  "schemeType": 3,
  "variableConfig": {
    "sampleSize": 30,
    "kValue": 1.5,
    "sigmaKnown": false
  }
}
```

---

## 前端图形配置组件

项目提供了 `SamplingSchemeConfigComponent` 组件，可以通过图形化界面配置抽样方案，并自动生成上述JSON格式。

### 使用方式

```html
<app-sampling-scheme-config 
  [config]="existingConfigJson"
  (configChange)="onConfigChange($event)">
</app-sampling-scheme-config>
```

### 组件功能

1. **抽样类型选择**: 下拉选择5种抽样类型
2. **动态表单**: 根据选择的抽样类型显示对应的配置字段
3. **JSON自动生成**: 配置变更时自动生成JSON字符串
4. **JSON解析**: 可以从已有JSON字符串恢复配置
5. **AQL配置选择**: 支持从已有的AQL配置中选择
