interface ResData {
  list: any[];
  total: number;
}

interface HttpResponse<T = any> {
  code: number;
  data?: T;
  msg?: string;
}

interface PageParams {
  pageNo: number;
  pageSize: number;
}