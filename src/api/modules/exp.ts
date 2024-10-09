import { http } from "@/api/service";

/** 添加船员资历 */
export function createExp(data: MarinerExperience) {
  return http.post<number>("/app-api/crew/mariner-experience/create", data)
}

/** 更新船员资历 */
export function updateExp(data: MarinerExperience) {
  return http.put<boolean>("/app-api/crew/mariner-experience/update", data)
}

/** 批量更新船员资历 */
export function updateExpMultiple(data: MultipleMarinerExperience) {
  return http.put("/app-api/crew/mariner-experience/update/batch", data);
}

/** 获得船员资历分页 */
export function getExpPage(params: PageParams) {
  return http.get("/app-api/crew/mariner-experience/page", params)
}

/** 获得船员资历详细信息 */
export function getExpDetail(id: number) {
  return http.get("/app-api/crew/mariner-experience/get", { id })
}

/** 删除资历 */
export function delExp(id: number) {
  return http.get<boolean>("/app-api/crew/mariner-experience/delete", { id })
}

/** 多个船员资历信息合集 */
interface MultipleMarinerExperience {
  marinerId: number;
  experiences: MarinerExperience[]
}

/**
 * MarinerExperience - 船员资历新增/修改 Request VO
 */
export interface MarinerExperience {
  /**
   * 公司名称
   */
  company?: string;
  /**
   * 合同编号
   */
  contractId?: number;
  /**
   * 总吨
   */
  deadWeight?: string;
  endDate: number;
  /**
   * 主键
   */
  id?: number;
  /**
   * 船员编号
   */
  marinerId: number;
  /**
   * 功率
   */
  outputPower?: string;
  /**
   * 职位
   */
  position: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 航区
   */
  shipArea?: string;
  /**
   * 船籍
   */
  shipCountry?: string;
  /**
   * 船舶编号
   */
  shipId?: number;
  /**
   * 船名
   */
  shipName: string;
  /**
   * 船型
   */
  shipType?: string;
  startDate: number;
}