export interface ApifoxModel {
  /**
   * 业务状态码 10000成功, 其他失败
   */
  code: number;
  /**
   * 响应数据
   */
  data: Data;
  /**
   * 响应消息
   */
  message: string;
  /**
   * 响应状态 true成功, false失败
   */
  success: boolean;
}

/**
 * 响应数据
 */
export interface Data {
  /**
   * 合同待签署总数
   */
  contractSignTotal: number;
  /**
   * 组织总人数
   */
  employeeTotal: number;
  /**
   * 接口总访问数
   */
  interfaceAccessTotal: number;
  /**
   * 公积金申报数据
   */
  providentFund: ProvidentFund;
  /**
   * 正式员工总数
   */
  regularEmployeeTotal: number;
  /**
   * 社保申报数据
   */
  socialInsurance: SocialInsurance;
  /**
   * 本月待转正人数
   */
  toBeConfirmed: number;
  /**
   * 本月待离职人数
   */
  toBeDismissed: number;
  /**
   * 待入职人数
   */
  toBeEmployed: number;
}

/**
 * 公积金申报数据
 */
export interface ProvidentFund {
  /**
   * 分类
   */
  category: string;
  /**
   * 分类类型
   */
  categoryType: string;
  /**
   * 申报人数
   */
  declarationTotal: number;
  /**
   * 已申报人数
   */
  declaredTotal: number;
  /**
   * 申报中人数
   */
  declaringTotal: number;
  /**
   * 待申报人数
   */
  toDeclareTotal: number;
  /**
   * x轴
   */
  xAxis: string[];
  /**
   * y轴
   */
  yAxis: number[];
}

/**
 * 社保申报数据
 */
export interface SocialInsurance {
  /**
   * 分类
   */
  category: string;
  /**
   * 类型
   */
  categoryType: string;
  /**
   * 申报人数
   */
  declarationTotal: number;
  /**
   * 已申报人数
   */
  declaredTotal: number;
  /**
   * 申报中人数
   */
  declaringTotal: number;
  /**
   * 待申报人数
   */
  toDeclareTotal: number;
  /**
   * x轴数据
   */
  xAxis: string[];
  /**
   * y轴
   */
  yAxis: number[];
}
