"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const common_data = require("../../common/data.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const categoryId = common_vendor.ref("");
    const pageTitle = common_vendor.ref("");
    const listItems = common_vendor.ref([]);
    const currentPlayingIndex = common_vendor.ref(-1);
    let audioContext = null;
    let simulateTimer = null;
    const subtitleMap = {
      yiban: "根据企业年开票金额分档收费，透明定价，专业服务",
      xiaoguimo: "小规模企业专属标准，灵活收费，服务清晰",
      guishang: "规上企业专项服务，按业务场景精准报价",
      gaoxin: "高新认定配套服务，聚焦效率与通过率",
      chukou: "出口申报服务，流程规范，保障合规申报",
      kaipiao: "开票服务方案，按企业类型分类收费",
      mianfei: "基础配套服务项目，覆盖企业高频需求"
    };
    const heroSubtitle = common_vendor.computed(() => subtitleMap[categoryId.value] || "企业服务收费明细");
    const leftHeaderTitle = common_vendor.computed(() => {
      const projectIds = ["guishang", "chukou", "kaipiao", "mianfei"];
      return projectIds.includes(categoryId.value) ? "申报项目" : "年开票金额";
    });
    const shouldWrapLeft = (priceText) => categoryId.value === "mianfei" && String(priceText || "").length > 10;
    const formatPrice = (priceText) => {
      const text = (priceText || "").trim();
      if (!text)
        return "详询";
      if (text.includes("面议"))
        return "面议";
      if (/^¥/.test(text))
        return text;
      if (/^\d/.test(text))
        return `¥${text}`;
      if (/^\d+元/.test(text))
        return `¥${text.replace("元", "")}`;
      return text;
    };
    const parseRow = (rawText) => {
      const text = (rawText || "").replace(/：/g, ":").trim();
      const parts = text.split(/[，,]/).map((item) => item.trim()).filter(Boolean);
      let name = text;
      let price = "详询";
      if (parts.length >= 2) {
        name = parts[0].replace(/^年开票金额\s*:?\s*/, "").replace(/间$/, "").trim();
        price = parts.slice(1).join(" / ");
      } else if (/^年开票金额/.test(text)) {
        name = text.replace(/^年开票金额\s*:?\s*/, "").replace(/间$/, "").trim();
      } else {
        const match = text.match(/(\d+(?:\.\d+)?\s*元\/(?:月|年|次)|面议)/);
        if (match) {
          price = match[1];
          name = text.replace(match[1], "").replace(/加/g, "").replace(/[，,]$/, "").trim();
        }
      }
      return {
        name: name || "服务项目",
        price: formatPrice(price)
      };
    };
    const displayRows = common_vendor.computed(
      () => listItems.value.map((item) => ({
        ...parseRow(item.text),
        status: item.status
      }))
    );
    common_vendor.onLoad((options) => {
      if (!options.id)
        return;
      categoryId.value = options.id;
      const categoryData = common_data.priceList.find((c) => c.id === options.id);
      if (!categoryData)
        return;
      pageTitle.value = categoryData.title || categoryData.category;
      listItems.value = categoryData.items.map((item) => ({
        text: item.text,
        status: "idle"
      }));
    });
    common_vendor.onUnmounted(() => {
      stopAudio();
    });
    const goBack = () => {
      stopAudio();
      common_vendor.index.navigateBack();
    };
    const clearAudioContext = () => {
      if (audioContext) {
        audioContext.stop();
        audioContext.destroy();
        audioContext = null;
      }
      if (simulateTimer) {
        clearTimeout(simulateTimer);
        simulateTimer = null;
      }
    };
    const stopAudio = () => {
      if (currentPlayingIndex.value !== -1 && listItems.value[currentPlayingIndex.value]) {
        listItems.value[currentPlayingIndex.value].status = "idle";
      }
      currentPlayingIndex.value = -1;
      clearAudioContext();
    };
    const markPlayed = (index) => {
      if (listItems.value[index]) {
        listItems.value[index].status = "played";
      }
      currentPlayingIndex.value = -1;
      clearAudioContext();
    };
    const simulatePlayback = (index) => {
      simulateTimer = setTimeout(() => {
        markPlayed(index);
      }, 1200);
    };
    const playItem = (index) => {
      if (currentPlayingIndex.value === index) {
        stopAudio();
        return;
      }
      stopAudio();
      currentPlayingIndex.value = index;
      listItems.value[index].status = "playing";
      audioContext = common_vendor.index.createInnerAudioContext();
      audioContext.src = `/static/audio/${categoryId.value}_${index}.mp3`;
      audioContext.onEnded(() => {
        markPlayed(index);
      });
      audioContext.onError(() => {
        simulatePlayback(index);
      });
      audioContext.play();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(goBack, "5b"),
        b: common_assets._imports_0$1,
        c: common_vendor.t(pageTitle.value),
        d: common_vendor.t(heroSubtitle.value),
        e: common_vendor.t(leftHeaderTitle.value),
        f: common_vendor.f(displayRows.value, (row, index, i0) => {
          return {
            a: common_vendor.t(row.name),
            b: common_vendor.t(row.price),
            c: shouldWrapLeft(row.price) ? 1 : "",
            d: index,
            e: currentPlayingIndex.value === index ? 1 : "",
            f: row.status === "played" ? 1 : "",
            g: common_vendor.o(($event) => playItem(index), index)
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
