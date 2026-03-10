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
    const currentCharIndex = common_vendor.ref(-1);
    let audioContext = null;
    let progressTimer = null;
    common_vendor.onLoad((options) => {
      if (options.id) {
        categoryId.value = options.id;
        const categoryData = common_data.priceList.find((c) => c.id === options.id);
        if (categoryData) {
          pageTitle.value = categoryData.title || categoryData.category;
          listItems.value = categoryData.items.map((item) => ({
            originalText: item.text,
            chars: item.text.split(""),
            status: "idle"
            // idle, playing, played
          }));
        }
      }
    });
    common_vendor.onUnmounted(() => {
      stopAudio();
    });
    const goBack = () => {
      stopAudio();
      common_vendor.index.navigateBack();
    };
    const getCharClass = (itemIndex, charIndex) => {
      const item = listItems.value[itemIndex];
      if (item.status === "played") {
        return "text-orange";
      }
      if (itemIndex === currentPlayingIndex.value) {
        if (charIndex <= currentCharIndex.value) {
          return "text-orange";
        }
        return "text-gold";
      }
      return "text-gold";
    };
    const stopAudio = () => {
      if (audioContext) {
        audioContext.stop();
        audioContext.destroy();
        audioContext = null;
      }
      if (progressTimer) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
      if (currentPlayingIndex.value !== -1) {
        listItems.value[currentPlayingIndex.value].status = "idle";
        currentPlayingIndex.value = -1;
        currentCharIndex.value = -1;
      }
    };
    const playItem = (index) => {
      if (currentPlayingIndex.value === index) {
        stopAudio();
      } else {
        stopAudio();
      }
      currentPlayingIndex.value = index;
      currentCharIndex.value = -1;
      listItems.value[index].status = "playing";
      audioContext = common_vendor.index.createInnerAudioContext();
      const audioSrc = `/static/audio/${categoryId.value}_${index}.mp3`;
      audioContext.src = audioSrc;
      audioContext.onPlay(() => {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:148", "Audio started:", audioSrc);
      });
      audioContext.onTimeUpdate(() => {
        if (!audioContext)
          return;
        const duration = audioContext.duration || 0;
        const currentTime = audioContext.currentTime || 0;
        if (duration > 0) {
          const progress = currentTime / duration;
          const totalChars = listItems.value[index].chars.length;
          const newCharIndex = Math.floor(progress * totalChars);
          if (newCharIndex > currentCharIndex.value) {
            currentCharIndex.value = newCharIndex;
          }
        }
      });
      audioContext.onEnded(() => {
        common_vendor.index.__f__("log", "at pages/detail/detail.vue:168", "Audio ended");
        listItems.value[index].status = "played";
        currentPlayingIndex.value = -1;
        currentCharIndex.value = -1;
        stopAudio();
      });
      audioContext.onError((res) => {
        common_vendor.index.__f__("warn", "at pages/detail/detail.vue:177", "Audio error (file missing?):", res);
        simulatePlayback(index);
      });
      audioContext.play();
    };
    const simulatePlayback = (index) => {
      common_vendor.index.__f__("log", "at pages/detail/detail.vue:187", "Simulating playback...");
      const totalChars = listItems.value[index].chars.length;
      const duration = Math.min(Math.max(totalChars * 200, 2e3), 1e4);
      const interval = duration / totalChars;
      let step = 0;
      progressTimer = setInterval(() => {
        step++;
        currentCharIndex.value = step;
        if (step >= totalChars) {
          listItems.value[index].status = "played";
          currentPlayingIndex.value = -1;
          currentCharIndex.value = -1;
          if (progressTimer)
            clearInterval(progressTimer);
        }
      }, interval);
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(goBack),
        c: common_vendor.t(pageTitle.value),
        d: common_vendor.f(listItems.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.f(item.chars, (char, charIndex, i1) => {
              return {
                a: common_vendor.t(char),
                b: charIndex,
                c: common_vendor.n(getCharClass(index, charIndex))
              };
            }),
            b: currentPlayingIndex.value === index
          }, currentPlayingIndex.value === index ? {} : {}, {
            c: index,
            d: currentPlayingIndex.value === index ? 1 : "",
            e: item.status === "played" ? 1 : "",
            f: common_vendor.o(($event) => playItem(index), index)
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-eca06f3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/detail/detail.js.map
