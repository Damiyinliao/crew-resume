// 在船状态
export enum MarinerStatus {
	// 在船上
	onShip = 1,
	// 离开船
	outShip = 2,
}

// 船员状态
export enum CrewmenStatus {
	WAIT = 1, //待派遣
	DISPATCH = 2, //派遣中
	QUIT = 3, //已退出
	UNKNOW = 4,
	DISPATCH_AUTH = 5, //派遣审批中
	WAIT_AUTH = 6, // 解除派遣审批中
	WAIT_AUTH_PASS = 7, // 解除派遣审批通过
}

// 船员状态中文名
export const CrewmenStatusTextMap = new Map([
	[CrewmenStatus.DISPATCH_AUTH, "上船中"],
	[CrewmenStatus.DISPATCH, "已上船"],
	[CrewmenStatus.WAIT, "已下船"],
	[CrewmenStatus.WAIT_AUTH, "下船中"],
]);

// 审批状态
export enum AuthStatus {
	WAIT = "0", //待审批
	AUTH = "1", //审批中
	EDIT = "2", //待修改
	INVALID = "3", //已作废
	END = "4", //已结束
	PAY = "5", //待打款
	WAIT_END = "6", //待结束
}

// 婚姻状态
export enum MaritalStatus {
	Married = 0,
	Single = 1,
}

// 证书类型
export enum Certificate {
	A = 0,
	B = 1,
	C = 2,
	D = 3,
	E = 4,
	F = 5,
	G = 6,
	H = 7,
	I = 8,
	J = 9,
	K = 10,
	AA = 100,
}

// 船员证书类型中文名
export const certificateChineseMap = new Map([
	[Certificate.A, "船员适任证书"],
	[Certificate.B, "船员培训合格证书"],
	[Certificate.C, "船员健康证明"],
	[Certificate.D, "护照"],
	[Certificate.E, "海员证"],
	[Certificate.F, "服务簿"],
	[Certificate.G, "身份证"],
	[Certificate.H, "健康检查证明书（红皮）"],
	// [Certificate.I, "疫苗接种或预防措施国际证书（黄皮）"], // 弃用
	[Certificate.J, "疫苗接种或预防措施国际证书（黄皮）包含黄热疫苗"],
	[Certificate.K, "疫苗接种或预防措施国际证书（黄皮）包含霍乱疫苗"],
]);

// 船舶证书类型中文名
export const certificateBoatChineseMap = new Map([
	[Certificate.AA, "最低配员证书"],
]);

// 海事模块字典
export enum MaritimeDictionaryType {
	MaritimePosition = "maritime_position", // 	海事模块_职位
	MaritimeCrewmenType = "maritime_crewmen_type", // 海事模块_船员_类型
	MaritimePort = "maritime_port", // 海事模块_港口
	MaritimeNationality = "maritime_nationality", // 海事模块_国籍
}

// 合同类型
export enum ContractType {
	Other = 0, // 其他合同
	Dispatch = 1, // 派遣合同
	Labor = 2, // 劳务合同
}

// 船舶派遣类型
export enum DispatchType {
	Long = 1, // 长期船舶
	Short = 2, // 短期船舶
}

export const dispatchTypeChineseMap = new Map<DispatchType | number, string>([
	[DispatchType.Long, "长期"],
	[DispatchType.Short, "航次"],
]);

// 合同附加类型
export enum ContractExtraType {
	DispatchTypeLong = 1, // 长期派遣
	DispatchTypeShort = 2, // 短期派遣
}

// 船员评价来源
export enum EvaluationTypeEnum {
	Platform = 1, // 平台
	Company = 2, // 公司
	Ship = 3, // 船舶
}
