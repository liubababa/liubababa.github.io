---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: 791af0392b830f43eb31aeb495928785_a330680dad0511f188ac525400dcc5b3
    ReservedCode1: 3MMluKOWsW7K8v0MPgw73skRVNFrX0cdy4mADKzkw5UeK54muphUhKpUDVY0IfdJDmIdmfAvqngnvXl6MkuuMdm17TczSIk6NOT+M+sT27YXNIKCB1DWs2N6KWac/XfDedb1d2sPu1jcMlygzbNyPNhs9mh0UdmN6HvsX92DYG+2keEovjJiAnHgCUM=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: 791af0392b830f43eb31aeb495928785_a330680dad0511f188ac525400dcc5b3
    ReservedCode2: 3MMluKOWsW7K8v0MPgw73skRVNFrX0cdy4mADKzkw5UeK54muphUhKpUDVY0IfdJDmIdmfAvqngnvXl6MkuuMdm17TczSIk6NOT+M+sT27YXNIKCB1DWs2N6KWac/XfDedb1d2sPu1jcMlygzbNyPNhs9mh0UdmN6HvsX92DYG+2keEovjJiAnHgCUM=
---

# 刘一锟 · 作品集网站（tigranz 风格改版）

本目录是参照 [tigranz.com](https://tigranz.com/) 的设计规格，对原作品集站点（`F:\美工-刘一锟-15725977170作品集\liubababa.github.io\`）进行的整体重做版本。**原目录仅被读取，未做任何修改。**

## 一、预览方式

- 直接预览：双击本目录下的 `index.html`
- 推荐方式（避免浏览器对本地字体的限制）：
  ```
  cd 到本目录，执行：python -m http.server 8080
  浏览器打开：http://localhost:8080/
  ```

入口文件：`index.html`

## 二、目录结构

```
tigranz-style-portfolio/
├─ index.html              首页
├─ work-human-x.html       HUMAN-X 机器人系列
├─ work-qi-xiaoman.html    QI XIAOMAN 齐小蔓
├─ work-langya.html        琅琊名士 · 冰箱贴文创
├─ work-anlin.html         安邻 CareNest
├─ work-shanhai.html       山海金选
├─ work-coolermaster.html  酷冷至尊 CoolerMaster
├─ work-myking.html        卖可 MYKING
├─ work-tencent.html       腾讯视频 · 明星直播物料
├─ work-chengqiao.html     程家桥 · 人文生态骑行挑战赛
├─ work-shineyou.html      尚誉 ShineYou · 冻转鲜面包
├─ style.css               全站样式
├─ main.js                 交互脚本
├─ fonts/font-zh.ttf       中文标题字体（原站字魂扁桃体）
└─ assets/images/          全站图片资源（按作品分子目录）
```

## 三、设计规格对照（源自 tigranz.com 实测）

| 项目 | 取值 |
| --- | --- |
| 页面背景 | `#090A0C` |
| 主文字 | `#FFFDFA` |
| 次要文字 | `rgba(255,253,250,.4)` |
| 强调色（hover） | `#BFFF00` |
| 标题字距 | `-0.04em` |
| 大标题字号 | 桌面 clamp 至约 86px，行高 0.9 |
| 区块标题 | 33px / 行高 1.2 |
| 正文 | 20px / 行高 1.4 |
| 内容区宽度 | 1145px（1440 视口下左右各留白约 140px） |
| 导航 | 右上固定透明顶栏，高 72px，全程常驻 |
| 作品列表 | 左标题 + 右纯文字列表，行高 86px，无缩略图 |

## 四、复刻的动效

- 作品列表行 hover：`#BFFF00` 色块自左向右展开填充，文字反色并右移，右侧箭头滚动切换
- 首屏：大号标语 + 底部滚动文字带；下方 Showreel 自动轮播（悬停暂停、圆点与进度线、文案联动）
- 各区块随滚动渐显上移
- 品牌 LOGO 无缝横向滚动
- 已适配系统「减少动态效果」偏好，开启时自动关闭动效

## 五、移动端适配

- 断点：1100px / 860px / 560px
- 窄屏下导航收窄间距、作品列表行高与字号递减、图廊由双列转单列、字号与留白使用 clamp 自适应

## 六、页面区块顺序

首页：Hero 标语 → Showreel 轮播 → 作品列表 → 奖项证书 → 关于（简介 / 教育 / 经历 / 认证）→ 合作品牌 → 页脚联系

作品页：面包屑 + 标题 + 描述 → 大图 / 图片画廊 → 上/下篇导航 → 页脚
*（内容由AI生成，仅供参考）*
