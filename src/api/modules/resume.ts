import { http } from "@/api/service";

export interface ResumeBasicInfo {
  /** 头像 */
  avatar?: string;
  birthday?: number;
  /** 出生地 */
  birthplace?: string;
  /** 中文姓名 */
  chineseName: string;
  /** 联系地址 */
  contactAddress?: string;
  /** 学历 */
  educationLevel?: string;
  /** 邮箱 */
  email?: string;
  /** 英文名 */
  englishName?: string;
  /** 期望岗位 */
  expectedPosition?: string;
  /** 期望薪资，单位：元/月 */
  expectedSalary?: number;
  /** 期望船舶类型 */
  expectedShipType?: string;
  /** 期望工作地点 */
  expectedWorkplace?: string;
  /** 家属手机号 */
  familyMobile?: string;
  /** 家属姓名 */
  familyName?: string;
  /** 家属积分发放等级 */
  familyPointLevel?: number;
  /** 家属关系 */
  familyRelationship?: string;
  /** 毕业学校 */
  graduationSchool?: string;
  /** 身高 */
  height?: number;
  /** 主键 */
  id?: number;
  /** 身份证号 */
  idCardNumber?: string;
  /** 专业 */
  major?: string;
  /** 船员编号 */
  marinerId?: number;
  /** 婚姻状况 */
  maritalStatus?: number;
  /** 手机号 */
  mobilePhone: string;
  /** 国籍 */
  nationality?: string;
  /** QQ */
  qq?: string;
  /** 学年 */
  schoolYear?: number;
  /** skype */
  skype?: string;
  /** 体重 */
  weight?: number;
}

/** 创建船员简历 */
export function createCrewResumeBasic(data: ResumeBasicInfo): Promise<HttpResponse<any>> {
  return http.post("/app-api/crew/mariner-resume/createOrUpdate", data)
}
/** 创建船员简历 */
export function createBasic(data: ResumeBasicInfo) {
  return http.post<number>("/app-api/crew/mariner-resume/create", data)
}

/** 更新船员简历基本信息 */
export function updateBasic(data: ResumeBasicInfo) {
  return http.put<boolean>("/app-api/crew/mariner-resume/update", data);
}

/** 获取船员简历 */
export function getCrewResume(id?: number) {
  return http.get<ResumeBasicInfo>("/app-api/crew/mariner-resume/get", { id })
}

/** 上传图像 */
export function uploadFile(file: any): Promise<HttpResponse<string>> {
  return http.upload(file);
}
