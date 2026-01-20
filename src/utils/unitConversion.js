
/**
 * 存储单位转换器，自动选择相匹配的单位
 * @param {number} value - 需要转换的数值
 * @param {string} fromUnit - 原始单位 (KB/MB/GB...)
 * @param {number} [precision=2] - 保留小数位数
 * @returns
 */
export function autoConvertStorageUnits(value, fromUnit, precision = 2) {
  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'BB']
  const initialIndex = units.indexOf(fromUnit)

  // 无效单位直接返回原始值
  if (initialIndex === -1) {
    const safePrecision = Math.max(0, Math.min(precision, 20))
    return {
      value: Number(value.toFixed(safePrecision)),
      unit: fromUnit,
    }
  }

  let currentValue = value
  let currentIndex = initialIndex
  const safePrecision = Math.max(0, Math.min(precision, 20))

  // 通过索引增量替代重复查找单位
  while (currentValue >= 1024 && currentIndex < units.length - 1) {
    currentValue /= 1024
    currentIndex++
  }

  return {
    value: Number(currentValue.toFixed(safePrecision)),
    unit: units[currentIndex],
  }
}

/**
 * 货币单位转换器
 * @param {number} value - 需要转换的数值
 * @param {string} fromUnit - 原始单位 (分/角/元/万元/亿元)
 * @param {string} toUnit - 目标单位 (分/角/元/万元/亿元)
 * @param {number} [precision=2] - 保留小数位数
 * @returns {Object} 包含转换后数值和单位的对象
 */
export function convertCurrencyUnits(value, fromUnit, toUnit, precision = 2) {
  const unitRates = {
    分: 0.01,
    角: 0.1,
    元: 1,
    万元: 10000,
    亿元: 100000000,
  }

  // 参数校验
  if (!(fromUnit in unitRates) || !(toUnit in unitRates)) {
    throw new Error('无效的单位，支持的单位：分、角、元、万元、亿元')
  }

  // 转换为元计算
  const valueInYuan = value * unitRates[fromUnit]
  const result = valueInYuan / unitRates[toUnit]

  return {
    value: Number(result.toFixed(precision)),
    unit: toUnit,
  }
}

/**
 * 货币单位自动转换器
 * @param {number} value - 需要转换的数值
 * @param {string} fromUnit - 原始单位 (分/角/元/万元/亿元)
 * @param {number} [precision=2] - 保留小数位数
 * @returns {Object} 包含转换后数值和单位的对象
 */
export function autoConvertCurrencyUnits(value, fromUnit, precision = 2) {
  const unitRates = {
    分: 0.01,
    角: 0.1,
    元: 1,
    万元: 10000,
    亿元: 100000000,
  }

  // 参数校验
  if (!(fromUnit in unitRates)) {
    const safePrecision = Math.max(0, Math.min(precision, 20))
    return {
      value: Number(value.toFixed(safePrecision)),
      unit: fromUnit,
    }
  }

  // 转换为元
  const valueInYuan = value * unitRates[fromUnit]

  // 单位优先级从大到小
  const autoUnits = ['亿元', '万元', '元', '角', '分']
  let suitableUnit = '分'

  for (const unit of autoUnits) {
    const rate = unitRates[unit]
    const convertedValue = valueInYuan / rate
    if (Math.abs(convertedValue) >= 1) {
      suitableUnit = unit
      break
    }
  }

  const result = valueInYuan / unitRates[suitableUnit]
  const safePrecision = Math.max(0, Math.min(precision, 20))

  return {
    value: Number(result.toFixed(safePrecision)),
    unit: suitableUnit,
  }
}
