import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Start" },
    children: [
      {
        path: "tools",
        name: "Tools",
        component: () => import("@/views/tools/index.vue"),
        meta: {
          title: 'tool'
        }
      },
      {
        path: "start",
        name: "Start",
        component: () => import("@/views/start/index.vue"),
        meta: {
          title: "开始"
        }
      },
      {
        path: "basic",
        name: "Basic",
        component: () => import("@/views/basic/index.vue"),
        meta: {
          title: "基本信息"
        }
      },
      {
        path: 'certificate',
        name: 'Certificate',
        component: () => import("@/views/certificate/index.vue"),
        meta: {
          title: '证书'
        }
      },
      {
        path: 'record',
        name: 'Record',
        component: () => import("@/views/record/index.vue"),
        meta: {
          title: '服务记录'
        }
      },
      {
        path: 'audit',
        name: 'Audit',
        component: () => import("@/views/audit/index.vue"),
        meta: {
          title: '待审核'
        }
      }
    ]
  }
];

export default routes;
