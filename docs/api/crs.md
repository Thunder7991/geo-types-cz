# 坐标参考系统 API

坐标参考系统 (CRS - Coordinate Reference System) 定义了地理坐标的含义和转换方式。geo-types-cz 提供了完整的 CRS 类型定义和常用坐标系支持。

## 基础类型

### CRS

坐标参考系统的基础接口。

```typescript
interface CRS {
  type: 'name' | 'link'
  properties: {
    name?: string
    href?: string
    type?: string
  }
}
```

**字段说明:**
- `type`: CRS 类型，`'name'` 表示命名 CRS，`'link'` 表示链接 CRS
- `properties`: CRS 属性
  - `name`: CRS 名称（用于 name 类型）
  - `href`: CRS 链接（用于 link 类型）
  - `type`: 链接类型（用于 link 类型）

### NamedCRS

命名坐标参考系统。

```typescript
interface NamedCRS {
  type: 'name'
  properties: {
    name: string
  }
}
```

**示例:**
```typescript
import { NamedCRS } from 'geo-types-cz'

const wgs84: NamedCRS = {
  type: 'name',
  properties: {
    name: 'EPSG:4326'
  }
}

const webMercator: NamedCRS = {
  type: 'name',
  properties: {
    name: 'EPSG:3857'
  }
}
```

### LinkedCRS

链接坐标参考系统。

```typescript
interface LinkedCRS {
  type: 'link'
  properties: {
    href: string
    type?: string
  }
}
```

**示例:**
```typescript
import { LinkedCRS } from 'geo-types-cz'

const linkedCRS: LinkedCRS = {
  type: 'link',
  properties: {
    href: 'https://spatialreference.org/ref/epsg/4326/',
    type: 'proj4'
  }
}
```

## 常用坐标系

### CommonCRS

预定义的常用坐标参考系统。

```typescript
enum CommonCRS {
  // 国际标准坐标系
  WGS84 = 'EPSG:4326',           // WGS84 地理坐标系
  WebMercator = 'EPSG:3857',     // Web 墨卡托投影
  
  // 中国坐标系
  CGCS2000 = 'EPSG:4490',        // 中国大地坐标系2000
  Beijing54 = 'EPSG:4214',       // 北京54坐标系
  Xian80 = 'EPSG:4610',          // 西安80坐标系
  
  // 中国投影坐标系
  CGCS2000_3_Degree_GK_Zone_39 = 'EPSG:4513',  // CGCS2000 3度带高斯克吕格投影
  CGCS2000_3_Degree_GK_Zone_40 = 'EPSG:4514',
  CGCS2000_3_Degree_GK_Zone_41 = 'EPSG:4515',
  
  // UTM 投影
  UTM_Zone_49N = 'EPSG:32649',   // UTM 49N (适用于中国东部)
  UTM_Zone_50N = 'EPSG:32650',   // UTM 50N (适用于中国中部)
  UTM_Zone_51N = 'EPSG:32651'    // UTM 51N (适用于中国西部)
}
```

### 坐标系详细信息

```typescript
interface CRSInfo {
  code: string
  name: string
  description: string
  type: 'geographic' | 'projected'
  unit: string
  extent?: [number, number, number, number] // [minX, minY, maxX, maxY]
  authority: string
}
```

## 预定义坐标系信息

### 坐标系信息

目前包中不包含`getCRSInfo`函数。可以使用预定义的坐标系常量：

```typescript
import { CommonCRS } from 'geo-types-cz'

// 使用预定义的坐标系常量
console.log('WGS84:', CommonCRS.WGS84)           // 'EPSG:4326'
console.log('Web Mercator:', CommonCRS.WebMercator) // 'EPSG:3857'
console.log('CGCS2000:', CommonCRS.CGCS2000)     // 'EPSG:4490'
console.log('Beijing54:', CommonCRS.Beijing54)   // 'EPSG:4214'
console.log('Xian80:', CommonCRS.Xian80)         // 'EPSG:4610'

// 如需获取详细的坐标系信息，请使用专门的投影库如 proj4js
```

## 坐标系工厂函数

### createNamedCRS

创建命名坐标参考系统。

```typescript
function createNamedCRS(name: string): NamedCRS
```

**示例:**
```typescript
import { createNamedCRS } from 'geo-types-cz'

// 创建 WGS84 坐标系
const wgs84 = createNamedCRS('EPSG:4326')

// 创建自定义坐标系
const customCRS = createNamedCRS('EPSG:2154') // RGF93 / Lambert-93
```

### createLinkedCRS

创建链接坐标参考系统。

```typescript
function createLinkedCRS(href: string, type?: string): LinkedCRS
```

**示例:**
```typescript
import { createLinkedCRS } from 'geo-types-cz'

// 创建链接到 Proj4 定义的坐标系
const linkedCRS = createLinkedCRS(
  'https://spatialreference.org/ref/epsg/4326/proj4/',
  'proj4'
)

// 创建链接到 WKT 定义的坐标系
const wktCRS = createLinkedCRS(
  'https://spatialreference.org/ref/epsg/4326/prettywkt/',
  'wkt'
)
```

## 坐标系验证

坐标系验证功能需要使用类型守卫函数：

```typescript
import { isNamedCRS, isLinkedCRS } from 'geo-types-cz'

const namedCRS = {
  type: 'name',
  properties: {
    name: 'EPSG:4326'
  }
}

const linkedCRS = {
  type: 'link',
  properties: {
    href: 'https://spatialreference.org/ref/epsg/4326/'
  }
}

console.log(isNamedCRS(namedCRS))   // true
console.log(isLinkedCRS(linkedCRS)) // true
```


## 中国坐标系详解

### CGCS2000 (中国大地坐标系2000)

```typescript
const cgcs2000Info = {
  code: 'EPSG:4490',
  name: 'China Geodetic Coordinate System 2000',
  description: '中国大地坐标系2000，是中国当前使用的国家大地坐标系',
  ellipsoid: 'CGCS2000',
  datum: 'China 2000',
  usage: '适用于中国大陆地区的地理信息系统和测绘应用',
  accuracy: '亚米级精度'
}
```

### Beijing54 (北京54坐标系)

```typescript
const beijing54Info = {
  code: 'EPSG:4214',
  name: 'Beijing 1954',
  description: '北京54坐标系，中国早期使用的大地坐标系',
  ellipsoid: 'Krassowsky 1940',
  datum: 'Beijing 1954',
  usage: '历史数据和部分地区仍在使用',
  note: '与WGS84存在较大偏差，需要进行坐标转换'
}
```

### Xian80 (西安80坐标系)

```typescript
const xian80Info = {
  code: 'EPSG:4610',
  name: 'Xian 1980',
  description: '西安80坐标系，中国曾经使用的大地坐标系',
  ellipsoid: 'IAG 75',
  datum: 'Xian 1980',
  usage: '部分历史数据和特定应用',
  note: '精度介于Beijing54和CGCS2000之间'
}
```

## 投影坐标系

### 高斯-克吕格投影

```typescript
// 3度带高斯-克吕格投影
const gk3DegreeZones = {
  'EPSG:4513': { zone: 39, centralMeridian: 117, description: '适用于北京、天津地区' },
  'EPSG:4514': { zone: 40, centralMeridian: 120, description: '适用于上海、江苏地区' },
  'EPSG:4515': { zone: 41, centralMeridian: 123, description: '适用于辽宁、吉林地区' }
}

// 6度带高斯-克吕格投影
const gk6DegreeZones = {
  'EPSG:2433': { zone: 19, centralMeridian: 111, description: '适用于广西、海南地区' },
  'EPSG:2434': { zone: 20, centralMeridian: 117, description: '适用于华北地区' },
  'EPSG:2435': { zone: 21, centralMeridian: 123, description: '适用于东北地区' }
}
```

### UTM 投影

```typescript
// 中国适用的 UTM 带
const utmZones = {
  'EPSG:32649': { zone: '49N', centralMeridian: 111, description: '适用于中国西部' },
  'EPSG:32650': { zone: '50N', centralMeridian: 117, description: '适用于中国中部' },
  'EPSG:32651': { zone: '51N', centralMeridian: 123, description: '适用于中国东部' }
}
```

## 实用工具函数

当前包主要提供坐标系类型定义和基本的类型守卫函数。更高级的坐标系工具函数（如坐标转换、单位获取等）需要使用专门的投影库。

```typescript
import { CommonCRS, isNamedCRS, isLinkedCRS } from 'geo-types-cz'

// 使用预定义的坐标系常量
console.log('常用坐标系:')
console.log('WGS84:', CommonCRS.WGS84)
console.log('Web Mercator:', CommonCRS.WebMercator)
console.log('CGCS2000:', CommonCRS.CGCS2000)

// 使用类型守卫函数
const crs = { type: 'name', properties: { name: 'EPSG:4326' } }
console.log('是否为命名坐标系:', isNamedCRS(crs))
```

## 最佳实践

### 1. 坐标系选择指南

```typescript
import { CommonCRS } from 'geo-types-cz'

// 根据应用场景选择坐标系
function selectCRSForApplication(scenario: string): string {
  switch (scenario) {
    case 'web-mapping':
      return CommonCRS.WebMercator // Web 地图显示
    
    case 'gps-data':
      return CommonCRS.WGS84 // GPS 数据存储
    
    case 'china-survey':
      return CommonCRS.CGCS2000 // 中国测绘应用
    
    default:
      return CommonCRS.WGS84 // 默认使用 WGS84
  }
}
```

### 2. 类型安全的坐标系使用

```typescript
import { CRS, isNamedCRS, isLinkedCRS, createNamedCRS } from 'geo-types-cz'

// 安全地创建和验证坐标系
function createSafeCRS(crsName: string): CRS {
  const crs = createNamedCRS(crsName)
  
  if (isNamedCRS(crs)) {
    console.log('创建命名坐标系成功:', crs.properties.name)
    return crs
  }
  
  throw new Error('无效的坐标系名称')
}

// 类型守卫的使用
function processCRS(crs: CRS): void {
  if (isNamedCRS(crs)) {
    console.log('处理命名坐标系:', crs.properties.name)
  } else if (isLinkedCRS(crs)) {
    console.log('处理链接坐标系:', crs.properties.href)
  }
}
```