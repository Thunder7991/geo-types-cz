/**
 * 坐标参考系统(CRS)类型定义
 * 虽然GeoJSON RFC 7946不推荐使用CRS，但在实际GIS应用中仍然重要
 */

// CRS类型枚举
export enum CRSType {
  Name = 'name',
  Link = 'link'
}

// 基础CRS接口
export interface BaseCRS {
  type: CRSType;
}

// 命名CRS
export interface NamedCRS extends BaseCRS {
  type: CRSType.Name;
  properties: {
    name: string;
  };
}

// 链接CRS
export interface LinkedCRS extends BaseCRS {
  type: CRSType.Link;
  properties: {
    href: string;
    type?: string;
  };
}

// CRS联合类型
export type CRS = NamedCRS | LinkedCRS;

// 常用的CRS定义
export const CommonCRS = {
  // WGS84 地理坐标系
  WGS84: {
    type: CRSType.Name,
    properties: {
      name: 'EPSG:4326'
    }
  } as NamedCRS,
  
  // Web墨卡托投影
  WebMercator: {
    type: CRSType.Name,
    properties: {
      name: 'EPSG:3857'
    }
  } as NamedCRS,
  
  // 中国大地坐标系2000
  CGCS2000: {
    type: CRSType.Name,
    properties: {
      name: 'EPSG:4490'
    }
  } as NamedCRS,
  
  // 北京54坐标系
  Beijing54: {
    type: CRSType.Name,
    properties: {
      name: 'EPSG:4214'
    }
  } as NamedCRS,
  
  // 西安80坐标系
  Xian80: {
    type: CRSType.Name,
    properties: {
      name: 'EPSG:4610'
    }
  } as NamedCRS
} as const;

// 类型守卫函数
export function isNamedCRS(crs: CRS): crs is NamedCRS {
  return crs.type === CRSType.Name;
}

export function isLinkedCRS(crs: CRS): crs is LinkedCRS {
  return crs.type === CRSType.Link;
}

// 工具函数
export function createNamedCRS(name: string): NamedCRS {
  return {
    type: CRSType.Name,
    properties: {
      name
    }
  };
}

export function createLinkedCRS(href: string, type?: string): LinkedCRS {
  return {
    type: CRSType.Link,
    properties: {
      href,
      ...(type && { type })
    }
  };
}