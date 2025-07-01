/**
 * 扩展的GIS类型定义
 * 包括样式、符号化、图层等前端GIS开发中常用的类型
 */

import { Feature, FeatureCollection, FeatureType, Properties } from './feature';
import { Geometry } from './geometry';

// 颜色类型
export type Color = string; // CSS颜色值，如 '#ff0000', 'red', 'rgb(255,0,0)'

// 样式类型
export interface Style {
  // 填充样式
  fill?: {
    color?: Color;
    opacity?: number;
  };
  
  // 描边样式
  stroke?: {
    color?: Color;
    width?: number;
    opacity?: number;
    dashArray?: number[];
    lineCap?: 'butt' | 'round' | 'square';
    lineJoin?: 'miter' | 'round' | 'bevel';
  };
  
  // 点样式
  marker?: {
    size?: number;
    color?: Color;
    opacity?: number;
    symbol?: 'circle' | 'square' | 'triangle' | 'star' | 'cross' | 'diamond';
  };
  
  // 文本样式
  text?: {
    field?: string; // 属性字段名
    font?: string;
    size?: number;
    color?: Color;
    haloColor?: Color;
    haloWidth?: number;
    offset?: [number, number];
    anchor?: 'start' | 'middle' | 'end';
    baseline?: 'top' | 'middle' | 'bottom';
  };
}

// 带样式的要素
export interface StyledFeature<G extends Geometry = Geometry, P extends Properties = Properties> extends Feature<G, P> {
  style?: Style;
}

// 带样式的要素集合
export interface StyledFeatureCollection<G extends Geometry = Geometry, P extends Properties = Properties> {
  type: FeatureType.FeatureCollection;
  features: StyledFeature<G, P>[];
  style?: Style; // 默认样式
  bbox?: [number, number, number, number] | [number, number, number, number, number, number];
}

// 图层类型
export enum LayerType {
  Vector = 'vector',
  Raster = 'raster',
  TileLayer = 'tile'
}

// 基础图层接口
export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  visible?: boolean;
  opacity?: number;
  minZoom?: number;
  maxZoom?: number;
  metadata?: { [key: string]: any };
}

// 矢量图层
export interface VectorLayer extends BaseLayer {
  type: LayerType.Vector;
  data: FeatureCollection | StyledFeatureCollection;
  style?: Style;
}

// 栅格图层
export interface RasterLayer extends BaseLayer {
  type: LayerType.Raster;
  url: string;
  bounds?: [number, number, number, number];
}

// 瓦片图层
export interface TileLayer extends BaseLayer {
  type: LayerType.TileLayer;
  url: string; // 瓦片URL模板，如 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
  attribution?: string;
  subdomains?: string[];
}

// 图层联合类型
export type Layer = VectorLayer | RasterLayer | TileLayer;

// 地图视图配置
export interface MapView {
  center: [number, number]; // [longitude, latitude]
  zoom: number;
  bearing?: number; // 地图旋转角度
  pitch?: number; // 地图倾斜角度
  bounds?: [number, number, number, number]; // [west, south, east, north]
}
// 点聚类配置。
 export interface ClusterConfig {
  enabled: boolean
  distance: number
  maxZoom: number
  minPoints?: number
  style?: {
    cluster?: Style
    clusterText?: {
    font?: string
    size?: number
    color?: string
    haloColor?: string
    haloWidth?: number
  }
  }
}

// 地图配置
export interface MapConfig {
  container: string | any; // DOM Element or string selector
  view: MapView;
  layers?: Layer[];
  controls?: {
    zoom?: boolean;
    attribution?: boolean;
    scale?: boolean;
    fullscreen?: boolean;
  };
  interactions?: {
    dragPan?: boolean;
    scrollZoom?: boolean;
    doubleClickZoom?: boolean;
    keyboard?: boolean;
  };
}

// 空间查询类型
export enum SpatialQueryType {
  Intersects = 'intersects',
  Contains = 'contains',
  Within = 'within',
  Touches = 'touches',
  Crosses = 'crosses',
  Overlaps = 'overlaps'
}

// 空间查询接口
export interface SpatialQuery {
  type: SpatialQueryType;
  geometry: Geometry;
  buffer?: number; // 缓冲区距离
}

// 属性查询接口
export interface AttributeQuery {
  field: string;
  operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'like' | 'in' | 'not in';
  value: any;
}

// 复合查询接口
export interface Query {
  spatial?: SpatialQuery;
  attributes?: AttributeQuery[];
  logic?: 'and' | 'or';
}

// 类型守卫函数
export function isVectorLayer(layer: Layer): layer is VectorLayer {
  return layer.type === LayerType.Vector;
}

export function isRasterLayer(layer: Layer): layer is RasterLayer {
  return layer.type === LayerType.Raster;
}

export function isTileLayer(layer: Layer): layer is TileLayer {
  return layer.type === LayerType.TileLayer;
}

// 工具函数
export function createVectorLayer(
  id: string,
  name: string,
  data: FeatureCollection,
  style?: Style
): VectorLayer {
  return {
    id,
    name,
    type: LayerType.Vector,
    data,
    style,
    visible: true,
    opacity: 1
  };
}

export function createTileLayer(
  id: string,
  name: string,
  url: string,
  attribution?: string
): TileLayer {
  return {
    id,
    name,
    type: LayerType.TileLayer,
    url,
    attribution,
    visible: true,
    opacity: 1
  };
}