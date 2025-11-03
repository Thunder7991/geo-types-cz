/**
 * 边界框(BBox)类型定义和工具函数
 */

import { GeometryType, Polygon, Position } from './geometry';

// 2D边界框 [west, south, east, north]
export type BBox2D = [number, number, number, number];

// 3D边界框 [west, south, min_elevation, east, north, max_elevation]
export type BBox3D = [number, number, number, number, number, number];

// 边界框联合类型
export type BBox = BBox2D | BBox3D;

// 边界框接口
export interface BoundingBox {
  west: number;
  south: number;
  east: number;
  north: number;
  minElevation?: number;
  maxElevation?: number;
}

// 类型守卫函数
export function is2DBBox(bbox: BBox): bbox is BBox2D {
  return bbox.length === 4;
}

export function is3DBBox(bbox: BBox): bbox is BBox3D {
  return bbox.length === 6;
}

// 工具函数
export function createBBox2D(west: number, south: number, east: number, north: number): BBox2D {
  return [west, south, east, north];
}

export function createBBox3D(
  west: number, 
  south: number, 
  minElevation: number, 
  east: number, 
  north: number, 
  maxElevation: number
): BBox3D {
  return [west, south, minElevation, east, north, maxElevation];
}

// 从边界框数组转换为对象
export function bboxToObject(bbox: BBox): BoundingBox {
  if (is2DBBox(bbox)) {
    return {
      west: bbox[0],
      south: bbox[1],
      east: bbox[2],
      north: bbox[3]
    };
  } else {
    return {
      west: bbox[0],
      south: bbox[1],
      east: bbox[3],
      north: bbox[4],
      minElevation: bbox[2],
      maxElevation: bbox[5]
    };
  }
}
//bbox转换为多边形
export function bboxToPolygon(bbox: BBox): Polygon {
  const [minX, minY, maxX, maxY] = bbox
  return {
    type: GeometryType.Polygon,
    coordinates: [[
      [minX, minY],
      [maxX, minY],
      [maxX, maxY],
      [minX, maxY],
      [minX, minY]
    ]]
  }
}

// 从对象转换为边界框数组
export function objectToBBox(boundingBox: BoundingBox): BBox {
  if (boundingBox.minElevation !== undefined && boundingBox.maxElevation !== undefined) {
    return createBBox3D(
      boundingBox.west,
      boundingBox.south,
      boundingBox.minElevation,
      boundingBox.east,
      boundingBox.north,
      boundingBox.maxElevation
    );
  } else {
    return createBBox2D(
      boundingBox.west,
      boundingBox.south,
      boundingBox.east,
      boundingBox.north
    );
  }
}

// 计算两个边界框的并集
export function unionBBox(bbox1: BBox, bbox2: BBox): BBox {
  const obj1 = bboxToObject(bbox1);
  const obj2 = bboxToObject(bbox2);
  
  const result: BoundingBox = {
    west: Math.min(obj1.west, obj2.west),
    south: Math.min(obj1.south, obj2.south),
    east: Math.max(obj1.east, obj2.east),
    north: Math.max(obj1.north, obj2.north)
  };
  
  if (obj1.minElevation !== undefined && obj2.minElevation !== undefined) {
    result.minElevation = Math.min(obj1.minElevation, obj2.minElevation);
  }
  
  if (obj1.maxElevation !== undefined && obj2.maxElevation !== undefined) {
    result.maxElevation = Math.max(obj1.maxElevation, obj2.maxElevation);
  }
  
  return objectToBBox(result);
}

// 检查点是否在边界框内
export function isPositionInBBox(position: Position, bbox: BBox): boolean {
  const [lon, lat, elevation] = position;
  const obj = bboxToObject(bbox);
  
  const inBounds = lon >= obj.west && lon <= obj.east && lat >= obj.south && lat <= obj.north;
  
  if (elevation !== undefined && obj.minElevation !== undefined && obj.maxElevation !== undefined) {
    return inBounds && elevation >= obj.minElevation && elevation <= obj.maxElevation;
  }
  
  return inBounds;
}

/**
 * @description: 验证bbox（2D）是否符合规范 
 * @param {any} bbox
 * @return {*} boolean
 */
export function validateBBox(bbox: any): bbox is BBox {
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

// 计算边界框的中心点
export function getBBoxCenter(bbox: BBox): Position {
  const obj = bboxToObject(bbox);
  const centerLon = (obj.west + obj.east) / 2;
  const centerLat = (obj.south + obj.north) / 2;
  
  if (obj.minElevation !== undefined && obj.maxElevation !== undefined) {
    const centerElevation = (obj.minElevation + obj.maxElevation) / 2;
    return [centerLon, centerLat, centerElevation];
  }
  
  return [centerLon, centerLat];
}

/**
 * @description: 根据paths计算bbox
 * @param {any} Position[]
 * @return {*}
 */
export function calcGeometryBBox(geometry: Position[]) {
  let minLng = Infinity,
    minLat = Infinity,
    maxLng = -Infinity,
    maxLat = -Infinity;
  for (const [lng, lat] of geometry) {
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  // 适度留白，避免多边形贴边
  const padLng = 0.001;
  const padLat = 0.001;

  minLng = minLng - padLng;
  minLat = minLat - padLat;
  maxLng = maxLng + padLng;
  maxLat = maxLat + padLat;
  return {
    southWest: [minLng, minLat],
    northEast: [maxLng, maxLat],
  };
}