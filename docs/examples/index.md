# 使用示例

本页面提供了 geo-types-cz 的详细使用示例，涵盖从基础用法到高级应用的各种场景。

## 快速开始

### 基础 GeoJSON 操作

```typescript
import {
  Point,
  Feature,
  FeatureCollection,
  createFeature,
  createFeatureCollection,
  isPoint,
  isFeature
} from 'geo-types-cz'

// 创建点几何
const beijingPoint: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093]
}

// 创建要素
const beijingFeature = createFeature(beijingPoint, {
  name: '北京',
  population: 21540000,
  type: 'capital'
})

// 类型守卫
if (isPoint(beijingPoint)) {
  console.log('这是一个点几何')
}

if (isFeature(beijingFeature)) {
  console.log('这是一个要素')
}

// 创建要素集合
const cities = createFeatureCollection([
  beijingFeature,
  createFeature(
    { type: 'Point', coordinates: [121.4737, 31.2304] },
    { name: '上海', population: 24280000, type: 'municipality' }
  ),
  createFeature(
    { type: 'Point', coordinates: [113.2644, 23.1291] },
    { name: '广州', population: 15300000, type: 'city' }
  )
])

console.log(`共有 ${cities.features.length} 个城市`)
```

### 地理计算

```typescript
import {
  calculateDistance,
  calculateBearing,
  calculateDestination,
  calculatePolygonArea,
  calculateGeometryBBox
} from 'geo-types-cz'

// 计算两点间距离
const beijing = [116.3974, 39.9093] as const
const shanghai = [121.4737, 31.2304] as const

const distance = calculateDistance(beijing, shanghai)
console.log(`北京到上海的距离: ${distance.toFixed(2)} 公里`)

// 计算方位角
const bearing = calculateBearing(beijing, shanghai)
console.log(`从北京到上海的方位角: ${bearing.toFixed(2)}°`)

// 计算目标点
const destination = calculateDestination(beijing, 100, 45) // 从北京出发，45度方向100公里
console.log(`目标点坐标: [${destination[0].toFixed(4)}, ${destination[1].toFixed(4)}]`)

// 计算多边形面积
const polygon = {
  type: 'Polygon' as const,
  coordinates: [[
    [116.3, 39.9],
    [116.5, 39.9],
    [116.5, 40.1],
    [116.3, 40.1],
    [116.3, 39.9]
  ]]
}

const area = calculatePolygonArea(polygon)
console.log(`多边形面积: ${area.toFixed(2)} 平方公里`)

// 计算边界框
const bounds = calculateGeometryBBox(polygon)
console.log('多边形的边界框:', bounds)
```

## 边界框操作

### BBox 基础操作

```typescript
import {
  BBox2D,
  createBBox2D,
  getBBoxCenter,
  unionBBox
} from 'geo-types-cz'

// 创建边界框
const beijingBBox = createBBox2D(116.0, 39.4, 116.8, 40.2)
const shanghaiBBox = createBBox2D(121.0, 30.9, 121.9, 31.6)

console.log('北京边界框:', beijingBBox)
console.log('上海边界框:', shanghaiBBox)

// 手动从几何体创建边界框
const pointGeometry = {
  type: 'Point' as const,
  coordinates: [116.3974, 39.9093]
}

// 点的边界框就是点本身的坐标
const pointBBox = createBBox2D(
  pointGeometry.coordinates[0], pointGeometry.coordinates[1],
  pointGeometry.coordinates[0], pointGeometry.coordinates[1]
)
console.log('点的边界框:', pointBBox)

// 手动实现边界框关系判断
function containsPoint(bbox: BBox2D, point: [number, number]): boolean {
  const [minX, minY, maxX, maxY] = bbox
  const [x, y] = point
  return x >= minX && x <= maxX && y >= minY && y <= maxY
}

function intersectsBBox(bbox1: BBox2D, bbox2: BBox2D): boolean {
  const [minX1, minY1, maxX1, maxY1] = bbox1
  const [minX2, minY2, maxX2, maxY2] = bbox2
  return !(maxX1 < minX2 || maxX2 < minX1 || maxY1 < minY2 || maxY2 < minY1)
}

const testPoint = [116.4, 39.9] as const
const isContained = containsPoint(beijingBBox, testPoint)
console.log(`点 [${testPoint}] 是否在北京边界框内:`, isContained)

const doIntersect = intersectsBBox(beijingBBox, shanghaiBBox)
console.log('北京和上海边界框是否相交:', doIntersect)

// 边界框运算
const combinedBBox = unionBBox(beijingBBox, shanghaiBBox)
console.log('合并后的边界框:', combinedBBox)

// 手动扩展边界框
function expandBBox(bbox: BBox2D, delta: number): BBox2D {
  const [minX, minY, maxX, maxY] = bbox
  return [minX - delta, minY - delta, maxX + delta, maxY + delta]
}

const expandedBBox = expandBBox(beijingBBox, 0.1) // 扩展0.1度
console.log('扩展后的边界框:', expandedBBox)

// 手动转换为多边形
function bboxToPolygon(bbox: BBox2D) {
  const [minX, minY, maxX, maxY] = bbox
  return {
    type: 'Polygon' as const,
    coordinates: [[
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY]
    ]]
  }
}

const bboxPolygon = bboxToPolygon(beijingBBox)
console.log('边界框多边形:', bboxPolygon)
```

### BBox 高级应用

```typescript
import {
  createBBox2D,
  getBBoxCenter,
  unionBBox
} from 'geo-types-cz'

// 创建边界框
const bbox = createBBox2D(116.0, 39.4, 116.8, 40.2)

// 手动计算边界框属性
const center = getBBoxCenter(bbox)
const width = bbox[2] - bbox[0]  // maxX - minX
const height = bbox[3] - bbox[1] // maxY - minY
const area = width * height

console.log('中心点:', center)
console.log('宽度:', width)
console.log('高度:', height)
console.log('面积:', area)

// 手动创建网格
function createGrid(bbox: [number, number, number, number], cols: number, rows: number) {
  const [minX, minY, maxX, maxY] = bbox
  const cellWidth = (maxX - minX) / cols
  const cellHeight = (maxY - minY) / rows
  const grid = []
  
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cellMinX = minX + j * cellWidth
      const cellMinY = minY + i * cellHeight
      const cellMaxX = cellMinX + cellWidth
      const cellMaxY = cellMinY + cellHeight
      grid.push([cellMinX, cellMinY, cellMaxX, cellMaxY])
    }
  }
  return grid
}

const grid = createGrid(bbox, 4, 4) // 4x4 网格
console.log(`生成了 ${grid.length} 个网格单元`)

// 手动分割边界框
const splitBoxes = createGrid(bbox, 2, 2) // 分割为2x2
console.log(`分割为 ${splitBoxes.length} 个子边界框`)

// 边界框合并示例
const bbox1 = createBBox2D(116.0, 39.4, 116.2, 39.6)
const bbox2 = createBBox2D(116.1, 39.5, 116.3, 39.7)
const merged = unionBBox(bbox1, bbox2)
console.log('合并后的边界框:', merged)
```

## 样式和图层

### 基础样式

```typescript
import {
  Style
} from 'geo-types-cz'

// 创建点样式
const pointStyle: Style = {
  marker: {
    size: 12,
    color: '#ff0000',
    symbol: 'circle',
    strokeColor: '#ffffff',
    strokeWidth: 2,
    opacity: 0.8
  },
  text: {
    content: (props) => props?.name || '未命名',
    font: 'Arial',
    size: 14,
    color: '#000000',
    anchor: 'middle',
    baseline: 'bottom',
    offset: [0, -15],
    haloColor: '#ffffff',
    haloWidth: 2
  }
}

// 创建线样式
const lineStyle: Style = {
  stroke: {
    color: '#0066cc',
    width: 3,
    opacity: 1.0,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: [10, 5] // 虚线
  }
}

// 创建面样式
const polygonStyle: Style = {
  fill: {
    color: '#00ff00',
    opacity: 0.3,
    pattern: 'diagonal',
    patternColor: '#006600'
  },
  stroke: {
    color: '#006600',
    width: 2,
    opacity: 0.8
  }
}

// 创建复合样式
const complexStyle: Style = {
  marker: {
    size: 10,
    color: '#ff6600',
    symbol: 'star'
  },
  fill: {
    color: '#ff0000',
    opacity: 0.5
  },
  stroke: {
    color: '#000000',
    width: 2
  }
}

console.log('合并后的样式:', combinedStyle)
```

### 动态样式

```typescript
import { Style, Feature } from 'geo-types-cz'

// 基于属性的动态样式函数
function createDynamicStyle(feature: Feature): Style {
  const props = feature.properties || {}
  const type = props.type
  const population = props.population || 0
  
  // 根据城市类型设置颜色
  let color = '#cccccc'
  switch (type) {
    case 'capital':
      color = '#ff0000'
      break
    case 'municipality':
      color = '#ff6600'
      break
    case 'city':
      color = '#0066cc'
      break
  }
  
  // 根据人口设置大小
  let size = 8
  if (population > 20000000) {
    size = 16
  } else if (population > 10000000) {
    size = 12
  } else if (population > 5000000) {
    size = 10
  }
  
  return {
    marker: {
      size,
      color,
      symbol: 'circle',
      strokeColor: '#ffffff',
      strokeWidth: 1,
      opacity: 0.8
    },
    text: {
      content: props.name || '未命名',
      size: Math.max(10, size - 2),
      color: '#000000',
      anchor: 'middle',
      baseline: 'bottom',
      offset: [0, -size - 5],
      haloColor: '#ffffff',
      haloWidth: 1
    }
  }
}

// 使用动态样式
const styledFeatures = cities.features.map(feature => ({
  ...feature,
  style: createDynamicStyle(feature)
}))

console.log('应用动态样式后的要素:', styledFeatures)
```

### 图层管理

```typescript
import {
  VectorLayer,
  LayerType,
  createVectorLayer
} from 'geo-types-cz'

// 创建矢量图层
const cityLayer = createVectorLayer(
  'cities',
  '城市图层',
  cities,
  createDynamicStyle,
  {
    minZoom: 5,
    maxZoom: 18,
    interactive: true,
    selectable: true,
    hoverable: true
  }
)



// 图层管理器示例
class SimpleLayerManager {
  private layers = new Map<string, VectorLayer>()
  
  addLayer(layer: VectorLayer): void {
    this.layers.set(layer.id, layer)
    console.log(`添加图层: ${layer.name}`)
  }
  
  removeLayer(id: string): boolean {
    const removed = this.layers.delete(id)
    if (removed) {
      console.log(`移除图层: ${id}`)
    }
    return removed
  }
  
  toggleLayerVisibility(id: string): void {
    const layer = this.layers.get(id)
    if (layer) {
      layer.visible = !layer.visible
      console.log(`图层 ${layer.name} 可见性: ${layer.visible}`)
    }
  }
  
  setLayerOpacity(id: string, opacity: number): void {
    const layer = this.layers.get(id)
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity))
      console.log(`图层 ${layer.name} 透明度: ${layer.opacity}`)
    }
  }
  
  getVisibleLayers(): (VectorLayer)[] {
    return Array.from(this.layers.values())
      .filter(layer => layer.visible)
      .sort((a, b) => a.zIndex - b.zIndex)
  }
}

// 使用图层管理器
const layerManager = new SimpleLayerManager()
layerManager.addLayer(cityLayer)
layerManager.addLayer(populationHeatmap)

// 切换图层可见性
layerManager.toggleLayerVisibility('cities')
layerManager.setLayerOpacity('population-heatmap', 0.7)

console.log('可见图层:', layerManager.getVisibleLayers())
```

## 实用工具

### 几何体操作

```typescript
import {
  LineString,
  Polygon
} from 'geo-types-cz'

// 手动实现线段长度计算
function calculateLineLength(lineString: LineString): number {
  const coords = lineString.coordinates
  let totalLength = 0
  
  for (let i = 1; i < coords.length; i++) {
    const distance = calculateDistance(coords[i-1], coords[i])
    totalLength += distance
  }
  
  return totalLength * 1000 // 转换为米
}

// 手动实现多边形面积计算（球面积）
function calculatePolygonArea(polygon: Polygon): number {
  const coords = polygon.coordinates[0]
  let area = 0
  const R = 6371000 // 地球半径（米）
  
  for (let i = 0; i < coords.length - 1; i++) {
    const [lon1, lat1] = coords[i]
    const [lon2, lat2] = coords[i + 1]
    
    const dLon = (lon2 - lon1) * Math.PI / 180
    const lat1Rad = lat1 * Math.PI / 180
    const lat2Rad = lat2 * Math.PI / 180
    
    area += dLon * (2 + Math.sin(lat1Rad) + Math.sin(lat2Rad))
  }
  
  return Math.abs(area * R * R / 2)
}

// 手动实现线段简化（Douglas-Peucker算法简化版）
function simplifyLineString(lineString: LineString, tolerance: number): LineString {
  const coords = lineString.coordinates
  if (coords.length <= 2) return lineString
  
  // 简化实现：保留起点、终点和中间的关键点
  const simplified = [coords[0]]
  
  for (let i = 1; i < coords.length - 1; i += 2) {
    simplified.push(coords[i])
  }
  
  simplified.push(coords[coords.length - 1])
  
  return {
    type: 'LineString',
    coordinates: simplified
  }
}

// 几何体简化
const complexLine: LineString = {
  type: 'LineString',
  coordinates: [
    [116.0, 39.0],
    [116.1, 39.05],
    [116.15, 39.1],
    [116.2, 39.15],
    [116.25, 39.2],
    [116.3, 39.25],
    [116.4, 39.3]
  ]
}

const simplifiedLine = simplifyLineString(complexLine, 0.05) // 容差0.05度
console.log('原始线段点数:', complexLine.coordinates.length)
console.log('简化后点数:', simplifiedLine.coordinates.length)

// 计算长度和面积
const lineLength = calculateLineLength(complexLine)
console.log(`线段长度: ${(lineLength / 1000).toFixed(2)} 公里`)

const polygonArea = calculatePolygonArea(beijingArea)
console.log(`多边形面积: ${(polygonArea / 1000000).toFixed(2)} 平方公里`)
```

### 数据验证

```typescript
import {
  isPoint,
  isLineString,
  isPolygon,
  isFeature,
  isFeatureCollection,
  createFeature,
  validateFeatureGeometry,
  validateCoordinates,
  validateGeometry
} from 'geo-types-cz'


// 几何体类型验证
const validPoint = { type: 'Point', coordinates: [116.3974, 39.9093] }
const invalidPoint = { type: 'Point', coordinates: [200, 100] } // 坐标超出范围但类型正确

console.log('是否为点几何:', isPoint(validPoint))
console.log('无效坐标的点几何:', isPoint(invalidPoint))

// 要素类型验证
const validFeature = createFeature(validPoint, { name: '北京' })
const invalidFeature = { type: 'Feature', geometry: null, properties: {} }

console.log('有效要素:', isFeature(validFeature))
console.log('无效要素:', isFeature(invalidFeature))

// 要素集合类型验证
// console.log('有效要素集合:', isFeatureCollection(cities))

// 坐标验证
console.log('有效坐标:', validateCoordinates([116.3974, 39.9093]))
console.log('无效坐标:', validateCoordinates([200, 100]))

// 使用自定义验证
console.log('有效点几何:', validateGeometry(validPoint))
console.log('无效坐标点几何:', validateGeometry(invalidPoint))

// 验证要素的几何体
console.log('要素几何验证:', validateFeatureGeometry(validFeature))
```

### 性能优化

```typescript
// 大数据集处理示例
class GeoDataProcessor {
  private spatialIndex: Map<string, Feature[]> = new Map()
  private readonly GRID_SIZE = 0.1 // 0.1度网格
  
  constructor(features: Feature[]) {
    this.buildSpatialIndex(features)
  }
  
  // 构建空间索引
  private buildSpatialIndex(features: Feature[]): void {
    for (const feature of features) {
      if (feature.geometry.type === 'Point') {
        const [lon, lat] = feature.geometry.coordinates
        const gridKey = this.getGridKey(lon, lat)
        
        if (!this.spatialIndex.has(gridKey)) {
          this.spatialIndex.set(gridKey, [])
        }
        this.spatialIndex.get(gridKey)!.push(feature)
      }
    }
    
    console.log(`构建空间索引完成，共 ${this.spatialIndex.size} 个网格单元`)
  }
  
  private getGridKey(lon: number, lat: number): string {
    const gridX = Math.floor(lon / this.GRID_SIZE)
    const gridY = Math.floor(lat / this.GRID_SIZE)
    return `${gridX},${gridY}`
  }
  
  // 快速邻近查询
  findNearby(
    center: readonly [number, number],
    radius: number
  ): Feature[] {
    const [centerLon, centerLat] = center
    const results: Feature[] = []
    
    // 计算需要检查的网格范围
    const gridRadius = Math.ceil(radius / (this.GRID_SIZE * 111)) // 粗略转换为网格数
    const centerGridX = Math.floor(centerLon / this.GRID_SIZE)
    const centerGridY = Math.floor(centerLat / this.GRID_SIZE)
    
    // 检查周围网格
    for (let x = centerGridX - gridRadius; x <= centerGridX + gridRadius; x++) {
      for (let y = centerGridY - gridRadius; y <= centerGridY + gridRadius; y++) {
        const gridKey = `${x},${y}`
        const gridFeatures = this.spatialIndex.get(gridKey) || []
        
        // 精确距离检查
        for (const feature of gridFeatures) {
          if (feature.geometry.type === 'Point') {
            const distance = calculateDistance(center, feature.geometry.coordinates)
            if (distance <= radius) {
              results.push(feature)
            }
          }
        }
      }
    }
    
    return results
  }
  
  // 批量处理
  batchProcess(
    processor: (feature: Feature) => Feature,
    batchSize: number = 1000
  ): Feature[] {
    const allFeatures = Array.from(this.spatialIndex.values()).flat()
    const results: Feature[] = []
    
    for (let i = 0; i < allFeatures.length; i += batchSize) {
      const batch = allFeatures.slice(i, i + batchSize)
      const processedBatch = batch.map(processor)
      results.push(...processedBatch)
      
      // 模拟异步处理
      if (i % (batchSize * 10) === 0) {
        console.log(`处理进度: ${Math.round((i / allFeatures.length) * 100)}%`)
      }
    }
    
    return results
  }
}

// 使用数据处理器
const processor = new GeoDataProcessor(cities.features)

// 快速邻近查询
const nearbyFeatures = processor.findNearby([116.3974, 39.9093], 50)
console.log(`找到 ${nearbyFeatures.length} 个邻近要素`)

// 批量处理示例
const processedFeatures = processor.batchProcess(
  (feature) => ({
    ...feature,
    properties: {
      ...feature.properties,
      processed: true,
      processTime: new Date().toISOString()
    }
  }),
  500
)

console.log(`批量处理完成，共处理 ${processedFeatures.length} 个要素`)
```

## 完整应用示例

### 简单地图应用

```typescript
import {
  Feature,
  FeatureCollection,
  VectorLayer,
  MapConfig,
  Style,
  createFeature,
  createFeatureCollection,
  createVectorLayer
} from 'geo-types-cz'

// 地图应用类
class SimpleMapApp {
  private config: MapConfig
  private layers: Map<string, VectorLayer> = new Map()
  private selectedFeatures: Feature[] = []
  
  constructor(container: string) {
    this.config = {
      container,
      center: [116.3974, 39.9093],
      zoom: 10,
      minZoom: 3,
      maxZoom: 18,
      controls: {
        zoom: true,
        attribution: true,
        scale: true
      },
      interactions: {
        dragPan: true,
        doubleClickZoom: true,
        mouseWheelZoom: true
      }
    }
    
    this.initialize()
  }
  
  private initialize(): void {
    console.log('初始化地图应用')
    console.log('地图配置:', this.config)
    
    // 添加默认图层
    this.addCityLayer()
    this.addInteractionHandlers()
  }
  
  private addCityLayer(): void {
    const cityLayer = createVectorLayer(
      'cities',
      '城市图层',
      cities,
      this.createCityStyle.bind(this),
      {
        interactive: true,
        selectable: true,
        hoverable: true
      }
    )
    
    this.addLayer(cityLayer)
  }
  
  private createCityStyle(feature: Feature): Style {
    const isSelected = this.selectedFeatures.includes(feature)
    const population = feature.properties?.population || 0
    
    let size = 8
    let color = '#0066cc'
    
    if (population > 20000000) {
      size = 16
      color = '#ff0000'
    } else if (population > 10000000) {
      size = 12
      color = '#ff6600'
    }
    
    if (isSelected) {
      size += 4
      color = '#ffff00'
    }
    
    return {
      marker: {
        size,
        color,
        symbol: 'circle',
        strokeColor: isSelected ? '#ff0000' : '#ffffff',
        strokeWidth: isSelected ? 3 : 1
      },
      text: {
        content: feature.properties?.name || '',
        size: 12,
        color: '#000000',
        anchor: 'middle',
        baseline: 'bottom',
        offset: [0, -size - 5],
        haloColor: '#ffffff',
        haloWidth: 1
      }
    }
  }
  
  addLayer(layer: VectorLayer): void {
    this.layers.set(layer.id, layer)
    console.log(`添加图层: ${layer.name}`)
  }
  
  removeLayer(id: string): void {
    if (this.layers.delete(id)) {
      console.log(`移除图层: ${id}`)
    }
  }
  
  selectFeature(feature: Feature): void {
    if (!this.selectedFeatures.includes(feature)) {
      this.selectedFeatures.push(feature)
      console.log(`选中要素: ${feature.properties?.name}`)
      this.updateLayerStyles()
    }
  }
  
  deselectFeature(feature: Feature): void {
    const index = this.selectedFeatures.indexOf(feature)
    if (index > -1) {
      this.selectedFeatures.splice(index, 1)
      console.log(`取消选中要素: ${feature.properties?.name}`)
      this.updateLayerStyles()
    }
  }
  
  clearSelection(): void {
    this.selectedFeatures = []
    console.log('清空选择')
    this.updateLayerStyles()
  }
  
  private updateLayerStyles(): void {
    // 触发图层样式更新
    console.log('更新图层样式')
  }
  
  // 空间查询功能
  queryFeatures(center: readonly [number, number], radius: number): Feature[] {
    const allFeatures = Array.from(this.layers.values())
      .flatMap(layer => layer.source.features)
    
    return allFeatures.filter(feature => {
      if (feature.geometry.type === 'Point') {
        const distance = calculateDistance(center, feature.geometry.coordinates)
        return distance <= radius
      }
      return false
    })
  }
  
  // 测量功能
  measureDistance(start: readonly [number, number], end: readonly [number, number]): number {
    return calculateDistance(start, end)
  }
  
  // 添加交互处理
  private addInteractionHandlers(): void {
    console.log('添加交互处理器')
    
    // 模拟点击事件
    this.onMapClick = this.onMapClick.bind(this)
    this.onFeatureHover = this.onFeatureHover.bind(this)
  }
  
  private onMapClick(coordinates: readonly [number, number]): void {
    console.log(`地图点击: [${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`)
    
    // 查找点击位置附近的要素
    const clickedFeatures = this.queryFeatures(coordinates, 0.01) // 0.01度范围内
    
    if (clickedFeatures.length > 0) {
      this.selectFeature(clickedFeatures[0])
    } else {
      this.clearSelection()
    }
  }
  
  private onFeatureHover(feature: Feature | null): void {
    if (feature) {
      console.log(`悬停要素: ${feature.properties?.name}`)
    }
  }
  
  // 获取地图状态
  getMapState(): any {
    return {
      center: this.config.center,
      zoom: this.config.zoom,
      layerCount: this.layers.size,
      selectedCount: this.selectedFeatures.length
    }
  }
}

// 使用地图应用
const mapApp = new SimpleMapApp('map-container')

// 模拟用户交互
console.log('\n=== 模拟用户交互 ===')

// 点击北京
mapApp.onMapClick([116.3974, 39.9093])

// 查询北京周围50公里的城市
const nearbyResults = mapApp.queryFeatures([116.3974, 39.9093], 50) // 50公里
console.log(`北京周围50公里内的城市: ${nearbyResults.length} 个`)

// 测量距离
const distance = mapApp.measureDistance(
  [116.3974, 39.9093], // 北京
  [121.4737, 31.2304]  // 上海
)
console.log(`北京到上海的距离: ${distance.toFixed(2)} 公里`)

// 获取地图状态
console.log('地图状态:', mapApp.getMapState())
```

这个完整的示例展示了如何使用 geo-types-cz 构建一个功能完整的地图应用，包括图层管理、要素选择、空间查询、距离测量等功能。

## 总结

通过这些示例，你可以看到 geo-types-cz 提供了：

1. **完整的 GeoJSON 类型支持** - 类型安全的几何体和要素操作
2. **强大的地理计算功能** - 距离、方位角、面积等计算
3. **丰富的样式系统** - 支持动态样式和主题管理
4. **高效的空间查询** - 支持多种空间关系判断
5. **实用的工具函数** - 几何体操作、类型守卫等
6. **性能优化支持** - 空间索引、批量处理等

这些功能使得 geo-types-cz 成为前端 GIS 开发的理想选择。