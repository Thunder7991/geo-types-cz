/**
 * GIS工具函数
 * 提供常用的地理计算和操作函数
 */

import { Position, Geometry, Point, LineString, Polygon, GeometryType } from './geometry';
import { Feature, FeatureCollection } from './feature';
import { BBox, createBBox2D } from './bbox';
import inside from 'point-in-polygon-hao'

// 地球半径（米）
const EARTH_RADIUS = 6378137;


// 角度转弧度
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// 弧度转角度
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

// 计算两点间的距离（米）- 使用Haversine公式
export function calculateDistance(pos1: Position, pos2: Position): number {
  const [lon1, lat1] = pos1;
  const [lon2, lat2] = pos2;
  
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return EARTH_RADIUS * c;
}

// 计算方位角（度）
export function calculateBearing(pos1: Position, pos2: Position): number {
  const [lon1, lat1] = pos1;
  const [lon2, lat2] = pos2;
  
  const dLon = degreesToRadians(lon2 - lon1);
  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  
  return (radiansToDegrees(bearing) + 360) % 360;
}

// 根据起点、距离和方位角计算终点
export function calculateDestination(
  start: Position,
  distance: number,
  bearing: number
): Position {
  const [lon, lat] = start;
  const bearingRad = degreesToRadians(bearing);
  const latRad = degreesToRadians(lat);
  const lonRad = degreesToRadians(lon);
  
  const angularDistance = distance / EARTH_RADIUS;
  
  const destLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) +
    Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );
  
  const destLonRad = lonRad + Math.atan2(
    Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
    Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(destLatRad)
  );
  
  return [radiansToDegrees(destLonRad), radiansToDegrees(destLatRad)];
}

// 计算线段长度
export function calculateLineLength(lineString: LineString): number {
  let totalLength = 0;
  const coordinates = lineString.coordinates;
  
  for (let i = 1; i < coordinates.length; i++) {
    totalLength += calculateDistance(coordinates[i - 1], coordinates[i]);
  }
  
  return totalLength;
}

// 计算多边形面积（平方米）- 使用球面三角形公式
export function calculatePolygonArea(polygon: Polygon): number {
  const coordinates = polygon.coordinates[0]; // 外环
  let area = 0;
  
  if (coordinates.length < 3) return 0;
  
  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];
    
    area += degreesToRadians(p2[0] - p1[0]) * 
      (2 + Math.sin(degreesToRadians(p1[1])) + Math.sin(degreesToRadians(p2[1])));
  }
  
  area = Math.abs(area * EARTH_RADIUS * EARTH_RADIUS / 2);
  
  return area;
}

// 计算几何对象的边界框
export function calculateGeometryBBox(geometry: Geometry): BBox {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  
  function processPosition(pos: Position) {
    const [lon, lat] = pos;
    minLon = Math.min(minLon, lon);
    minLat = Math.min(minLat, lat);
    maxLon = Math.max(maxLon, lon);
    maxLat = Math.max(maxLat, lat);
  }
  
  function processCoordinates(coords: any) {
    if (Array.isArray(coords[0])) {
      coords.forEach(processCoordinates);
    } else {
      processPosition(coords as Position);
    }
  }
  
  switch (geometry.type) {
    case 'Point':
      processPosition(geometry.coordinates);
      break;
    case 'LineString':
    case 'MultiPoint':
      geometry.coordinates.forEach(processPosition);
      break;
    case 'Polygon':
    case 'MultiLineString':
      geometry.coordinates.forEach(ring => ring.forEach(processPosition));
      break;
    case 'MultiPolygon':
      geometry.coordinates.forEach(polygon => 
        polygon.forEach(ring => ring.forEach(processPosition))
      );
      break;
    case 'GeometryCollection':
      geometry.geometries.forEach(geom => {
        const bbox = calculateGeometryBBox(geom);
        minLon = Math.min(minLon, bbox[0]);
        minLat = Math.min(minLat, bbox[1]);
        maxLon = Math.max(maxLon, bbox[2]);
        maxLat = Math.max(maxLat, bbox[3]);
      });
      break;
  }
  
  return createBBox2D(minLon, minLat, maxLon, maxLat);
}

// 计算要素集合的边界框
export function calculateFeatureCollectionBBox(featureCollection: FeatureCollection): BBox {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;
  
  featureCollection.features.forEach(feature => {
    if (feature.geometry) {
      const bbox = calculateGeometryBBox(feature.geometry);
      minLon = Math.min(minLon, bbox[0]);
      minLat = Math.min(minLat, bbox[1]);
      maxLon = Math.max(maxLon, bbox[2]);
      maxLat = Math.max(maxLat, bbox[3]);
    }
  });
  
  return createBBox2D(minLon, minLat, maxLon, maxLat);
}

// 简化线段（Douglas-Peucker算法）
export function simplifyLineString(lineString: LineString, tolerance: number): LineString {
  const coordinates = lineString.coordinates;
  
  if (coordinates.length <= 2) {
    return lineString;
  }
  
  function perpendicularDistance(point: Position, lineStart: Position, lineEnd: Position): number {
    const [x, y] = point;
    const [x1, y1] = lineStart;
    const [x2, y2] = lineEnd;
    
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    
    if (lenSq === 0) {
      return Math.sqrt(A * A + B * B);
    }
    
    const param = dot / lenSq;
    
    let xx, yy;
    
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    
    const dx = x - xx;
    const dy = y - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  function douglasPeucker(points: Position[], tolerance: number): Position[] {
    if (points.length <= 2) {
      return points;
    }
    
    let maxDistance = 0;
    let maxIndex = 0;
    
    for (let i = 1; i < points.length - 1; i++) {
      const distance = perpendicularDistance(points[i], points[0], points[points.length - 1]);
      if (distance > maxDistance) {
        maxDistance = distance;
        maxIndex = i;
      }
    }
    
    if (maxDistance > tolerance) {
      const left = douglasPeucker(points.slice(0, maxIndex + 1), tolerance);
      const right = douglasPeucker(points.slice(maxIndex), tolerance);
      
      return left.slice(0, -1).concat(right);
    } else {
      return [points[0], points[points.length - 1]];
    }
  }
  
  const simplified = douglasPeucker(coordinates, tolerance);
  
  return {
    type: lineString.type,
    coordinates: simplified
  };
}

// 创建缓冲区（简单的矩形缓冲区）
export function createBuffer(geometry: Point, distance: number): Polygon {
  const [lon, lat] = geometry.coordinates;
  
  // 简化计算：使用度数作为近似
  const deltaLon = distance / (111320 * Math.cos(degreesToRadians(lat)));
  const deltaLat = distance / 110540;
  
  return {
    type: GeometryType.Polygon,
    coordinates: [[
      [lon - deltaLon, lat - deltaLat],
      [lon + deltaLon, lat - deltaLat],
      [lon + deltaLon, lat + deltaLat],
      [lon - deltaLon, lat + deltaLat],
      [lon - deltaLon, lat - deltaLat]
    ]]
  };
}

/**
 * @description: 判断点是否在多边形内/外/边界上
 * @param {Position} point 点坐标
 * @param {Position[][]} polygon 多边形坐标，格式为[[[lon, lat], [lon, lat], ...]]
 * @return {*} 0: 点在多边形边界上，true: 点在多边形内，false: 点在多边形外
 */
export function isPointInPolygon(point: Position, polygon:Position[][] ): boolean | 0 {
  return inside(point, polygon);
}



