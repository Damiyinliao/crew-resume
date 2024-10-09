import { createApp } from "vue";
import { pinia } from "./store";
// normalize.css
import "normalize.css/normalize.css";
// 全局样式
import "./styles/index.less";
// svg icon
import "virtual:svg-icons-register";
// uno.css
import 'virtual:uno.css';
// 桌面端适配
import '@nutui/touch-emulator';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/image-preview/style';
import { Toast, Dialog } from 'vant';

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(pinia);
app.use(router);

app.use(Toast);
app.use(Dialog);

app.mount("#app");
