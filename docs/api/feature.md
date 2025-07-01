# 要素类型 API

要素 (Feature) 是 GeoJSON 的核心概念，它将几何对象与属性数据结合在一起。geo-types-cz 提供了完整的要素类型定义和相关工具函数。

## 基础类型

### Properties

要素属性的基础类型，可以包含任意键值对。

```typescript
type Properties = { [key: string]: any } | null
```

**说明:**
- 属性可以是任意的 JSON 对象
- 也可以是 `null`
- 通常包含描述性信息，如名称、类型、样式等

**示例:**
```typescript
// 简单属性
const simpleProps: Properties = {
  name: '天安门',
  type: '景点',
  city: '北京'
}

// 复杂属性
const complexProps: Properties = {
  name: '北京大学',
  type: '教育机构',
  established: 1898,
  area: 2.74, // 平方公里
  departments: ['文学院', '理学院', '工学院'],
  contact: {
    phone: '+86-10-62751234',
    email: 'info@pku.edu.cn',
    website: 'https://www.pku.edu.cn'
  },
  coordinates: {
    entrance: [116.3067, 39.9927],
    center: [116.3100, 39.9950]
  }
}

// 空属性
const nullProps: Properties = null
```

## 要素 (Feature)

要素是几何对象与属性数据的组合。

```typescript
interface Feature<G extends Geometry = Geometry, P extends Properties = Properties> {
  type: 'Feature'
  geometry: G
  properties: P
  id?: string | number
}
```

**泛型参数:**
- `G`: 几何类型，默认为 `Geometry`
- `P`: 属性类型，默认为 `Properties`

**字段说明:**
- `type`: 固定为 `'Feature'`
- `geometry`: 几何对象
- `properties`: 属性数据
- `id`: 可选的唯一标识符

### 基础示例

```typescript
import { Feature, Point } from 'geo-types-cz'

// 简单要素
const pointFeature: Feature<Point> = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [116.3974, 39.9093]
  },
  properties: {
    name: '天安门',
    type: '景点'
  },
  id: 'tiananmen'
}

// 带类型约束的要素
interface POIProperties {
  name: string
  category: 'restaurant' | 'hotel' | 'attraction' | 'shopping'
  rating?: number
  address?: string
}

const typedFeature: Feature<Point, POIProperties> = {
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: [116.3974, 39.9093]
  },
  properties: {
    name: '故宫博物院',
    category: 'attraction',
    rating: 4.8,
    address: '北京市东城区景山前街4号'
  },
  id: 'forbidden-city'
}
```

### 不同几何类型的要素

```typescript
import { Feature, LineString, Polygon } from 'geo-types-cz'

// 线要素（道路）
const roadFeature: Feature<LineString> = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      [116.3974, 39.9093],
      [116.4074, 39.9193],
      [116.4174, 39.9293]
    ]
  },
  properties: {
    name: '长安街',
    type: '主干道',
    lanes: 6,
    speedLimit: 60
  },
  id: 'changanjie'
}

// 面要素（区域）
const areaFeature: Feature<Polygon> = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [116.3, 39.9],
      [116.5, 39.9],
      [116.5, 40.1],
      [116.3, 40.1],
      [116.3, 39.9]
    ]]
  },
  properties: {
    name: '朝阳区',
    type: '行政区',
    population: 3545137,
    area: 470.8 // 平方公里
  },
  id: 'chaoyang-district'
}
```

## 要素集合 (FeatureCollection)

要素集合包含多个要素对象。

```typescript
interface FeatureCollection<
  G extends Geometry = Geometry, 
  P extends Properties = Properties
> {
  type: 'FeatureCollection'
  features: Feature<G, P>[]
  bbox?: BBox
}
```

**字段说明:**
- `type`: 固定为 `'FeatureCollection'`
- `features`: 要素数组
- `bbox`: 可选的边界框

### 基础示例

```typescript
import { FeatureCollection, Point } from 'geo-types-cz'

const poiCollection: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [116.3974, 39.9093]
      },
      properties: {
        name: '天安门',
        type: '景点'
      },
      id: 'tiananmen'
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [116.3972, 39.9163]
      },
      properties: {
        name: '故宫',
        type: '景点'
      },
      id: 'forbidden-city'
    }
  ],
  bbox: [116.3970, 39.9090, 116.3975, 39.9165]
}
```

## 工厂函数

### createFeature

便捷地创建要素对象。

```typescript
function createFeature<G extends Geometry, P extends Properties>(
  geometry: G,
  properties: P,
  id?: string | number
): Feature<G, P>
```

**参数:**
- `geometry`: 几何对象
- `properties`: 属性数据
- `id`: 可选的标识符

**示例:**
```typescript
import { createFeature, Point } from 'geo-types-cz'

// 创建点要素
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}

const feature = createFeature(
  point,
  {
    name: '天安门',
    type: '景点',
    rating: 4.9
  },
  'tiananmen'
)

console.log(feature)
// 输出完整的 Feature 对象
```

### createFeatureCollection

便捷地创建要素集合。

```typescript
function createFeatureCollection<G extends Geometry, P extends Properties>(
  features: Feature<G, P>[],
  bbox?: BBox
): FeatureCollection<G, P>
```

**参数:**
- `features`: 要素数组
- `bbox`: 可选的边界框

**示例:**
```typescript
import { createFeatureCollection, createFeature } from 'geo-types-cz'

// 创建多个要素
const features = [
  createFeature(
    { type: 'Point', coordinates: [116.3974, 39.9093] },
    { name: '天安门' }
  ),
  createFeature(
    { type: 'Point', coordinates: [121.4737, 31.2304] },
    { name: '外滩' }
  )
]

// 创建要素集合
const collection = createFeatureCollection(features)

// 带边界框的要素集合
const collectionWithBbox = createFeatureCollection(
  features,
  [116.3974, 31.2304, 121.4737, 39.9093]
)
```

## 类型守卫

### isFeature

判断对象是否为要素。

```typescript
function isFeature(obj: any): obj is Feature
```

**示例:**
```typescript
import { isFeature } from 'geo-types-cz'

function processGeoJSON(data: any) {
  if (isFeature(data)) {
    // TypeScript 现在知道 data 是 Feature 类型
    console.log('要素名称:', data.properties?.name)
    console.log('几何类型:', data.geometry.type)
  }
}
```

### isFeatureCollection

判断对象是否为要素集合。

```typescript
function isFeatureCollection(obj: any): obj is FeatureCollection
```

**示例:**
```typescript
import { isFeatureCollection } from 'geo-types-cz'

function processGeoJSON(data: any) {
  if (isFeatureCollection(data)) {
    // TypeScript 现在知道 data 是 FeatureCollection 类型
    console.log('要素数量:', data.features.length)
    data.features.forEach((feature, index) => {
      console.log(`要素 ${index}:`, feature.properties?.name)
    })
  }
}
```

## 要素操作

### 属性操作

```typescript
import { Feature, Point } from 'geo-types-cz'

// 获取属性
function getProperty<T = any>(feature: Feature, key: string): T | undefined {
  return feature.properties?.[key]
}

// 设置属性
function setProperty<T = any>(feature: Feature, key: string, value: T): Feature {
  return {
    ...feature,
    properties: {
      ...feature.properties,
      [key]: value
    }
  }
}

// 删除属性
function removeProperty(feature: Feature, key: string): Feature {
  if (!feature.properties) return feature
  
  const { [key]: removed, ...rest } = feature.properties
  return {
    ...feature,
    properties: rest
  }
}

// 示例使用
let feature = createFeature(
  { type: 'Point', coordinates: [116.3974, 39.9093] },
  { name: '天安门', type: '景点' }
)

// 获取属性
const name = getProperty<string>(feature, 'name')
console.log('名称:', name)

// 设置新属性
feature = setProperty(feature, 'rating', 4.9)
feature = setProperty(feature, 'visited', true)

// 删除属性
feature = removeProperty(feature, 'visited')
```

### 要素过滤

目前包中不包含要素过滤函数。可以使用标准JavaScript数组方法进行过滤：

```typescript
import { FeatureCollection } from 'geo-types-cz'

// 示例使用
const allFeatures: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    createFeature(
      { type: 'Point', coordinates: [116.3974, 39.9093] },
      { name: '天安门', type: '景点', city: '北京' }
    ),
    createFeature(
      { type: 'Point', coordinates: [121.4737, 31.2304] },
      { name: '外滩', type: '景点', city: '上海' }
    ),
    createFeature(
      { type: 'LineString', coordinates: [[116.3, 39.9], [116.4, 40.0]] },
      { name: '道路1', type: '道路', city: '北京' }
    )
  ]
}

// 手动过滤点要素
const pointFeatures: FeatureCollection = {
  ...allFeatures,
  features: allFeatures.features.filter(feature => feature.geometry.type === 'Point')
}

// 手动过滤北京的要素
const beijingFeatures: FeatureCollection = {
  ...allFeatures,
  features: allFeatures.features.filter(feature => feature.properties?.city === '北京')
}

// 手动过滤景点
const attractions: FeatureCollection = {
  ...allFeatures,
  features: allFeatures.features.filter(feature => feature.properties?.type === '景点')
}
```

### 要素变换

目前包中不包含几何变换函数。如需变换要素，可以手动实现：

```typescript
import { Feature, Point, LineString } from 'geo-types-cz'

// 手动实现要素几何变换
function transformFeature<G extends Geometry>(
  feature: Feature<G>,
  transformer: (position: [number, number]) => [number, number]
): Feature<G> {
  const transformedGeometry = transformGeometry(feature.geometry, transformer)
  return {
    ...feature,
    geometry: transformedGeometry as G
  }
}

// 手动实现几何变换
function transformGeometry(geometry: Geometry, transformer: (pos: [number, number]) => [number, number]): Geometry {
  switch (geometry.type) {
    case 'Point':
      return {
        type: 'Point',
        coordinates: transformer(geometry.coordinates as [number, number])
      }
    case 'LineString':
      return {
        type: 'LineString',
        coordinates: geometry.coordinates.map(coord => transformer(coord as [number, number]))
      }
    case 'Polygon':
      return {
        type: 'Polygon',
        coordinates: geometry.coordinates.map(ring => 
          ring.map(coord => transformer(coord as [number, number]))
        )
      }
    default:
      return geometry
  }
}

// 示例：坐标偏移
const feature = createFeature(
  { type: 'Point', coordinates: [116.3974, 39.9093] },
  { name: '天安门' }
)

const offsetFeature = transformFeature(
  feature,
  ([x, y]) => [x + 0.01, y + 0.01]
)
```

## 要素统计

目前包中不包含要素统计函数。可以使用标准JavaScript数组方法进行统计：

```typescript
import { FeatureCollection } from 'geo-types-cz'

// 示例：统计要素类型
const collection = createFeatureCollection([
  createFeature({ type: 'Point', coordinates: [0, 0] }, { name: 'Point 1' }),
  createFeature({ type: 'LineString', coordinates: [[0, 0], [1, 1]] }, { name: 'Line 1' })
])

const typeCount = collection.features.reduce((acc, feature) => {
  const type = feature.geometry.type
  acc[type] = (acc[type] || 0) + 1
  return acc
}, {} as Record<string, number>)

console.log('按类型统计:', typeCount)

// 示例：统计属性值
const propertyValues = collection.features
  .map(f => f.properties?.name)
  .filter(name => name !== undefined)

console.log('属性值:', propertyValues)

// 示例：统计有属性的要素
const withProperties = collection.features.filter(f => 
  f.properties && Object.keys(f.properties).length > 0
).length

console.log('有属性的要素数量:', withProperties)
```

## 最佳实践

### 1. 类型安全的属性定义

```typescript
// 定义具体的属性接口
interface RestaurantProperties {
  name: string
  cuisine: string
  rating: number
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  phone?: string
  website?: string
}

// 使用类型化的要素
const restaurant: Feature<Point, RestaurantProperties> = createFeature(
  { type: 'Point', coordinates: [116.3974, 39.9093] },
  {
    name: '全聚德',
    cuisine: '北京菜',
    rating: 4.2,
    priceRange: '$$$',
    phone: '+86-10-67021234'
  }
)
```

### 2. 要素验证

```typescript
// 使用内置类型守卫进行验证
import { isFeature, isFeatureCollection } from 'geo-types-cz'

function processGeoData(data: any) {
  if (isFeature(data)) {
    console.log('这是一个要素')
    // 进行要素处理
  } else if (isFeatureCollection(data)) {
    console.log('这是一个要素集合')
    // 进行要素集合处理
  }
}
```

### 3. 性能优化

```typescript
// 对于大型要素集合，使用索引
class FeatureIndex {
  private features: Map<string | number, Feature> = new Map()
  private spatialIndex: Map<string, Feature[]> = new Map()
  
  constructor(collection: FeatureCollection) {
    collection.features.forEach(feature => {
      if (feature.id !== undefined) {
        this.features.set(feature.id, feature)
      }
      
      // 简单的空间索引（网格）
      const gridKey = this.getGridKey(feature.geometry)
      if (!this.spatialIndex.has(gridKey)) {
        this.spatialIndex.set(gridKey, [])
      }
      this.spatialIndex.get(gridKey)!.push(feature)
    })
  }
  
  getById(id: string | number): Feature | undefined {
    return this.features.get(id)
  }
  
  private getGridKey(geometry: Geometry): string {
    // 简化的网格键生成
    const bounds = this.calculateSimpleBounds(geometry)
    const gridX = Math.floor(bounds[0] * 100)
    const gridY = Math.floor(bounds[1] * 100)
    return `${gridX},${gridY}`
  }
  
  private calculateSimpleBounds(geometry: Geometry): [number, number, number, number] {
    // 简单的边界框计算
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    const processCoord = (coord: [number, number]) => {
      minX = Math.min(minX, coord[0])
      minY = Math.min(minY, coord[1])
      maxX = Math.max(maxX, coord[0])
      maxY = Math.max(maxY, coord[1])
    }
    
    if (geometry.type === 'Point') {
      processCoord(geometry.coordinates as [number, number])
    } else if (geometry.type === 'LineString') {
      geometry.coordinates.forEach(coord => processCoord(coord as [number, number]))
    } else if (geometry.type === 'Polygon') {
      geometry.coordinates[0].forEach(coord => processCoord(coord as [number, number]))
    }
    
    return [minX, minY, maxX, maxY]
  }
}
```

### 4. 要素序列化

```typescript
// 安全的 JSON 序列化
function serializeFeature(feature: Feature): string {
  try {
    return JSON.stringify(feature, null, 2)
  } catch (error) {
    throw new Error(`要素序列化失败: ${error.message}`)
  }
}

// 安全的 JSON 反序列化
function deserializeFeature(json: string): Feature {
  try {
    const feature = JSON.parse(json)
    if (!validateFeature(feature)) {
      throw new Error('无效的要素格式')
    }
    return feature
  } catch (error) {
    throw new Error(`要素反序列化失败: ${error.message}`)
  }
}
```