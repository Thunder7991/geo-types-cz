import { Position } from "./geometry";
/**
 * @description: 高德地图,逆地理编码（坐标 -> 地址）,获取地址
 * @param {any} geocoder AMap.Geocoder
 * @param {Position} lnglat 经纬度
 * @return {Promise<string>} 地址
 */
export function getAddressByGeocoder(geocoder: any, lnglat: Position) {
  return new Promise((resolve, reject) => {
    // 坐标与地址插件-逆地理编码（坐标 -> 地址）
    geocoder.getAddress(lnglat, function (status:string, result:any) {
      if (status === 'complete' && result.regeocode) {
        let address = '';
        if (result.regeocode.aois.length > 0) {
          address += result.regeocode.aois[0].name;
        } else if (result.regeocode.pois.length > 0) {
          address += result.regeocode.pois[0].name;
        } else if (result.regeocode.roads.length > 0) {
          address += result.regeocode.roads[0].name;
        } else {
          address = result.regeocode.formattedAddress;
        }
        resolve(address);
      } else {
        reject(result);
      }
    });
  });
}