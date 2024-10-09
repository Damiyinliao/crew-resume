export default {
  plugins: {
    // 使用 cnjm-postcss-px-to-viewport 规避 postcss.plugin was deprecated 警告
    "cnjm-postcss-px-to-viewport": {
      viewportWidth: 750, // 根据设计稿设定
      unitPrecision: 6, // 转化精度，转换后保留位数
      viewportUnit: "vw", // 转换后的单位
      fontViewportUnit: "vw", // 字体单位
      unitToConvert: "px", // 需要转换的单位
      exclude: [/node_modules\/vant/i], // 设置忽略文件，用正则做目录名匹配
    },
    autoprefixer: {
      overrideBrowserslist: ["Android >= 4.0", "iOS >= 7"]
    }
  }
};
