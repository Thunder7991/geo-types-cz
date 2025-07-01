/**
 * GeoJSON几何类型定义
 * 基于RFC 7946标准
 */

import { isFeature } from "./feature";

// 基础位置类型
export type Position = [number, number] | [number, number, number];

// 几何类型枚举
export enum GeometryType {
  Point = 'Point',
  LineString = 'LineString',
  Polygon = 'Polygon',
  MultiPoint = 'MultiPoint',
  MultiLineString = 'MultiLineString',
  MultiPolygon = 'MultiPolygon',
  GeometryCollection = 'GeometryCollection'
}

// 基础几何接口
export interface BaseGeometry {
  type: GeometryType;
  bbox?: [number, number, number, number] | [number, number, number, number, number, number];
}

// 点几何
export interface Point extends BaseGeometry {
  type: GeometryType.Point;
  coordinates: Position;
}

// 线几何
export interface LineString extends BaseGeometry {
  type: GeometryType.LineString;
  coordinates: Position[];
}

// 多边形几何
export interface Polygon extends BaseGeometry {
  type: GeometryType.Polygon;
  coordinates: Position[][];
}

// 多点几何
export interface MultiPoint extends BaseGeometry {
  type: GeometryType.MultiPoint;
  coordinates: Position[];
}

// 多线几何
export interface MultiLineString extends BaseGeometry {
  type: GeometryType.MultiLineString;
  coordinates: Position[][];
}

// 多多边形几何
export interface MultiPolygon extends BaseGeometry {
  type: GeometryType.MultiPolygon;
  coordinates: Position[][][];
}

// 几何集合
export interface GeometryCollection extends BaseGeometry {
  type: GeometryType.GeometryCollection;
  geometries: Geometry[];
}

// 联合几何类型
export type Geometry = 
  | Point 
  | LineString 
  | Polygon 
  | MultiPoint 
  | MultiLineString 
  | MultiPolygon 
  | GeometryCollection;

// 几何类型守卫函数
export function isPoint(geometry: Geometry): geometry is Point {
  return geometry.type === GeometryType.Point;
}

export function isLineString(geometry: Geometry): geometry is LineString {
  return geometry.type === GeometryType.LineString;
}

export function isPolygon(geometry: Geometry): geometry is Polygon {
  return geometry.type === GeometryType.Polygon;
}

export function isMultiPoint(geometry: Geometry): geometry is MultiPoint {
  return geometry.type === GeometryType.MultiPoint;
}

export function isMultiLineString(geometry: Geometry): geometry is MultiLineString {
  return geometry.type === GeometryType.MultiLineString;
}

export function isMultiPolygon(geometry: Geometry): geometry is MultiPolygon {
  return geometry.type === GeometryType.MultiPolygon;
}

export function isGeometryCollection(geometry: Geometry): geometry is GeometryCollection {
  return geometry.type === GeometryType.GeometryCollection;
}


// 经纬度校验
export function validateCoordinates(coordinates: readonly [number, number]): boolean {
  const [lon, lat] = coordinates
  return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90
}

//集合体验证
export function validateGeometry(geometry: any): boolean {
  if (!geometry || !geometry.type) return false
  
  switch (geometry.type) {
    case 'Point':
      return isPoint(geometry) && validateCoordinates(geometry.coordinates as [number, number])
    case 'LineString':
      return isLineString(geometry) && 
             geometry.coordinates.every((coord: any) => validateCoordinates(coord))
    case 'Polygon':
      return isPolygon(geometry) && 
             geometry.coordinates.every((ring: any) => 
               ring.every((coord: any) => validateCoordinates(coord))
             )
    default:
      return false
  }
}
// 验证要素的几何体
export function validateFeatureGeometry(feature: any): boolean {
  return isFeature(feature) && validateGeometry(feature.geometry)
}
