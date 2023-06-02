// src/utils/Snowflake.ts
/**
 * Snowflake主键生成算法
 * 完整的算法是生成的ID长度为20位
 * 但是由于js最大值9007199254740991，再多就会溢出，再多要特殊处理。
 * 所以这里设置长度为16位id。将数据中心位调小到1位，将服务器位调小到1位，将序列位调小到10位
 * 这意味着最多支持两个数据中心，每个数据中心最多支持两台服务器
 */
export default class idUtils {
  private static twepoch = 0;
  private static workerIdBits = 1;
  private static dataCenterIdBits = 1;
  private static maxWrokerId = -1 ^ (-1 << idUtils.workerIdBits); // 值为：1
  private static maxDataCenterId = -1 ^ (-1 << idUtils.dataCenterIdBits); // 值为：1
  private static sequenceBits = 10;
  private static workerIdShift = idUtils.sequenceBits; // 值为：10
  private static dataCenterIdShift =
    idUtils.sequenceBits + idUtils.workerIdBits; // 值为：11
  // private timestampLeftShift =
  //   idUtils.sequenceBits + idUtils.workerIdBits + idUtils.dataCenterIdBits; // 值为：12
  private static sequenceMask = -1 ^ (-1 << idUtils.sequenceBits); // 值为：4095
  private static lastTimestamp = -1;
  private static workerId = 1; //设置默认值,从环境变量取
  private static dataCenterId = 1;
  private static sequence = 0;

  constructor(_workerId = 0, _dataCenterId = 0, _sequence = 0) {
    if (idUtils.workerId > idUtils.maxWrokerId || idUtils.workerId < 0) {
      throw new Error(
        'config.worker_id must max than 0 and small than maxWrokerId-[' +
          idUtils.maxWrokerId +
          ']',
      );
    }
    if (
      idUtils.dataCenterId > idUtils.maxDataCenterId ||
      idUtils.dataCenterId < 0
    ) {
      throw new Error(
        'config.data_center_id must max than 0 and small than maxDataCenterId-[' +
          idUtils.maxDataCenterId +
          ']',
      );
    }
    idUtils.workerId = _workerId;
    idUtils.dataCenterId = _dataCenterId;
    idUtils.sequence = _sequence;
  }

  private static timeGen = (): number => {
    return Date.now();
  };

  private static tilNextMillis = (lastTimestamp): number => {
    let timestamp = idUtils.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = idUtils.timeGen();
    }
    return timestamp;
  };

  static nextId = (): string => {
    let timestamp: number = idUtils.timeGen();
    if (timestamp < idUtils.lastTimestamp) {
      throw new Error(
        'Clock moved backwards. Refusing to generate id for ' +
          (idUtils.lastTimestamp - timestamp),
      );
    }
    if (idUtils.lastTimestamp === timestamp) {
      idUtils.sequence = (idUtils.sequence + 1) & idUtils.sequenceMask;
      if (idUtils.sequence === 0) {
        timestamp = idUtils.tilNextMillis(idUtils.lastTimestamp);
      }
    } else {
      idUtils.sequence = 0;
    }
    idUtils.lastTimestamp = timestamp;
    // js 最大值 9007199254740991，再多就会溢出
    // 超过 32 位长度，做位运算会溢出，变成负数，所以这里直接做乘法，乘法会扩大存储
    const timestampPos = (timestamp - idUtils.twepoch) * 4096;
    const dataCenterPos = idUtils.dataCenterId << idUtils.dataCenterIdShift;
    const workerPos = idUtils.workerId << idUtils.workerIdShift;
    const id = timestampPos + dataCenterPos + workerPos + idUtils.sequence;
    return id.toString();
  };
}
