import { http } from "@/api/service";

/** 创建证书信息 */
export function createCert(data: CertificateVO) {
  return http.post<number>("/app-api/crew/mariner-certificate/create", data)
}

/** 更新证书信息 */
export function updateCert(data: CertificateVO) {
  return http.put<boolean>("/app-api/crew/mariner-certificate/update", data)
}

/** 批量更新船员证书信息列表 */
export function updateCertMultple(data: MultipleCertificate) {
  return http.put("/app-api/crew/mariner-certificate/update/batch", data)
}

/** 获得证书 */
export function getCertInfo(id: number) {
  return http.get("/app-api/crew/mariner-certificate/get", { id })
}

/** 获得证书分页 */
export function getCertPage(params: PageParams) {
  return http.get<ResData>("/app-api/crew/mariner-certificate/page", params)
}

/** 删除证书信息 */
export function delCert(id: number) {
  return http.delete("/app-api/crew/mariner-certificate/delete", { id })
}

/** 多个船员证书信息合集 */
export interface MultipleCertificate {
  marinerId: number;
  certificates: CertificateVO[]
}

/** 证书信息 */
export interface CertificateVO {
  checkDate?: number;
  expireDate: number;
  /**
   * 证书附件
   */
  fileUrl?: string[];
  /**
   * 主键
   */
  id?: number;
  issueDate: number;
  /**
   * 证书发放地点
   */
  issuePlace?: string;
  /**
   * 船员编号
   */
  marinerId?: number;
  /**
   * 证书名称
   */
  name: string;
  /**
   * 证书编号
   */
  number: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 证书状态
   */
  status?: number;
  /**
   * 证书类型
   */
  type: number;
}