# API 参考

geo-types-cz 提供了完整的 TypeScript GeoJSON 类型定义和实用工具函数。本文档详细介绍了所有可用的 API。

## 概览

### 核心模块

| 模块 | 描述 | 主要内容 |
|------|------|----------|
| [几何类型](/api/geometry) | GeoJSON 几何对象类型定义 | Point, LineString, Polygon 等 |
| [要素类型](/api/feature) | GeoJSON 要素类型定义 | Feature, FeatureCollection 等 |
| [边界框](/api/bbox) | 边界框类型和工具函数 | BBox, 边界框计算 |
| [扩展类型](/api/extensions) | GIS 应用扩展类型 | 样式, 图层, 查询等 |
| [工具函数](/api/utils) | 地理计算和实用工具 | 距离计算, 方位角, 面积等 |
| [服务函数](/api/service) | 地图服务/API | 获取一些常用的服务数据，如地址、距离、方向等。 |


## 快速导入

### 按需导入（推荐）

```typescript
// 几何类型
import { Point, LineString, Polygon } from 'geo-types-cz'

// 要素类型
import { Feature, FeatureCollection } from 'geo-types-cz'

// 工具函数
import { 
  createFeature, 
  calculateDistance, 
  calculateBearing 
} from 'geo-types-cz'

// 类型守卫
import { isPoint, isLineString, isPolygon } from 'geo-types-cz'

// 坐标系
import { CommonCRS } from 'geo-types-cz'
```

### 全量导入

```typescript
import * as GeoTypes from 'geo-types-cz'

// 使用
const point: GeoTypes.Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}
```

## 类型层次结构

```
GeoJSON
├── Geometry
│   ├── Point
│   ├── MultiPoint
│   ├── LineString
│   ├── MultiLineString
│   ├── Polygon
│   ├── MultiPolygon
│   └── GeometryCollection
├── Feature
└── FeatureCollection

扩展类型
├── Style
├── Layer
└── MapConfig
```

## 类型守卫函数

类型守卫函数帮助你在运行时安全地确定对象类型：

```typescript
import { 
  isGeometry,
  isPoint,
  isLineString,
  isPolygon,
  isFeature,
  isFeatureCollection
} from 'geo-types-cz'

function processGeoJSON(obj: any) {
  if (isFeature(obj)) {
    // obj 现在被识别为 Feature 类型
    console.log('要素属性:', obj.properties)
  } else if (isFeatureCollection(obj)) {
    // obj 现在被识别为 FeatureCollection 类型
    console.log('要素数量:', obj.features.length)
  } else if (isGeometry(obj)) {
    // obj 现在被识别为 Geometry 类型
    console.log('几何类型:', obj.type)
  }
}
```

## 工厂函数

便捷的工厂函数帮助你快速创建 GeoJSON 对象：

```typescript
import { 
  createFeature,
  createFeatureCollection,
  createVectorLayer
} from 'geo-types-cz'

// 创建要素
const feature = createFeature(
  { type: 'Point', coordinates: [116.3974, 39.9093] },
  { name: '天安门' }
)

// 创建要素集合
const collection = createFeatureCollection([feature])

// 创建矢量图层
const layer = createVectorLayer(
  'poi-layer',
  'POI图层',
  collection
)
```

## 计算函数

丰富的地理计算函数：

```typescript
import { 
  calculateDistance,
  calculateBearing,
  calculateDestination,
  calculatePolygonArea,
  calculateLineLength
} from 'geo-types-cz'

// 距离计算（米）
const distance = calculateDistance([116.3974, 39.9093], [121.4737, 31.2304])

// 方位角计算（度）
const bearing = calculateBearing([116.3974, 39.9093], [121.4737, 31.2304])

// 目标点计算
const destination = calculateDestination([116.3974, 39.9093], 1000, 90)

// 面积计算（平方米）
const area = calculatePolygonArea(polygon)

// 长度计算（米）
const length = calculateLineLength(lineString)
```

## 常用模式

### 1. 处理用户输入的 GeoJSON

```typescript
import { isFeatureCollection, isFeature } from 'geo-types-cz'

function handleGeoJSONUpload(data: any) {
  if (isFeatureCollection(data)) {
    data.features.forEach(feature => {
      // 处理每个要素
      console.log(feature.properties)
    })
  } else if (isFeature(data)) {
    // 处理单个要素
    console.log(data.properties)
  } else {
    throw new Error('无效的 GeoJSON 数据')
  }
}
```

### 2. 创建带样式的图层

```typescript
import { createVectorLayer, Style } from 'geo-types-cz'

const style: Style = {
  fill: { color: '#ff0000', opacity: 0.6 },
  stroke: { color: '#000000', width: 2 }
}

const layer = createVectorLayer(
  'my-layer',
  '我的图层',
  featureCollection,
  style
)
```


## 错误处理

```typescript
import { ValidationError } from 'geo-types-cz'

try {
  const feature = createFeature(invalidGeometry, properties)
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('验证错误:', error.message)
  }
}
```

## 性能提示

1. **按需导入**: 只导入你需要的类型和函数
2. **类型守卫**: 使用类型守卫函数而不是手动类型检查
3. **工厂函数**: 使用提供的工厂函数创建对象
4. **缓存计算**: 对于复杂的地理计算，考虑缓存结果

## 下一步

- 查看具体的 [几何类型 API](/api/geometry)
- 了解 [工具函数](/api/utils) 的详细用法
- 浏览 [示例代码](/examples/) 学习实际应用