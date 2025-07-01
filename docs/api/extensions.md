# 扩展类型 API

geo-types-cz 提供了丰富的扩展类型，用于支持前端 GIS 应用的高级功能，包括样式定义、图层管理、空间查询等。

## 样式系统

### Style

完整的样式定义接口，支持点、线、面的样式配置。

```typescript
interface Style {
  fill?: {
    color?: string
    opacity?: number
  }
  stroke?: {
    color?: string
    width?: number
    opacity?: number
    dashArray?: number[]
    lineCap?: 'butt' | 'round' | 'square'
    lineJoin?: 'miter' | 'round' | 'bevel'
  }
  marker?: {
    size?: number
    color?: string
    opacity?: number
    symbol?: 'circle' | 'square' | 'triangle' | 'star' | 'cross' | 'diamond'
  }
  text?: {
    field?: string
    font?: string
    size?: number
    color?: string
    haloColor?: string
    haloWidth?: number
    offset?: [number, number]
    anchor?: 'start' | 'middle' | 'end'
    baseline?: 'top' | 'middle' | 'bottom'
  }
}
```

### 填充样式

填充样式定义，用于多边形内部填充。

```typescript
fill?: {
  color?: string
  opacity?: number
}
```

**示例:**
```typescript
import { Style } from 'geo-types-cz'

// 简单填充样式
const polygonStyle: Style = {
  fill: {
    color: '#ff0000',
    opacity: 0.6
  }
}
```

### 描边样式

描边样式定义，用于线条和多边形边界。

```typescript
stroke?: {
  color?: string
  width?: number
  opacity?: number
  dashArray?: number[]
  lineCap?: 'butt' | 'round' | 'square'
  lineJoin?: 'miter' | 'round' | 'bevel'
}
```

**示例:**
```typescript
import { Style } from 'geo-types-cz'

// 实线描边样式
const lineStyle: Style = {
  stroke: {
    color: '#000000',
    width: 2,
    opacity: 1.0,
    lineCap: 'round',
    lineJoin: 'round'
  }
}

// 虚线描边样式
const dashedStyle: Style = {
  stroke: {
    color: '#0066cc',
    width: 3,
    dashArray: [5, 5] // 5像素实线，5像素空白
  }
}
```

### 点标记样式

点标记样式定义。

```typescript
marker?: {
  size?: number
  color?: string
  opacity?: number
  symbol?: 'circle' | 'square' | 'triangle' | 'star' | 'cross' | 'diamond'
}
```

**示例:**
```typescript
import { Style } from 'geo-types-cz'

// 圆形标记样式
const pointStyle: Style = {
  marker: {
    size: 10,
    color: '#ff0000',
    opacity: 0.8,
    symbol: 'circle'
  }
}

// 星形标记样式
const starStyle: Style = {
  marker: {
    size: 15,
    color: '#ffff00',
    symbol: 'star'
  }
}
```

### 文本样式

文本标注样式定义。

```typescript
text?: {
  field?: string
  font?: string
  size?: number
  color?: string
  haloColor?: string
  haloWidth?: number
  offset?: [number, number]
  anchor?: 'start' | 'middle' | 'end'
  baseline?: 'top' | 'middle' | 'bottom'
}
```

**示例:**
```typescript
import { Style } from 'geo-types-cz'

// 简单文本样式
const textStyle: Style = {
  text: {
    field: 'name',
    font: 'Arial',
    size: 14,
    color: '#000000',
    anchor: 'middle',
    baseline: 'middle'
  }
}

// 带光晕的文本样式
const haloTextStyle: Style = {
  text: {
    field: 'name',
    font: 'Microsoft YaHei',
    size: 16,
    color: '#ffffff',
    haloColor: '#000000',
    haloWidth: 2,
    offset: [0, -20] // 向上偏移20像素
  }
}
```



## 图层系统

### Layer

图层基础接口。

```typescript
interface Layer {
  id: string
  name: string
  type: LayerType
  visible: boolean
  opacity: number
  zIndex: number
  minZoom?: number
  maxZoom?: number
  extent?: BBox
  metadata?: { [key: string]: any }
}
```

### LayerType

图层类型枚举。

```typescript
enum LayerType {
  Vector = 'vector',
  Raster = 'raster',
  Tile = 'tile',
  WMS = 'wms',
  WFS = 'wfs',
  GeoJSON = 'geojson',
  Heatmap = 'heatmap',
  Cluster = 'cluster'
}
```

### VectorLayer

矢量图层定义。

```typescript
interface VectorLayer extends Layer {
  type: LayerType.Vector
  source: FeatureCollection
  style: Style | ((feature: Feature) => Style)
  interactive?: boolean
  selectable?: boolean
  hoverable?: boolean
  clustering?: ClusterConfig
}
```

**示例:**
```typescript
import { VectorLayer, LayerType, Style } from 'geo-types-cz'

// 简单矢量图层
const simpleVectorLayer: VectorLayer = {
  id: 'poi-layer',
  name: 'POI图层',
  type: LayerType.Vector,
  visible: true,
  opacity: 1.0,
  zIndex: 10,
  source: poiFeatureCollection,
  style: {
    marker: {
      size: 8,
      color: '#ff0000',
      symbol: 'circle'
    }
  },
  interactive: true,
  selectable: true
}

// 动态样式矢量图层
const dynamicStyleLayer: VectorLayer = {
  id: 'roads-layer',
  name: '道路图层',
  type: LayerType.Vector,
  visible: true,
  opacity: 0.8,
  zIndex: 5,
  source: roadFeatureCollection,
  style: (feature) => {
    const roadType = feature.properties?.type
    switch (roadType) {
      case 'highway':
        return {
          stroke: { color: '#ff0000', width: 6 }
        }
      case 'main':
        return {
          stroke: { color: '#ff6600', width: 4 }
        }
      default:
        return {
          stroke: { color: '#cccccc', width: 2 }
        }
    }
  },
  minZoom: 8,
  maxZoom: 18
}
```

### RasterLayer

栅格图层定义。

```typescript
interface RasterLayer extends Layer {
  type: LayerType.Raster
  source: {
    url: string
    bounds: BBox
    attribution?: string
  }
  resampling?: 'nearest' | 'bilinear' | 'bicubic'
}
```

**示例:**
```typescript
import { RasterLayer, LayerType } from 'geo-types-cz'

const satelliteLayer: RasterLayer = {
  id: 'satellite',
  name: '卫星影像',
  type: LayerType.Raster,
  visible: true,
  opacity: 1.0,
  zIndex: 0,
  source: {
    url: 'https://example.com/satellite/{z}/{x}/{y}.jpg',
    bounds: [73.62, 18.11, 134.77, 53.56],
    attribution: '© 卫星数据提供商'
  },
  resampling: 'bilinear',
  maxZoom: 18
}
```


## 聚类配置

### ClusterConfig

点聚类配置。

```typescript
interface ClusterConfig {
  enabled: boolean
  distance: number
  maxZoom: number
  minPoints?: number
  style?: {
    cluster: Style
    clusterText: {
    font: string
    size: number
    color: string
    haloColor?: string
    haloWidth?: number
  }
  }
}
```

**示例:**
```typescript
import { ClusterConfig } from 'geo-types-cz'

const clusterConfig: ClusterConfig = {
  enabled: true,
  distance: 50, // 50像素内的点进行聚类
  maxZoom: 15,  // 15级以上不聚类
  minPoints: 2, // 至少2个点才聚类
  style: {
    cluster: {
      marker: {
        size: 30,
        color: '#0066cc',
        symbol: 'circle',
        strokeColor: '#ffffff',
        strokeWidth: 2
      }
    },
    clusterText: {
      content: (props) => String(props?.point_count || 0),
      size: 12,
      color: '#ffffff',
      anchor: 'middle',
      baseline: 'middle'
    }
  }
}
```

## 空间查询

### SpatialQuery

空间查询接口。

```typescript
interface SpatialQuery {
  type: SpatialQueryType
  geometry: Geometry
  properties?: { [key: string]: any }
  options?: {
    buffer?: number
    tolerance?: number
    limit?: number
    offset?: number
  }
}
```

### SpatialQueryType

空间查询类型枚举。

```typescript
enum SpatialQueryType {
  Intersects = 'intersects',     // 相交
  Contains = 'contains',         // 包含
  Within = 'within',             // 在内部
  Touches = 'touches',           // 相切
  Crosses = 'crosses',           // 穿越
  Overlaps = 'overlaps',         // 重叠
}
```

**示例:**
```typescript
import { SpatialQuery, SpatialQueryType, Polygon } from 'geo-types-cz'

// 多边形相交查询
const intersectionQuery: SpatialQuery = {
  type: SpatialQueryType.Intersects,
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
    category: 'restaurant'
  },
  options: {
    limit: 100,
    offset: 0
  }
}

// 缓冲区查询
const bufferQuery: SpatialQuery = {
  type: SpatialQueryType.DWithin,
  geometry: {
    type: 'Point',
    coordinates: [116.3974, 39.9093]
  },
  options: {
    buffer: 1000, // 1000米缓冲区
    limit: 50
  }
}

// 包含查询
const containsQuery: SpatialQuery = {
  type: SpatialQueryType.Contains,
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [116.0, 39.5],
      [117.0, 39.5],
      [117.0, 40.5],
      [116.0, 40.5],
      [116.0, 39.5]
    ]]
  },
  properties: {
    type: 'building'
  },
  options: {
    tolerance: 0.001
  }
}
```

## 地图配置

### MapConfig

地图配置接口。

```typescript
interface MapConfig {
  container: string | any
  center: Position
  zoom: number
  minZoom?: number
  maxZoom?: number
  extent?: BBox
  projection?: string
  controls?: {
    zoom?: boolean
    attribution?: boolean
    scale?: boolean
    fullscreen?: boolean
    rotate?: boolean
  }
  interactions?: {
    dragPan?: boolean
    dragRotate?: boolean
    doubleClickZoom?: boolean
    mouseWheelZoom?: boolean
    pinchZoom?: boolean
    keyboard?: boolean
  }
}
```

**示例:**
```typescript
import { MapConfig } from 'geo-types-cz'

// 基础地图配置
const basicMapConfig: MapConfig = {
  container: 'map-container',
  center: [116.3974, 39.9093], // 北京天安门
  zoom: 10,
  minZoom: 3,
  maxZoom: 18,
  projection: 'EPSG:3857'
}

// 完整地图配置
const fullMapConfig: MapConfig = {
  container: 'advanced-map',
  center: [121.4737, 31.2304], // 上海外滩
  zoom: 12,
  minZoom: 5,
  maxZoom: 20,
  extent: [120.9, 30.7, 122.2, 31.9], // 限制在上海范围内
  projection: 'EPSG:4326',
  controls: {
    zoom: true,
    attribution: true,
    scale: true,
    fullscreen: true,
    rotate: false
  },
  interactions: {
    dragPan: true,
    dragRotate: false,
    doubleClickZoom: true,
    mouseWheelZoom: true,
    pinchZoom: true,
    keyboard: true
  }
}
```

## 工厂函数

### createVectorLayer

创建矢量图层的便捷函数。

```typescript
function createVectorLayer(
  id: string,
  name: string,
  source: FeatureCollection,
  style?: Style | ((feature: Feature) => Style),
  options?: Partial<VectorLayer>
): VectorLayer
```

**示例:**
```typescript
import { createVectorLayer } from 'geo-types-cz'

// 创建简单矢量图层
const poiLayer = createVectorLayer(
  'poi-layer',
  'POI图层',
  poiFeatureCollection,
  {
    marker: {
      size: 10,
      color: '#ff0000',
      symbol: 'circle'
    }
  }
)

// 创建带选项的矢量图层
const roadLayer = createVectorLayer(
  'road-layer',
  '道路图层',
  roadFeatureCollection,
  (feature) => ({
    stroke: {
      color: feature.properties?.color || '#666666',
      width: feature.properties?.width || 2
    }
  }),
  {
    minZoom: 8,
    maxZoom: 18,
    interactive: true,
    selectable: false
  }
)
```

## 最佳实践

### 1. 样式主题管理

```typescript
// 定义样式主题
class StyleTheme {
  static readonly DEFAULT = {
    primary: '#0066cc',
    secondary: '#ff6600',
    success: '#00cc66',
    warning: '#ffcc00',
    danger: '#cc0000',
    text: '#333333',
    background: '#ffffff'
  }
  
  static createPointStyle(color: string, size: number = 10): Style {
    return {
      marker: {
        size,
        color,
        symbol: 'circle',
        strokeColor: '#ffffff',
        strokeWidth: 1
      }
    }
  }
  
  static createLineStyle(color: string, width: number = 2): Style {
    return {
      stroke: {
        color,
        width,
        lineCap: 'round',
        lineJoin: 'round'
      }
    }
  }
  
  static createPolygonStyle(fillColor: string, strokeColor?: string): Style {
    return {
      fill: {
        color: fillColor,
        opacity: 0.6
      },
      stroke: {
        color: strokeColor || fillColor,
        width: 2
      }
    }
  }
}

// 使用主题
const primaryPointStyle = StyleTheme.createPointStyle(StyleTheme.DEFAULT.primary)
const warningLineStyle = StyleTheme.createLineStyle(StyleTheme.DEFAULT.warning, 3)
```

### 2. 图层管理器

```typescript
class LayerManager {
  private layers = new Map<string, Layer>()
  private zIndexCounter = 0
  
  addLayer(layer: Layer): void {
    if (!layer.zIndex) {
      layer.zIndex = this.zIndexCounter++
    }
    this.layers.set(layer.id, layer)
  }
  
  removeLayer(id: string): boolean {
    return this.layers.delete(id)
  }
  
  getLayer(id: string): Layer | undefined {
    return this.layers.get(id)
  }
  
  getLayersByType(type: LayerType): Layer[] {
    return Array.from(this.layers.values())
      .filter(layer => layer.type === type)
  }
  
  setLayerVisibility(id: string, visible: boolean): void {
    const layer = this.layers.get(id)
    if (layer) {
      layer.visible = visible
    }
  }
  
  setLayerOpacity(id: string, opacity: number): void {
    const layer = this.layers.get(id)
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity))
    }
  }
  
  getOrderedLayers(): Layer[] {
    return Array.from(this.layers.values())
      .sort((a, b) => a.zIndex - b.zIndex)
  }
}
```

### 3. 动态样式生成

```typescript
// 基于数据值的动态样式
function createDataDrivenStyle(
  property: string,
  valueRanges: Array<{ min: number; max: number; style: Partial<Style> }>
): (feature: Feature) => Style {
  return (feature: Feature) => {
    const value = feature.properties?.[property]
    if (typeof value !== 'number') {
      return { marker: { size: 5, color: '#cccccc', symbol: 'circle' } }
    }
    
    for (const range of valueRanges) {
      if (value >= range.min && value <= range.max) {
        return { ...range.style }
      }
    }
    
    // 默认样式
    return { marker: { size: 5, color: '#cccccc', symbol: 'circle' } }
  }
}

// 使用示例
const populationStyle = createDataDrivenStyle('population', [
  {
    min: 0,
    max: 10000,
    style: {
      marker: { size: 8, color: '#00ff00', symbol: 'circle' }
    }
  },
  {
    min: 10001,
    max: 100000,
    style: {
      marker: { size: 12, color: '#ffff00', symbol: 'circle' }
    }
  },
  {
    min: 100001,
    max: Infinity,
    style: {
      marker: { size: 16, color: '#ff0000', symbol: 'circle' }
    }
  }
])
```

### 4. 性能优化

```typescript
// 样式缓存
class StyleCache {
  private cache = new Map<string, Style>()
  
  getStyle(key: string, factory: () => Style): Style {
    if (!this.cache.has(key)) {
      this.cache.set(key, factory())
    }
    return this.cache.get(key)!
  }
  
  clear(): void {
    this.cache.clear()
  }
  
  size(): number {
    return this.cache.size
  }
}

// 使用缓存的样式函数
const styleCache = new StyleCache()

function getCachedStyle(feature: Feature): Style {
  const cacheKey = `${feature.geometry.type}-${feature.properties?.type}`
  return styleCache.getStyle(cacheKey, () => {
    // 复杂的样式计算逻辑
    return { marker: { size: 5, color: '#cccccc', symbol: 'circle' } }
  })
}
```