"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_data = require("../../common/data.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const menuList = common_vendor.ref(common_data.priceList);
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
            a: common_vendor.t(item.category),
            b: index,
            c: common_vendor.o(($event) => goToDetail(item.id), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
