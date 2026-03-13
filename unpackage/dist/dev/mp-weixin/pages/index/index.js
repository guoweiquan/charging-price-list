"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_data = require("../../common/data.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const subtitleMap = {
      yiban: "适用于一般纳税人企业",
      xiaoguimo: "适用于小规模纳税人",
      guishang: "规模以上企业专属",
      gaoxin: "高新技术企业认定",
      chukou: "进出口退税申报",
      kaipiao: "发票开具服务",
      mianfei: "免费配套服务项目"
    };
    const iconMap = {
      yiban: "📄",
      xiaoguimo: "📦",
      guishang: "🏭",
      gaoxin: "🚀",
      chukou: "🌐",
      kaipiao: "🧾",
      mianfei: "🎁"
    };
    const menuList = common_vendor.computed(
      () => common_data.priceList.map((item) => ({
        ...item,
        subtitle: subtitleMap[item.id] || "点击查看收费详情",
        icon: iconMap[item.id] || "📌"
      }))
    );
    const goToDetail = (id) => {
      common_vendor.index.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.f(menuList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.category),
            c: common_vendor.t(item.subtitle),
            d: index,
            e: common_vendor.o(($event) => goToDetail(item.id), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
