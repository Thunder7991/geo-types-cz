/**
 * geo-types-cz
 * Complete TypeScript type definitions for GeoJSON and extended GIS types
 * 
 * 这个包提供了完整的GeoJSON类型定义以及扩展的GIS类型，
 * 适用于前端地理信息系统开发。
 */

// 导出几何类型
export {
  Position,
  GeometryType,
  BaseGeometry,
  Point,
  LineString,
  Polygon,
  MultiPoint,
  MultiLineString,
  MultiPolygon,
  GeometryCollection,
  Geometry,
  isPoint,
  isLineString,
  isPolygon,
  isMultiPoint,
  isMultiLineString,
  isMultiPolygon,
  isGeometryCollection,
  validateCoordinates,
  validateFeatureGeometry
} from './geometry';

// 导出要素类型
export {
  FeatureType,
  Properties,
  Feature,
  FeatureCollection,
  GeoJSONObject,
  isFeature,
  isFeatureCollection,
  createFeature,
  createFeatureCollection,
  createCircle
} from './feature';

// 导出坐标参考系统类型
export {
  CRSType,
  BaseCRS,
  NamedCRS,
  LinkedCRS,
  CRS,
  CommonCRS,
  isNamedCRS,
  isLinkedCRS,
  createNamedCRS,
  createLinkedCRS
} from './crs';

// 导出边界框类型
export {
  BBox2D,
  BBox3D,
  BBox,
  BoundingBox,
  is2DBBox,
  is3DBBox,
  createBBox2D,
  createBBox3D,
  bboxToObject,
  objectToBBox,
  unionBBox,
  isPositionInBBox,
  getBBoxCenter
} from './bbox';

// 导出扩展类型
export {
  Color,
  Style,
  StyledFeature,
  StyledFeatureCollection,
  LayerType,
  BaseLayer,
  VectorLayer,
  RasterLayer,
  TileLayer,
  Layer,
  MapView,
  MapConfig,
  SpatialQueryType,
  SpatialQuery,
  AttributeQuery,
  Query,
  isVectorLayer,
  isRasterLayer,
  isTileLayer,
  ClusterConfig
} from './extensions';

// 导出工具函数
export {
  degreesToRadians,
  radiansToDegrees,
  calculateDistance,
  calculateBearing,
  calculateDestination,
  calculateLineLength,
  calculatePolygonArea,
  calculateGeometryBBox,
  calculateFeatureCollectionBBox,
  simplifyLineString,
  createBuffer
} from './utils';

// 版本信息
export const VERSION = '1.0.0';

// 默认导出
export default {
  VERSION
};

/**
 * 使用示例：
 * 
 * ```typescript
 * import { 
 *   Point, 
 *   Feature, 
 *   FeatureCollection, 
 *   createFeature, 
 *   calculateDistance 
 * } from 'geo-types-cz';
 * 
 * // 创建点几何
 * const point: Point = {
 *   type: 'Point',
 *   coordinates: [116.3974, 39.9093] // 北京天安门
 * };
 * 
 * // 创建要素
 * const feature = createFeature(point, {
 *   name: '天安门',
 *   city: '北京'
 * });
 * 
 * // 计算两点间距离
 * const distance = calculateDistance(
 *   [116.3974, 39.9093], // 天安门
 *   [121.4737, 31.2304]  // 上海外滩
 * );
 * 
 * console.log(`北京到上海的距离: ${Math.round(distance / 1000)}公里`);
 * ```
 */