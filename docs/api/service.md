# 服务函数

 调用地图服务/API，获取一些常用的服务数据，如地址、距离、方向等。

 ## 获取地址（AMap）

 ### getAddressByGeocoder
 调用高德地图逆地理编码服务，获取指定经纬度的地址。

**参数:**
- `geocoder`: AMap.Geocoder 实例
- `lnglat`: 经纬度坐标 `[经度, 纬度]`

**返回值:**
- 地址（字符串）

**示例:**
 ```typescript
 import { getAddressByGeocoder } from 'geo-types-cz'

 // 创建高德地图逆地理编码服务实例
 const geocoder = new AMap.Geocoder({
   city: '010', // 城市编码，默认：'010'（北京）
 })

 // 调用服务函数获取地址
 getAddressByGeocoder(geocoder, [116.397428, 39.90923])
   .then(address => console.log('地址:', address))
   .catch(error => console.error('获取地址失败:', error))

 ```


