# 更新日志

本项目的所有重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

Copyright (c) 2024 geo-types-cz

## [1.0.0] - 2024-01-XX

### 新增
- 🎉 初始版本发布
- ✅ 完整的 GeoJSON 类型定义（基于 RFC 7946）
  - Point, LineString, Polygon 等基础几何类型
  - Feature 和 FeatureCollection 类型
  - 完整的类型守卫函数
- 🌏 坐标参考系统 (CRS) 支持
  - 常用坐标系预定义（WGS84, Web墨卡托, CGCS2000等）
  - 中国常用坐标系支持（北京54, 西安80）
- 📦 边界框 (BBox) 类型和工具函数
  - 2D/3D 边界框支持
  - 边界框计算和操作函数
- 🎨 扩展的 GIS 类型
  - 样式定义（填充、描边、标记、文本）
  - 图层类型（矢量、栅格、瓦片）
  - 地图配置和视图
  - 空间查询和属性查询
- 🛠️ 实用工具函数
  - 距离计算（Haversine 公式）
  - 方位角计算
  - 目标点计算
  - 线段长度和多边形面积计算
  - 几何简化（Douglas-Peucker 算法）
  - 缓冲区创建
- 📚 完整的文档和使用示例
- 🔧 TypeScript 配置和构建脚本
- 📦 NPM 包配置

### 技术特性
- ✅ 零依赖
- ✅ 完整的 TypeScript 类型安全
- ✅ 支持泛型约束
- ✅ 包含类型守卫函数
- ✅ 提供实用工具函数
- ✅ 支持 ES2020+ 和 Node.js 14+

### 文档
- 📖 详细的 README.md
- 💡 使用示例和最佳实践
- 🔗 API 文档
- 🌍 中文文档支持