export default {
  baseUrl: {
    dev: 'https://dev.bluewaterservice.cn/cloudapi',
    prod: 'https://dev.bluewaterservice.cn/cloudapi',
    // dev: 'https://api.93land.com/cloudapi',
    // prod: 'https://api.93land.com/cloudapi'
  },
  crew: {
    sailor: 'https://whkjout.oss-cn-hangzhou.aliyuncs.com/whImg/sailor%401x.png'
  },
  publicPath: [/^\/public/, /^\/login/],
  anzai: {
    body: 'https://whkjout.oss-cn-hangzhou.aliyuncs.com/whkjout/file/anzai-body-367c12e24da54d2cab5433e33db5c187.png',
    avatarUrl: 'https://whkjout.oss-cn-hangzhou.aliyuncs.com/whImg/anzai-avatar.png',
    popupAnzai: 'https://whkjout.oss-cn-hangzhou.aliyuncs.com/whkjout/file/anzai-popup-9204dc96b78b4d32917813136b4ed023.png'
  },
  unLoginCode: [401, 1009022017, 1010010005], // 表示未登录的code
  pageDefaultTitle: '船员简历'
}
