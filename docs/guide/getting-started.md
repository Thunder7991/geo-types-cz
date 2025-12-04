# 快速开始

欢迎使用 geo-types-cz！这个指南将帮助你快速上手这个 TypeScript GeoJSON 类型定义包。

## 安装

使用你喜欢的包管理器安装：

::: code-group

```bash [npm]
npm install geo-types-cz
```

```bash [yarn]
yarn add geo-types-cz
```

```bash [pnpm]
pnpm add geo-types-cz
```

:::

## 第一个示例

让我们从一个简单的例子开始：

```typescript
import { Point, Feature, createFeature } from 'geo-types-cz'

// 创建一个点几何
const beijingPoint: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093] // 经度, 纬度
}

// 创建一个要素
const beijingFeature = createFeature(beijingPoint, {
  name: '天安门',
  city: '北京',
  country: '中国'
})

console.log(beijingFeature)
```

## 基础概念

### 几何类型 (Geometry)

geo-types-cz 支持所有标准的 GeoJSON 几何类型：

```typescript
import { Point, LineString, Polygon } from 'geo-types-cz'

// 点
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}

// 线
const line: LineString = {
  type: 'LineString',
  coordinates: [
    [116.3974, 39.9093],
    [121.4737, 31.2304]
  ]
}

// 多边形
const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [[
    [116.3, 39.9],
    [116.4, 39.9],
    [116.4, 40.0],
    [116.3, 40.0],
    [116.3, 39.9]
  ]]
}
```

### 要素类型 (Feature)

要素是几何对象与属性数据的组合：

```typescript
import { Feature, createFeature } from 'geo-types-cz'

// 手动创建要素
const feature: Feature = {
  type: 'Feature',
  geometry: point,
  properties: {
    name: '天安门',
    type: '景点'
  }
}

// 使用工具函数创建要素
const feature2 = createFeature(point, {
  name: '天安门',
  type: '景点'
})
```

### 要素集合 (FeatureCollection)

```typescript
import { FeatureCollection, createFeatureCollection } from 'geo-types-cz'

const featureCollection = createFeatureCollection([
  beijingFeature,
  shanghaiFeature
])
```

## 类型守卫

使用类型守卫函数来安全地处理不同类型的几何对象：

```typescript
import { Geometry, isPoint, isLineString, isPolygon } from 'geo-types-cz'

function processGeometry(geometry: Geometry) {
  if (isPoint(geometry)) {
    // TypeScript 现在知道 geometry 是 Point 类型
    console.log('点坐标:', geometry.coordinates)
  } else if (isLineString(geometry)) {
    // TypeScript 现在知道 geometry 是 LineString 类型
    console.log('线段点数:', geometry.coordinates.length)
  } else if (isPolygon(geometry)) {
    // TypeScript 现在知道 geometry 是 Polygon 类型
    console.log('多边形环数:', geometry.coordinates.length)
  }
}
```

## 地理计算

geo-types-cz 提供了丰富的地理计算工具：

```typescript
import { 
  calculateDistance, 
  calculateBearing, 
  calculateDestination 
} from 'geo-types-cz'

// 计算两点间距离（米）
const distance = calculateDistance(
  [116.3974, 39.9093], // 北京
  [121.4737, 31.2304]  // 上海
)
console.log(`北京到上海: ${Math.round(distance / 1000)}公里`)

// 计算方位角（度）
const bearing = calculateBearing(
  [116.3974, 39.9093],
  [121.4737, 31.2304]
)
console.log(`方位角: ${bearing.toFixed(1)}度`)

// 根据起点、距离和方位角计算终点
const destination = calculateDestination(
  [116.3974, 39.9093], // 起点
  1000,                 // 距离（米）
  90                    // 方位角（正东）
)
console.log('目标点:', destination)
```

## 样式和图层

对于前端地图应用，你可以使用扩展的样式和图层类型：

```typescript
import { Style, createVectorLayer } from 'geo-types-cz'

// 定义样式
const style: Style = {
  fill: {
    color: '#ff0000',
    opacity: 0.6
  },
  stroke: {
    color: '#000000',
    width: 2
  },
  marker: {
    size: 10,
    color: '#0066cc',
    symbol: 'circle'
  }
}

// 创建矢量图层
const layer = createVectorLayer(
  'poi-layer',
  'POI图层',
  featureCollection,
  style
)
```


## 下一步

现在你已经了解了基础用法，可以：

- 查看 [API 文档](/api/) 了解所有可用的类型和函数
- 浏览 [示例](/examples/) 学习更多实际应用场景
- 阅读 [基础概念](/guide/concepts) 深入理解 GIS 相关概念

## 需要帮助？

如果你遇到问题或有建议，欢迎：

- 查看 [GitHub Issues](https://github.com/Thunder7991/geo-types-cz/issues)
- 阅读完整的 [API 文档](/api/)