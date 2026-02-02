# 工具函数 API

geo-types-cz 提供了丰富的地理计算和实用工具函数，帮助你轻松处理 GeoJSON 数据和进行地理分析。

## 距离计算

### calculateDistance

计算两个地理坐标点之间的距离。

```typescript
function calculateDistance(
  point1: Position, 
  point2: Position, 
  unit?: 'meters' | 'kilometers' | 'miles'
): number
```

**参数:**
- `point1`: 起始点坐标 `[经度, 纬度]`
- `point2`: 目标点坐标 `[经度, 纬度]`
- `unit`: 距离单位，默认为 `'meters'`

**返回值:**
- 两点间的距离（数值）

**示例:**
```typescript
import { calculateDistance } from 'geo-types-cz'

// 计算北京到上海的距离
const distance = calculateDistance(
  [116.3974, 39.9093], // 北京天安门
  [121.4737, 31.2304]  // 上海外滩
)

console.log(`距离: ${Math.round(distance / 1000)}公里`)
// 输出: 距离: 1068公里

// 指定单位
const distanceInKm = calculateDistance(
  [116.3974, 39.9093],
  [121.4737, 31.2304],
  'kilometers'
)
console.log(`距离: ${distanceInKm.toFixed(1)}公里`)

// 英里单位
const distanceInMiles = calculateDistance(
  [116.3974, 39.9093],
  [121.4737, 31.2304],
  'miles'
)
console.log(`距离: ${distanceInMiles.toFixed(1)}英里`)
```

**算法说明:**
使用 Haversine 公式计算球面距离，适用于大多数地理应用场景。

## 方位角计算

### calculateBearing

计算从起始点到目标点的方位角。

```typescript
function calculateBearing(
  point1: Position, 
  point2: Position
): number
```

**参数:**
- `point1`: 起始点坐标
- `point2`: 目标点坐标

**返回值:**
- 方位角（度），范围 0-360°，0° 表示正北方向

**示例:**
```typescript
import { calculateBearing } from 'geo-types-cz'

// 计算北京到上海的方位角
const bearing = calculateBearing(
  [116.3974, 39.9093], // 北京
  [121.4737, 31.2304]  // 上海
)

console.log(`方位角: ${bearing.toFixed(1)}°`)
// 输出: 方位角: 123.4°（东南方向）

// 方位角含义
function getBearingDirection(bearing: number): string {
  if (bearing >= 337.5 || bearing < 22.5) return '北'
  if (bearing >= 22.5 && bearing < 67.5) return '东北'
  if (bearing >= 67.5 && bearing < 112.5) return '东'
  if (bearing >= 112.5 && bearing < 157.5) return '东南'
  if (bearing >= 157.5 && bearing < 202.5) return '南'
  if (bearing >= 202.5 && bearing < 247.5) return '西南'
  if (bearing >= 247.5 && bearing < 292.5) return '西'
  return '西北'
}

console.log(`方向: ${getBearingDirection(bearing)}`)
```

## 目标点计算

### calculateDestination

根据起始点、距离和方位角计算目标点坐标。

```typescript
function calculateDestination(
  point: Position, 
  distance: number, 
  bearing: number,
  unit?: 'meters' | 'kilometers' | 'miles'
): Position
```

**参数:**
- `point`: 起始点坐标
- `distance`: 距离
- `bearing`: 方位角（度）
- `unit`: 距离单位，默认为 `'meters'`

**返回值:**
- 目标点坐标 `[经度, 纬度]`

**示例:**
```typescript
import { calculateDestination } from 'geo-types-cz'

// 从天安门出发，向东走1公里
const destination = calculateDestination(
  [116.3974, 39.9093], // 天安门
  1000,                 // 1000米
  90                    // 正东方向
)

console.log(`目标点: [${destination[0].toFixed(6)}, ${destination[1].toFixed(6)}]`)

// 使用不同单位
const destination2 = calculateDestination(
  [116.3974, 39.9093],
  10,    // 10公里
  45,    // 东北方向
  'kilometers'
)

// 创建一个圆形路径
function createCircle(center: Position, radius: number, points: number = 36): Position[] {
  const circle: Position[] = []
  for (let i = 0; i < points; i++) {
    const bearing = (360 / points) * i
    const point = calculateDestination(center, radius, bearing)
    circle.push(point)
  }
  circle.push(circle[0]) // 闭合圆形
  return circle
}

const circlePoints = createCircle([116.3974, 39.9093], 1000) // 1公里半径的圆
```

## 面积计算

### calculatePolygonArea

计算多边形的面积。

```typescript
function calculatePolygonArea(polygon: Polygon): number
```

**参数:**
- `polygon`: 多边形几何对象

**返回值:**
- 多边形面积（平方米）

**示例:**
```typescript
import { calculatePolygonArea, Polygon } from 'geo-types-cz'

// 创建一个矩形多边形
const rectangle: Polygon = {
  type: 'Polygon',
  coordinates: [[
    [116.3, 39.9],
    [116.4, 39.9],
    [116.4, 40.0],
    [116.3, 40.0],
    [116.3, 39.9]
  ]]
}

// 计算面积
const areaInSqM = calculatePolygonArea(rectangle)
console.log(`面积: ${areaInSqM.toFixed(0)} 平方米`)

// 转换为不同单位
const areaInSqKm = areaInSqM / 1000000
console.log(`面积: ${areaInSqKm.toFixed(2)} 平方公里`)

const areaInHectares = areaInSqM / 10000
console.log(`面积: ${areaInHectares.toFixed(2)} 公顷`)

// 计算带洞多边形的面积
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

const netArea = calculatePolygonArea(polygonWithHole)
console.log(`净面积: ${netArea.toFixed(0)} 平方米`)
```

### calculatePolygonCentroid 

计算多边形的中心点（质心）。

```typescript
function calculatePolygonCentroid (coordinates: Position[][]): Position
```

**参数:**
- `coordinates`: 多边形坐标数组，格式为 `[[[lon, lat], [lon, lat], ...]]`

**返回值:**
- 中心点坐标 `[lon, lat]`

**示例:**
```typescript
import { calculatePolygonCentroid  } from 'geo-types-cz'

const polygonCoords = [[
  [116.3, 39.9],
  [116.5, 39.9],
  [116.5, 40.1],
  [116.3, 40.1],
  [116.3, 39.9]
]]

const centroid = calculatePolygonCentroid (polygonCoords)
console.log('中心点:', centroid)
// 输出: [116.4, 40.0]
```

## 长度计算

### calculateLineLength

计算线几何的长度。

```typescript
function calculateLineLength(lineString: LineString): number
```

**参数:**
- `lineString`: 线几何对象

**返回值:**
- 线的总长度（米）

**示例:**
```typescript
import { calculateLineLength, LineString } from 'geo-types-cz'

// 创建一条从北京到上海的路径
const route: LineString = {
  type: 'LineString',
  coordinates: [
    [116.3974, 39.9093], // 北京
    [117.5, 38.5],       // 途经点1
    [119.0, 35.0],       // 途经点2
    [121.4737, 31.2304]  // 上海
  ]
}

// 计算路径长度
const lengthInM = calculateLineLength(route)
console.log(`路径长度: ${Math.round(lengthInM / 1000)} 公里`)

// 转换为不同单位
const lengthInKm = lengthInM / 1000
console.log(`路径长度: ${lengthInKm.toFixed(1)} 公里`)

// 计算多线的总长度
const multiRoute: MultiLineString = {
  type: 'MultiLineString',
  coordinates: [
    [[116.3974, 39.9093], [117.2008, 39.0842]], // 北京-天津
    [[121.4737, 31.2304], [120.1551, 30.2741]]  // 上海-杭州
  ]
}

// 需要分别计算每条线的长度
let totalLength = 0
multiRoute.coordinates.forEach(coords => {
  const line: LineString = { type: 'LineString', coordinates: coords }
  totalLength += calculateLineLength(line)
})
console.log(`总长度: ${(totalLength / 1000).toFixed(1)} 公里`)
```

## 边界框计算

### calculateGeometryBBox

计算几何对象的边界框。

```typescript
function calculateGeometryBBox(geometry: Geometry): BBox
```

**参数:**
- `geometry`: 任意几何对象

**返回值:**
- 边界框 `[minX, minY, maxX, maxY]`

**示例:**
```typescript
import { calculateGeometryBBox, LineString } from 'geo-types-cz'

const line: LineString = {
  type: 'LineString',
  coordinates: [
    [116.3974, 39.9093],
    [121.4737, 31.2304],
    [113.2644, 23.1291]
  ]
}

const bounds = calculateGeometryBBox(line)
console.log('边界框:', bounds)
// 输出: [113.2644, 23.1291, 121.4737, 39.9093]

// 使用边界框创建包围矩形
function boundsToPolygon(bounds: BBox): Polygon {
  const [minX, minY, maxX, maxY] = bounds
  return {
    type: 'Polygon',
    coordinates: [[
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY]
    ]]
  }
}

const boundingBox = boundsToPolygon(bounds)
```

## 缓冲区计算

### createBuffer

为点创建一个简单的矩形缓冲区。

```typescript
function createBuffer(geometry: Point, distance: number): Polygon
```

**参数:**
- `geometry`: 点几何对象
- `distance`: 缓冲区半径（米）

**返回值:**
- 缓冲区多边形

**示例:**
```typescript
import { createBuffer, Point } from 'geo-types-cz'

const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}

const buffer = createBuffer(point, 1000) // 1公里缓冲区
console.log('缓冲区:', buffer)
```

## 几何简化

### simplifyLineString

简化复杂的几何对象，减少点的数量。

```typescript
function simplifyLineString(
  lineString: LineString,
  tolerance: number
): LineString
```

**参数:**
- `lineString`: 要简化的线
- `tolerance`: 简化容差（度）

**返回值:**
- 简化后的线几何对象

**示例:**
```typescript
import { simplifyLineString, LineString } from 'geo-types-cz'

// 复杂的线
const complexLine: LineString = {
  type: 'LineString',
  coordinates: [
    [116.3974, 39.9093],
    [116.3975, 39.9094],
    [116.3976, 39.9095],
    [116.3980, 39.9100],
    [116.4000, 39.9120],
    [121.4737, 31.2304]
  ]
}

// 简化线（容差 0.001 度）
const simplifiedLine = simplifyLineString(complexLine, 0.001)
console.log('原始点数:', complexLine.coordinates.length)
console.log('简化后点数:', simplifiedLine.coordinates.length)
```

## 空间关系判断

### isPointInPolygon

判断点是否在多边形内/外/边界上。

```typescript
import { isPointInPolygon } from 'geo-types-cz'

// 使用示例
const polygon: Polygon = {
  type: 'Polygon',
  coordinates: [[
    [116.3, 39.9],
    [116.5, 39.9],
    [116.5, 40.1],
    [116.3, 40.1],
    [116.3, 39.9]
  ]]
}

const testPoint: Position = [116.4, 40.0]
const isInside = isPointInPolygon(testPoint, polygon.coordinates)
console.log('点是否在多边形内:', isInside)
```

### calcCirclePolygon

根据中心点和半径创建圆形多边形。

```typescript
function calcCirclePolygon(
  center: Position, 
  radius: number, 
  steps: number = 64
): Polygon
```

**参数:**
- `center`: 中心点坐标 `[lon, lat]`
- `radius`: 半径（米）
- `steps`: 圆的段数，默认为 64，数值越大越平滑

**返回值:**
- 圆形多边形几何对象

**示例:**
```typescript
import { calcCirclePolygon } from 'geo-types-cz'

// 创建一个半径为 500 米的圆，中心在天安门
const circle = calcCirclePolygon(
  [116.3974, 39.9093], 
  500
)

console.log('圆多边形:', circle)
```

## 其他工具

### calculateFeatureCollectionBBox

计算要素集合的边界框。

```typescript
function calculateFeatureCollectionBBox(featureCollection: FeatureCollection): BBox
```

**参数:**
- `featureCollection`: 要素集合对象

**返回值:**
- 边界框 `[minX, minY, maxX, maxY]`

## 性能优化建议

### 1. 批量计算

对于大量计算，考虑批量处理：

```typescript
function calculateDistances(
  points: Position[],
  reference: Position
): number[] {
  return points.map(point => calculateDistance(reference, point))
}
```

### 2. 缓存结果

对于复杂计算，考虑缓存结果：

```typescript
const distanceCache = new Map<string, number>()

function cachedDistance(p1: Position, p2: Position): number {
  const key = `${p1.join(',')}-${p2.join(',')}`
  if (!distanceCache.has(key)) {
    distanceCache.set(key, calculateDistance(p1, p2))
  }
  return distanceCache.get(key)!
}
```

### 3. 简化几何

对于显示目的，简化复杂几何：

```typescript
// 根据缩放级别动态简化
function getSimplifiedGeometry(geometry: Geometry, zoomLevel: number): Geometry {
  const tolerance = Math.pow(2, 10 - zoomLevel) * 0.0001
  // 注意：simplifyLineString 函数需要根据实际可用的函数进行调整
  return geometry
}
```