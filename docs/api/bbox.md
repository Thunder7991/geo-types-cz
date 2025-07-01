# 边界框 API

边界框 (BBox - Bounding Box) 是描述地理要素空间范围的矩形区域。geo-types-cz 提供了完整的边界框类型定义和相关工具函数。

## 基础类型

### BBox

边界框的基础类型定义。

```typescript
type BBox = [number, number, number, number] | [number, number, number, number, number, number]
```

**格式说明:**
- 二维边界框: `[minX, minY, maxX, maxY]`
- 三维边界框: `[minX, minY, minZ, maxX, maxY, maxZ]`
- 坐标顺序: `[最小经度, 最小纬度, 最大经度, 最大纬度]`

**示例:**
```typescript
import { BBox } from 'geo-types-cz'

// 北京市边界框
const beijingBBox: BBox = [115.7, 39.4, 117.4, 41.6]

// 上海市边界框
const shanghaiBBox: BBox = [120.9, 30.7, 122.2, 31.9]

// 三维边界框（包含高程）
const bbox3D: BBox = [115.7, 39.4, 0, 117.4, 41.6, 100]
```

### BBox2D 和 BBox3D

更具体的二维和三维边界框类型。

```typescript
type BBox2D = [number, number, number, number]
type BBox3D = [number, number, number, number, number, number]
```

**示例:**
```typescript
import { BBox2D, BBox3D } from 'geo-types-cz'

// 二维边界框
const bbox2D: BBox2D = [116.3, 39.9, 116.5, 40.1]

// 三维边界框
const bbox3D: BBox3D = [116.3, 39.9, 0, 116.5, 40.1, 50]
```

## 边界框创建

### createBBox

创建边界框的工厂函数。

```typescript
function createBBox(
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  minZ?: number,
  maxZ?: number
): BBox
```

**参数:**
- `minX`: 最小 X 坐标（经度）
- `minY`: 最小 Y 坐标（纬度）
- `maxX`: 最大 X 坐标（经度）
- `maxY`: 最大 Y 坐标（纬度）
- `minZ`: 可选的最小 Z 坐标（高程）
- `maxZ`: 可选的最大 Z 坐标（高程）

**示例:**
```typescript
import { createBBox2D, createBBox3D } from 'geo-types-cz'

// 创建二维边界框
const bbox2D = createBBox2D(116.3, 39.9, 116.5, 40.1)
console.log(bbox2D) // [116.3, 39.9, 116.5, 40.1]

// 创建三维边界框
const bbox3D = createBBox3D(116.3, 39.9, 0, 116.5, 40.1, 100)
console.log(bbox3D) // [116.3, 39.9, 0, 116.5, 40.1, 100]
```

### 从几何对象创建边界框

使用几何边界框计算函数：

```typescript
import { calculateGeometryBBox, Point, LineString, Polygon } from 'geo-types-cz'

// 从点几何创建边界框
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}
const pointBBox = calculateGeometryBBox(point)
console.log(pointBBox) // [116.3974, 39.9093, 116.3974, 39.9093]

// 从线几何创建边界框
const line: LineString = {
  type: 'LineString',
  coordinates: [
    [116.3974, 39.9093],
    [116.4074, 39.9193],
    [116.4174, 39.9293]
  ]
}
const lineBBox = calculateGeometryBBox(line)
console.log(lineBBox) // [116.3974, 39.9093, 116.4174, 39.9293]

// 从多边形创建边界框
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
const polygonBBox = calculateGeometryBBox(polygon)
console.log(polygonBBox) // [116.3, 39.9, 116.5, 40.1]
```

## 边界框操作

### 边界框属性获取

使用可用的边界框工具函数：

```typescript
import { getBBoxCenter } from 'geo-types-cz'

const bbox: BBox = [116.3, 39.9, 116.5, 40.1]

// 获取边界框中心点
const center = getBBoxCenter(bbox)
console.log('中心点:', center) // [116.4, 40.0]

// 手动获取边界框属性
const [minX, minY, maxX, maxY] = bbox
console.log('最小经度:', minX) // 116.3
console.log('最小纬度:', minY) // 39.9
console.log('最大经度:', maxX) // 116.5
console.log('最大纬度:', maxY) // 40.1

// 计算宽度和高度
const width = maxX - minX
const height = maxY - minY
console.log('宽度:', width)   // 0.2 (度)
console.log('高度:', height)  // 0.2 (度)
```

## 边界框关系判断

使用可用的边界框工具函数：

```typescript
import { isPositionInBBox, unionBBox } from 'geo-types-cz'

const bbox: BBox = [116.0, 39.5, 117.0, 40.5]
const point: Position = [116.4, 40.0]

// 判断点是否在边界框内
console.log('点在边界框内:', isPositionInBBox(point, bbox)) // true

// 计算多个边界框的并集
const bbox1: BBox = [116.0, 39.5, 116.8, 40.3]
const bbox2: BBox = [116.5, 39.8, 117.2, 40.6]
const unionResult = unionBBox(bbox1, bbox2)
console.log('边界框并集:', unionResult) // [116.0, 39.5, 117.2, 40.6]

// 手动判断边界框相交
function bboxIntersects(bbox1: BBox, bbox2: BBox): boolean {
  const [minX1, minY1, maxX1, maxY1] = bbox1
  const [minX2, minY2, maxX2, maxY2] = bbox2
  
  return !(maxX1 < minX2 || maxX2 < minX1 || maxY1 < minY2 || maxY2 < minY1)
}

console.log('边界框相交:', bboxIntersects(bbox1, bbox2)) // true
```

## 边界框运算

使用可用的边界框运算函数：

```typescript
import { unionBBox, bboxToObject, objectToBBox } from 'geo-types-cz'

const bbox1: BBox = [116.0, 39.5, 116.8, 40.3]
const bbox2: BBox = [116.5, 39.8, 117.2, 40.6]

// 计算两个边界框的并集
const unionResult = unionBBox(bbox1, bbox2)
console.log('并集:', unionResult) // [116.0, 39.5, 117.2, 40.6]

// 边界框对象转换
const bboxObj = bboxToObject(bbox1)
console.log('边界框对象:', bboxObj)
// { minX: 116.0, minY: 39.5, maxX: 116.8, maxY: 40.3 }

const bboxArray = objectToBBox(bboxObj)
console.log('转换回数组:', bboxArray) // [116.0, 39.5, 116.8, 40.3]

// 手动计算边界框交集
function calculateIntersection(bbox1: BBox, bbox2: BBox): BBox | null {
  const [minX1, minY1, maxX1, maxY1] = bbox1
  const [minX2, minY2, maxX2, maxY2] = bbox2
  
  const minX = Math.max(minX1, minX2)
  const minY = Math.max(minY1, minY2)
  const maxX = Math.min(maxX1, maxX2)
  const maxY = Math.min(maxY1, maxY2)
  
  if (minX >= maxX || minY >= maxY) {
    return null // 无交集
  }
  
  return [minX, minY, maxX, maxY]
}

const intersection = calculateIntersection(bbox1, bbox2)
console.log('交集:', intersection)
```

## 边界框转换

使用可用的转换函数：

```typescript
import { Polygon, Feature, createFeature } from 'geo-types-cz'

const bbox: BBox = [116.3, 39.9, 116.5, 40.1]

// 手动将边界框转换为多边形
function bboxToPolygon(bbox: BBox): Polygon {
  const [minX, minY, maxX, maxY] = bbox
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

const polygon = bboxToPolygon(bbox)
console.log('多边形:', polygon)

// 使用createFeature创建要素
const feature = createFeature(polygon, {
  name: '北京中心区域',
  type: '边界框'
})

console.log('要素:', feature)

// 边界框字符串表示
const bboxString = JSON.stringify(bbox)
console.log('边界框字符串:', bboxString) // "[116.3,39.9,116.5,40.1]"
```

## 边界框验证

使用可用的验证函数：

```typescript
import { isBBox } from 'geo-types-cz'

const validBBox = [116.3, 39.9, 116.5, 40.1]
const invalidBBox = [116.3, 39.9, 116.5] // 缺少坐标

// 使用类型守卫验证边界框
console.log('有效边界框:', isBBox(validBBox))   // true
console.log('无效边界框:', isBBox(invalidBBox)) // false

// 手动验证边界框有效性
function validateBBox(bbox: any): bbox is BBox {
  if (!Array.isArray(bbox) || bbox.length < 4) {
    return false
  }
  
  const [minX, minY, maxX, maxY] = bbox
  return typeof minX === 'number' && 
         typeof minY === 'number' && 
         typeof maxX === 'number' && 
         typeof maxY === 'number' &&
         minX <= maxX && 
         minY <= maxY
}

// 标准化边界框
function normalizeBBox(bbox: BBox): BBox {
  const [x1, y1, x2, y2] = bbox
  return [
    Math.min(x1, x2),
    Math.min(y1, y2),
    Math.max(x1, x2),
    Math.max(y1, y2)
  ]
}

const unnormalizedBBox: BBox = [116.5, 40.1, 116.3, 39.9]
const normalizedBBox = normalizeBBox(unnormalizedBBox)
console.log('标准化后:', normalizedBBox) // [116.3, 39.9, 116.5, 40.1]
```

## 最佳实践

使用可用的边界框功能：

```typescript
import { 
  BBox, 
  isBBox, 
  createBBox2D, 
  createBBox3D, 
  getBBoxCenter, 
  unionBBox,
  isPositionInBBox,
  calculateGeometryBBox 
} from 'geo-types-cz'

// 1. 边界框验证和错误处理
function safeBBoxOperation<T>(
  bbox: any,
  operation: (validBBox: BBox) => T
): T | null {
  if (!isBBox(bbox)) {
    console.warn('无效的边界框:', bbox)
    return null
  }
  
  try {
    return operation(bbox)
  } catch (error) {
    console.error('边界框操作失败:', error)
    return null
  }
}

// 2. 边界框工具类
class BBoxUtils {
  static readonly WORLD_BBOX: BBox = [-180, -90, 180, 90]
  static readonly CHINA_BBOX: BBox = [73.62, 18.11, 134.77, 53.56]
  
  static isInChina(position: [number, number]): boolean {
    return isPositionInBBox(position, BBoxUtils.CHINA_BBOX)
  }
  
  static getCenter(bbox: BBox): [number, number] {
    return getBBoxCenter(bbox)
  }
  
  static getWidth(bbox: BBox): number {
    return bbox[2] - bbox[0]
  }
  
  static getHeight(bbox: BBox): number {
    return bbox[3] - bbox[1]
  }
}

// 使用示例
const bbox = createBBox2D(116.0, 39.5, 117.0, 40.5)
const center = BBoxUtils.getCenter(bbox)
console.log('边界框中心:', center)
```