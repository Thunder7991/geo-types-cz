/**
 * GeoJSON要素类型定义
 */

import { Geometry, Position } from './geometry';
import { calculateDestination } from './utils';

// 要素类型枚举
export enum FeatureType {
  Feature = 'Feature',
  FeatureCollection = 'FeatureCollection'
}

// 属性类型 - 可以是任意JSON值
export type Properties = { [key: string]: any } | null;

// 要素接口
export interface Feature<G extends Geometry = Geometry, P extends Properties = Properties> {
  type: FeatureType.Feature;
  geometry: G | null;
  properties: P;
  id?: string | number;
  bbox?: [number, number, number, number] | [number, number, number, number, number, number];
}

// 要素集合接口
export interface FeatureCollection<G extends Geometry = Geometry, P extends Properties = Properties> {
  type: FeatureType.FeatureCollection;
  features: Feature<G, P>[];
  bbox?: [number, number, number, number] | [number, number, number, number, number, number];
}

// GeoJSON对象联合类型
export type GeoJSONObject = Geometry | Feature | FeatureCollection;

// 类型守卫函数
export function isFeature(obj: GeoJSONObject): obj is Feature {
  return obj.type === FeatureType.Feature;
}

export function isFeatureCollection(obj: GeoJSONObject): obj is FeatureCollection {
  return obj.type === FeatureType.FeatureCollection;
}

// 工具函数
export function createFeature<G extends Geometry, P extends Properties>(
  geometry: G | null,
  properties: P,
  id?: string | number
): Feature<G, P> {
  const feature: Feature<G, P> = {
    type: FeatureType.Feature,
    geometry,
    properties
  };
  
  if (id !== undefined) {
    feature.id = id;
  }
  
  return feature;
}

export function createFeatureCollection<G extends Geometry, P extends Properties>(
  features: Feature<G, P>[]
): FeatureCollection<G, P> {
  return {
    type: FeatureType.FeatureCollection,
    features
  };
}

// 创建圆形
export function createCircle(center: Position, radius: number, points: number = 36): Position[] {
  const circle: Position[] = []
  for (let i = 0; i < points; i++) {
    const bearing = (360 / points) * i
    const point = calculateDestination(center, radius, bearing)
    circle.push(point)
  }
  circle.push(circle[0]) // 闭合圆形
  return circle
}