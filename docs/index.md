---
layout: home

hero:
  name: "geo-types-cz"
  text: "TypeScript GeoJSON 类型定义包"
  tagline: "🌍 专为前端 GIS 开发设计的完整类型定义"
  image:
    src: /logo.svg
    alt: geo-types-cz
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: API 文档
      link: /api/
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/Thunder7991/geo-types-cz

features:
  - icon: 🎯
    title: TypeScript 优先
    details: 提供完整的类型安全，支持泛型约束和类型守卫，让你的 GIS 开发更加可靠。
  - icon: 📦
    title: 零依赖
    details: 轻量级设计，无外部依赖，可以安全地集成到任何项目中。
  - icon: 🌍
    title: 完整的 GeoJSON 支持
    details: 基于 RFC 7946 标准，支持所有 GeoJSON 几何类型和要素类型。
  - icon: 🛠️
    title: 实用工具函数
    details: 内置常用的地理计算函数，包括距离计算、方位角、面积计算等。
  - icon: 🎨
    title: 扩展功能
    details: 提供样式、图层、查询等 GIS 扩展类型，满足复杂的前端地图应用需求。
  - icon: 🌏
    title: 中文友好
    details: 支持中国常用坐标系（CGCS2000、北京54、西安80），完整的中文文档。
---

## 快速预览

```typescript
import { 
  Point, 
  Feature, 
  createFeature, 
  calculateDistance 
} from 'geo-types-cz'

// 创建点几何
const point: Point = {
  type: 'Point',
  coordinates: [116.3974, 39.9093] // 北京天安门
}

// 创建要素
const feature = createFeature(point, {
  name: '天安门',
  city: '北京'
})

// 计算两点间距离
const distance = calculateDistance(
  [116.3974, 39.9093], // 天安门
  [121.4737, 31.2304]  // 上海外滩
)

console.log(`距离: ${Math.round(distance / 1000)}公里`)
```

## 为什么选择 geo-types-cz？

### 🚀 开发效率

完整的 TypeScript 类型定义让你在编写 GIS 应用时享受智能提示和类型检查，大大提高开发效率。

### 🔒 类型安全

严格的类型约束帮助你在编译时发现潜在问题，避免运行时错误。

### 📚 丰富的功能

不仅提供标准的 GeoJSON 类型，还扩展了样式、图层、查询等实用功能。

### 🌐 国际化支持

特别针对中国用户优化，支持常用的中国坐标系和完整的中文文档。

## 立即开始

```bash
npm install geo-types-cz
```

[查看完整安装指南 →](/guide/installation)

## 社区

- [GitHub Issues](https://github.com/Thunder7991/geo-types-cz/issues) - 报告问题或提出建议
- [GitHub Discussions](https://github.com/Thunder7991/geo-types-cz/discussions) - 社区讨论
- [NPM](https://www.npmjs.com/package/geo-types-cz) - 包管理