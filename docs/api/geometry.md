# 几何类型 API

几何类型是 GeoJSON 的核心组成部分，geo-types-cz 提供了完整的 TypeScript 类型定义和相关工具函数。

## 基础类型

### Position

表示地理坐标位置的基础类型。

```typescript
type Position = [number, number] | [number, number, number]
```

**说明:**
- 二维坐标: `[经度, 纬度]`
- 三维坐标: `[经度, 纬度, 高程]`
- 经度范围: -180 到 180
- 纬度范围: -90 到 90

**示例:**
```typescript
// 北京天安门
const beijing: Position = [116.3974, 39.9093]

// 带高程的坐标
const beijingWithElevation: Position = [116.3974, 39.9093, 43.5]
```

### GeometryType

几何类型枚举。

```typescript
enum GeometryType {
  Point = 'Point',
  MultiPoint = 'MultiPoint',
  LineString = 'LineString',
  MultiLineString = 'MultiLineString',
  Polygon = 'Polygon',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection'
}
```

## 点几何 (Point)

表示单个地理位置点。

```typescript
interface Point {
  type: 'Point'
  coordinates: Position
}
```

**示例:**
```typescript
import { Point } from 'geo-types-cz'

// 创建点几何
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}

// 带高程的点
const pointWithElevation: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093, 43.5]
}
```

**类型守卫:**
```typescript
import { isPoint } from 'geo-types-cz'

if (isPoint(geometry)) {
  // TypeScript 现在知道 geometry 是 Point 类型
  console.log('点坐标:', geometry.coordinates)
}
```

## 多点几何 (MultiPoint)

表示多个不相连的点。

```typescript
interface MultiPoint {
  type: 'MultiPoint'
  coordinates: Position[]
}
```

**示例:**
```typescript
import { MultiPoint } from 'geo-types-cz'

const multiPoint: MultiPoint = {
  type: 'MultiPoint',
  coordinates: [
    [116.3974, 39.9093], // 北京
    [121.4737, 31.2304], // 上海
    [113.2644, 23.1291]  // 广州
  ]
}
```

**类型守卫:**
```typescript
import { isMultiPoint } from 'geo-types-cz'

if (isMultiPoint(geometry)) {
  console.log('点的数量:', geometry.coordinates.length)
}
```

## 线几何 (LineString)

表示由两个或多个点连接形成的线。

```typescript
interface LineString {
  type: 'LineString'
  coordinates: Position[]
}
```

**要求:**
- 至少包含 2 个点
- 点按顺序连接形成线

**示例:**
```typescript
import { LineString } from 'geo-types-cz'

// 北京到上海的直线
const line: LineString = {
  type: 'LineString',
  coordinates: [
    [116.3974, 39.9093], // 北京
    [117.5, 38.5],       // 中间点
    [119.0, 35.0],       // 中间点
    [121.4737, 31.2304]  // 上海
  ]
}
```

**类型守卫:**
```typescript
import { isLineString } from 'geo-types-cz'

if (isLineString(geometry)) {
  console.log('线段点数:', geometry.coordinates.length)
}
```

## 多线几何 (MultiLineString)

表示多条不相连的线。

```typescript
interface MultiLineString {
  type: 'MultiLineString'
  coordinates: Position[][]
}
```

**示例:**
```typescript
import { MultiLineString } from 'geo-types-cz'

const multiLine: MultiLineString = {
  type: 'MultiLineString',
  coordinates: [
    // 第一条线：北京到天津
    [
      [116.3974, 39.9093],
      [117.2008, 39.0842]
    ],
    // 第二条线：上海到杭州
    [
      [121.4737, 31.2304],
      [120.1551, 30.2741]
    ]
  ]
}
```

**类型守卫:**
```typescript
import { isMultiLineString } from 'geo-types-cz'

if (isMultiLineString(geometry)) {
  console.log('线的数量:', geometry.coordinates.length)
}
```

## 多边形几何 (Polygon)

表示封闭的多边形区域。

```typescript
interface Polygon {
  type: 'Polygon'
  coordinates: Position[][]
}
```

**结构:**
- 第一个环是外环（边界）
- 后续环是内环（洞）
- 每个环必须是封闭的（首尾点相同）
- 外环按逆时针方向，内环按顺时针方向

**示例:**
```typescript
import { Polygon } from 'geo-types-cz'

// 简单矩形
const rectangle: Polygon = {
  type: 'Polygon',
  coordinates: [[
    [116.3, 39.9],
    [116.4, 39.9],
    [116.4, 40.0],
    [116.3, 40.0],
    [116.3, 39.9] // 封闭环
  ]]
}

// 带洞的多边形
const polygonWithHole: Polygon = {
  type: 'Polygon',
  coordinates: [
    // 外环
    [
      [116.3, 39.9],
      [116.5, 39.9],
      [116.5, 40.1],
      [116.3, 40.1],
      [116.3, 39.9]
    ],
    // 内环（洞）
    [
      [116.35, 39.95],
      [116.45, 39.95],
      [116.45, 40.05],
      [116.35, 40.05],
      [116.35, 39.95]
    ]
  ]
}
```

**类型守卫:**
```typescript
import { isPolygon } from 'geo-types-cz'

if (isPolygon(geometry)) {
  console.log('环的数量:', geometry.coordinates.length)
  console.log('是否有洞:', geometry.coordinates.length > 1)
}
```

## 多多边形几何 (MultiPolygon)

表示多个不相连的多边形。

```typescript
interface MultiPolygon {
  type: 'MultiPolygon'
  coordinates: Position[][][]
}
```

**示例:**
```typescript
import { MultiPolygon } from 'geo-types-cz'

const multiPolygon: MultiPolygon = {
  type: 'MultiPolygon',
  coordinates: [
    // 第一个多边形
    [[
      [116.3, 39.9],
      [116.4, 39.9],
      [116.4, 40.0],
      [116.3, 40.0],
      [116.3, 39.9]
    ]],
    // 第二个多边形
    [[
      [121.4, 31.2],
      [121.5, 31.2],
      [121.5, 31.3],
      [121.4, 31.3],
      [121.4, 31.2]
    ]]
  ]
}
```

**类型守卫:**
```typescript
import { isMultiPolygon } from 'geo-types-cz'

if (isMultiPolygon(geometry)) {
  console.log('多边形数量:', geometry.coordinates.length)
}
```

## 几何集合 (GeometryCollection)

包含多个不同类型几何对象的集合。

```typescript
interface GeometryCollection {
  type: 'GeometryCollection'
  geometries: Geometry[]
}
```

**示例:**
```typescript
import { GeometryCollection, Point, LineString } from 'geo-types-cz'

const collection: GeometryCollection = {
  type: 'GeometryCollection',
  geometries: [
    {
      type: 'Point',
      coordinates: [116.3974, 39.9093]
    },
    {
      type: 'LineString',
      coordinates: [
        [116.3974, 39.9093],
        [121.4737, 31.2304]
      ]
    }
  ]
}
```

**类型守卫:**
```typescript
import { isGeometryCollection } from 'geo-types-cz'

if (isGeometryCollection(geometry)) {
  console.log('包含几何数量:', geometry.geometries.length)
  geometry.geometries.forEach((geom, index) => {
    console.log(`几何 ${index}: ${geom.type}`)
  })
}
```

## 通用几何类型

### Geometry

所有几何类型的联合类型。

```typescript
type Geometry = 
  | Point 
  | MultiPoint 
  | LineString 
  | MultiLineString 
  | Polygon 
  | MultiPolygon 
  | GeometryCollection
```

**类型守卫:**
```typescript
import { isPoint, isLineString, isPolygon } from 'geo-types-cz'

function processGeometry(obj: any) {
  // 使用具体的类型守卫函数
  if (isPoint(obj)) {
    console.log('点几何:', obj.coordinates)
  } else if (isLineString(obj)) {
    console.log('线几何:', obj.coordinates.length, '个点')
  } else if (isPolygon(obj)) {
    console.log('面几何:', obj.coordinates.length, '个环')
  }
}
```

## 实用工具函数

### 几何验证

目前包中不包含坐标验证函数。可以手动实现基本验证：

```typescript
// 手动实现坐标验证
function validateCoordinates(coordinates: [number, number]): boolean {
  const [lng, lat] = coordinates
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90
}

// 验证坐标是否有效
const coords: [number, number] = [116.3974, 39.9093]
if (validateCoordinates(coords)) {
  console.log('坐标有效')
} else {
  console.error('坐标无效')
}
```

### 几何边界计算

目前包中包含`calculateGeometryBBox`函数用于计算边界框：

```typescript
import { calculateGeometryBBox } from 'geo-types-cz'

// 计算几何对象的边界框
const polygon = {
  type: 'Polygon' as const,
  coordinates: [[[116.3, 39.9], [116.4, 39.9], [116.4, 40.0], [116.3, 40.0], [116.3, 39.9]]]
}

const bounds = calculateGeometryBBox(polygon)
console.log('边界框:', bounds) // [minX, minY, maxX, maxY]
```

## 最佳实践

### 1. 坐标顺序

始终使用 `[经度, 纬度]` 的顺序：

```typescript
// ✅ 正确
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093] // [经度, 纬度]
}

// ❌ 错误
const point: Point = {
  type: 'Point',
  coordinates: [39.9093, 116.3974] // [纬度, 经度]
}
```

### 2. 多边形环的方向

```typescript
// ✅ 正确：外环逆时针，内环顺时针
const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [
    // 外环（逆时针）
    [[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]],
    // 内环（顺时针）
    [[0.2, 0.2], [0.2, 0.8], [0.8, 0.8], [0.8, 0.2], [0.2, 0.2]]
  ]
}
```

### 3. 使用类型守卫

```typescript
import { isPoint, isPolygon } from 'geo-types-cz'

function getGeometryInfo(geometry: Geometry): string {
  if (isPoint(geometry)) {
    return `点: ${geometry.coordinates.join(', ')}`
  } else if (isPolygon(geometry)) {
    return `多边形: ${geometry.coordinates.length} 个环`
  }
  return `其他几何类型: ${geometry.type}`
}
```

### 4. 性能考虑

对于大型几何对象，考虑使用简化算法：

```typescript
import { simplifyLineString } from 'geo-types-cz'

// 简化复杂线段
const simplified = simplifyLineString(complexLineString, 0.001)
```