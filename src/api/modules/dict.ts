import { http } from "../service";

export enum MaritimeDictionaryType {
	MaritimePosition = "maritime_position", // 	海事模块_职位
	MaritimeCrewmenType = "maritime_crewmen_type", // 海事模块_船员_类型
	MaritimePort = "maritime_port", // 海事模块_港口
	MaritimeNationality = "maritime_nationality", // 海事模块_国籍
}

export interface DictType {
	id: number;
	label: string;
	value: string|number;
	dictType: string;
}

export function getDictType(dictName: string) {
  return http.get<DictType[]>("/app-api/system/dict-data/type", { type: dictName })
}