/**
 * geo-types-cz 使用示例
 * 这个文件演示了如何使用这个TypeScript类型包
 */

const {
  createFeature,
  createFeatureCollection,
  calculateDistance,
  calculateBearing,
  calculateDestination,
  CommonCRS,
  createVectorLayer
} = require('./dist/index.js');

console.log('🌍 geo-types-cz 使用示例\n');

// 1. 创建点几何和要素
const beijingPoint = {
  type: 'Point',
  coordinates: [116.3974, 39.9093] // 北京天安门
};

const shanghaiPoint = {
  type: 'Point', 
  coordinates: [121.4737, 31.2304] // 上海外滩
};

const beijingFeature = createFeature(beijingPoint, {
  name: '天安门',
  city: '北京',
  type: '景点'
});

const shanghaiFeature = createFeature(shanghaiPoint, {
  name: '外滩',
  city: '上海', 
  type: '景点'
});

console.log('✅ 创建要素:');
console.log('北京要素:', JSON.stringify(beijingFeature, null, 2));
console.log();

// 2. 创建要素集合
const featureCollection = createFeatureCollection([beijingFeature, shanghaiFeature]);
console.log('✅ 创建要素集合:');
console.log('要素数量:', featureCollection.features.length);
console.log();

// 3. 地理计算
const distance = calculateDistance(
  beijingPoint.coordinates,
  shanghaiPoint.coordinates
);

const bearing = calculateBearing(
  beijingPoint.coordinates,
  shanghaiPoint.coordinates
);

const destination = calculateDestination(
  beijingPoint.coordinates,
  1000, // 1公里
  90    // 正东方向
);

console.log('✅ 地理计算:');
console.log(`北京到上海的距离: ${Math.round(distance / 1000)}公里`);
console.log(`北京到上海的方位角: ${bearing.toFixed(1)}度`);
console.log(`从天安门向东1公里的位置: [${destination[0].toFixed(6)}, ${destination[1].toFixed(6)}]`);
console.log();

// 4. 坐标参考系统
console.log('✅ 常用坐标参考系统:');
console.log('WGS84:', JSON.stringify(CommonCRS.WGS84, null, 2));
console.log('Web墨卡托:', JSON.stringify(CommonCRS.WebMercator, null, 2));
console.log('中国大地坐标系2000:', JSON.stringify(CommonCRS.CGCS2000, null, 2));
console.log();

// 5. 创建图层
const vectorLayer = createVectorLayer(
  'poi-layer',
  'POI图层',
  featureCollection,
  {
    marker: {
      size: 10,
      color: '#ff0000',
      symbol: 'circle'
    },
    text: {
      field: 'name',
      size: 12,
      color: '#000000'
    }
  }
);

console.log('✅ 创建矢量图层:');
console.log('图层ID:', vectorLayer.id);
console.log('图层名称:', vectorLayer.name);
console.log('图层类型:', vectorLayer.type);
console.log('要素数量:', vectorLayer.data.features.length);
console.log();

console.log('🎉 示例运行完成！');
console.log('\n📚 更多使用方法请参考 README.md 文档');
console.log('🔗 GitHub: https://github.com/Thunder7991/geo-types-cz');
console.log('📦 NPM: https://www.npmjs.com/package/geo-types-cz');