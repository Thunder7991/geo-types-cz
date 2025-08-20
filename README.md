# geo-types-cz

🌍 完整的 TypeScript GeoJSON 类型定义包，专为前端 GIS 开发设计

🌐 **官方文档**: https://thunder7991.github.io/geo-types-cz

📦 NPM: https://www.npmjs.com/package/geo-types-cz
## 特性

- ✅ **完整的 GeoJSON 支持** - 基于 RFC 7946 标准
- 🎯 **TypeScript 优先** - 提供完整的类型安全
- 🚀 **扩展功能** - 包含样式、图层、查询等 GIS 扩展类型
- 🛠️ **实用工具** - 内置常用的地理计算函数
- 📦 **零依赖** - 轻量级，无外部依赖
- 🌏 **中文友好** - 支持中国常用坐标系

## 安装

```bash
npm install geo-types-cz
# 或
yarn add geo-types-cz
# 或
pnpm add geo-types-cz
```

## 快速开始

### 基础 GeoJSON 类型

```typescript
import { Point, Feature, FeatureCollection, createFeature } from 'geo-types-cz';

// 创建点几何
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093] // 北京天安门
};

// 创建要素
const feature = createFeature(point, {
  name: '天安门',
  city: '北京',
  type: '景点'
});

// 创建要素集合
const featureCollection: FeatureCollection = {
  type: 'FeatureCollection',
  features: [feature]
};
```

### 几何计算

```typescript
import { 
  calculateDistance, 
  calculateBearing, 
  calculateDestination,
  calculatePolygonArea 
} from 'geo-types-cz';

// 计算两点间距离（米）
const distance = calculateDistance(
  [116.3974, 39.9093], // 北京天安门
  [121.4737, 31.2304]  // 上海外滩
);
console.log(`距离: ${Math.round(distance / 1000)}公里`);

// 计算方位角
const bearing = calculateBearing(
  [116.3974, 39.9093],
  [121.4737, 31.2304]
);
console.log(`方位角: ${bearing.toFixed(1)}度`);

// 根据起点、距离和方位角计算终点
const destination = calculateDestination(
  [116.3974, 39.9093], // 起点
  1000,                 // 距离（米）
  90                    // 方位角（度）
);
```

### 样式和图层

```typescript
import { 
  Style, 
  StyledFeature, 
  VectorLayer, 
  createVectorLayer 
} from 'geo-types-cz';

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
};

// 创建带样式的要素
const styledFeature: StyledFeature = {
  ...feature,
  style
};

// 创建矢量图层
const layer = createVectorLayer(
  'poi-layer',
  'POI图层',
  featureCollection,
  style
);
```

### 坐标参考系统

```typescript
import { CommonCRS, createNamedCRS } from 'geo-types-cz';

// 使用预定义的CRS
const wgs84 = CommonCRS.WGS84;
const webMercator = CommonCRS.WebMercator;
const cgcs2000 = CommonCRS.CGCS2000;

// 创建自定义CRS
const customCRS = createNamedCRS('EPSG:4547'); // 北京54 / 3-degree Gauss-Kruger CM 120E
```

### 边界框操作

```typescript
import { 
  BBox, 
  createBBox2D, 
  unionBBox, 
  isPositionInBBox,
  calculateGeometryBBox 
} from 'geo-types-cz';

// 创建边界框
const bbox = createBBox2D(116.0, 39.0, 117.0, 40.0); // [west, south, east, north]

// 检查点是否在边界框内
const isInside = isPositionInBBox([116.5, 39.5], bbox);

// 计算几何对象的边界框
const geomBBox = calculateGeometryBBox(point);

// 合并两个边界框
const mergedBBox = unionBBox(bbox, geomBBox);
```

## API 文档

### 核心类型

#### 几何类型 (Geometry)
- `Point` - 点
- `LineString` - 线
- `Polygon` - 多边形
- `MultiPoint` - 多点
- `MultiLineString` - 多线
- `MultiPolygon` - 多多边形
- `GeometryCollection` - 几何集合

#### 要素类型 (Feature)
- `Feature<G, P>` - 要素，支持泛型
- `FeatureCollection<G, P>` - 要素集合
- `Properties` - 属性类型

#### 扩展类型
- `Style` - 样式定义
- `Layer` - 图层类型（矢量、栅格、瓦片）
- `MapConfig` - 地图配置
- `Query` - 空间和属性查询

### 工具函数

#### 距离和方位计算
- `calculateDistance(pos1, pos2)` - 计算两点间距离
- `calculateBearing(pos1, pos2)` - 计算方位角
- `calculateDestination(start, distance, bearing)` - 计算目标点

#### 几何计算
- `calculateLineLength(lineString)` - 计算线段长度
- `calculatePolygonArea(polygon)` - 计算多边形面积
- `calculateGeometryBBox(geometry)` - 计算几何边界框

#### 数据处理
- `simplifyLineString(lineString, tolerance)` - 线段简化
- `createBuffer(point, distance)` - 创建缓冲区

### 类型守卫

```typescript
import { isPoint, isFeature, isVectorLayer } from 'geo-types-cz';

if (isPoint(geometry)) {
  // geometry 现在被推断为 Point 类型
  console.log(geometry.coordinates);
}

if (isFeature(geoJsonObject)) {
  // geoJsonObject 现在被推断为 Feature 类型
  console.log(geoJsonObject.properties);
}
```

## 使用场景

### Web 地图开发
```typescript
import { MapConfig, TileLayer, VectorLayer } from 'geo-types-cz';

const mapConfig: MapConfig = {
  container: 'map',
  view: {
    center: [116.3974, 39.9093],
    zoom: 10
  },
  layers: [
    {
      id: 'osm',
      name: 'OpenStreetMap',
      type: 'tile',
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      visible: true
    }
  ]
};
```

### 数据可视化
```typescript
import { StyledFeatureCollection, Style } from 'geo-types-cz';

const heatmapStyle: Style = {
  fill: {
    color: 'rgba(255, 0, 0, 0.6)'
  },
  marker: {
    size: 8,
    color: '#ff0000'
  }
};
```

### 空间分析
```typescript
import { SpatialQuery, AttributeQuery } from 'geo-types-cz';

const spatialQuery: SpatialQuery = {
  type: 'intersects',
  geometry: polygon,
  buffer: 1000
};

const attributeQuery: AttributeQuery = {
  field: 'population',
  operator: '>',
  value: 100000
};
```

## 兼容性

- TypeScript 4.0+
- Node.js 14+
- 现代浏览器 (ES2020+)

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 更新日志

### 1.0.0
- 初始版本发布
- 完整的 GeoJSON 类型支持
- 扩展的 GIS 类型定义
- 常用工具函数
- 中国坐标系支持