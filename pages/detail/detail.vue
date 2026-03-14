<template>
	<view class="container">
		<view class="bg-layer"></view>
		<view class="bg-glow bg-glow-top"></view>
		<view class="bg-glow bg-glow-bottom"></view>

		<view class="custom-header">
			<view class="back-btn" @click="goBack">
				<text class="back-icon">‹</text>
			</view>
			<!-- <text class="header-title">{{ pageTitle }}</text>  -->
		</view>

		<scroll-view scroll-y class="page-scroll">
			<view class="hero-card">
				<image class="hero-icon" src="/static/images/logo_mini.png" mode="aspectFill"></image>
				<text class="hero-title">{{ pageTitle }}</text>
				<text class="hero-desc">{{ heroSubtitle }}</text>
			</view>

			<!-- <view class="section-title">
				<view class="section-dot"></view>
				<text>收费标准明细</text>
			</view> -->

			<view class="table-card">
				<view class="table-row table-head">
				<text class="col-name">{{ leftHeaderTitle }}</text>
				<text class="col-price">收费标准</text>
			</view>

				<view
					v-for="(row, index) in displayRows"
					:key="index"
					class="table-row"
					:class="{ playing: currentPlayingIndex === index, played: row.status === 'played' }"
					@click="playItem(index)"
				>
					<text class="col-name">{{ row.name }}</text>
					<text class="col-price" :class="{ 'col-price-wrap-left': shouldWrapLeft(row.price) }">{{ row.price }}</text>
				</view>
			</view>

			<view class="footer-spacer"></view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref, computed, onUnmounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { priceList } from '../../common/data.js';

	const categoryId = ref('');
	const pageTitle = ref('');
	const listItems = ref([]);
	const currentPlayingIndex = ref(-1);

	let audioContext = null;
	let simulateTimer = null;

	const subtitleMap = {
		yiban: '根据企业年开票金额分档收费，透明定价，专业服务',
		xiaoguimo: '小规模企业专属标准，灵活收费，服务清晰',
		guishang: '规上企业专项服务，按业务场景精准报价',
		gaoxin: '高新认定配套服务，聚焦效率与通过率',
		chukou: '出口申报服务，流程规范，保障合规申报',
		kaipiao: '开票服务方案，按企业类型分类收费',
		mianfei: '基础配套服务项目，覆盖企业高频需求'
	};

	const heroSubtitle = computed(() => subtitleMap[categoryId.value] || '企业服务收费明细');

	const leftHeaderTitle = computed(() => {
		const projectIds = ['guishang', 'chukou', 'kaipiao', 'mianfei'];
		return projectIds.includes(categoryId.value) ? '申报项目' : '年开票金额';
	});

	const shouldWrapLeft = (priceText) => categoryId.value === 'mianfei' && String(priceText || '').length > 10;

	const formatPrice = (priceText) => {
		const text = (priceText || '').trim();
		if (!text) return '详询';
		if (text.includes('面议')) return '面议';
		if (/^¥/.test(text)) return text;
		if (/^\d/.test(text)) return `¥${text}`;
		if (/^\d+元/.test(text)) return `¥${text.replace('元', '')}`;
		return text;
	};

	const parseRow = (rawText) => {
		const text = (rawText || '').replace(/：/g, ':').trim();
		const parts = text.split(/[，,]/).map((item) => item.trim()).filter(Boolean);

		let name = text;
		let price = '详询';

		if (parts.length >= 2) {
			name = parts[0].replace(/^年开票金额\s*:?\s*/, '').replace(/间$/, '').trim();
			price = parts.slice(1).join(' / ');
		} else if (/^年开票金额/.test(text)) {
			name = text.replace(/^年开票金额\s*:?\s*/, '').replace(/间$/, '').trim();
		} else {
			const match = text.match(/(\d+(?:\.\d+)?\s*元\/(?:月|年|次)|面议)/);
			if (match) {
				price = match[1];
				name = text.replace(match[1], '').replace(/加/g, '').replace(/[，,]$/, '').trim();
			}
		}

		return {
			name: name || '服务项目',
			price: formatPrice(price)
		};
	};

	const displayRows = computed(() =>
		listItems.value.map((item) => ({
			...parseRow(item.text),
			status: item.status
		}))
	);

	onLoad((options) => {
		if (!options.id) return;
		categoryId.value = options.id;
		const categoryData = priceList.find((c) => c.id === options.id);
		if (!categoryData) return;

		pageTitle.value = categoryData.title || categoryData.category;
		listItems.value = categoryData.items.map((item) => ({
			text: item.text,
			status: 'idle'
		}));
	});

	onUnmounted(() => {
		stopAudio();
	});

	const goBack = () => {
		stopAudio();
		uni.navigateBack();
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
			listItems.value[currentPlayingIndex.value].status = 'idle';
		}
		currentPlayingIndex.value = -1;
		clearAudioContext();
	};

	const markPlayed = (index) => {
		if (listItems.value[index]) {
			listItems.value[index].status = 'played';
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
		listItems.value[index].status = 'playing';

		audioContext = uni.createInnerAudioContext();
		audioContext.src = `/static/audio/${categoryId.value}_${index}.mp3`;

		audioContext.onEnded(() => {
			markPlayed(index);
		});

		audioContext.onError(() => {
			simulatePlayback(index);
		});

		audioContext.play();
	};
</script>


<style scoped>
	.container {
		position: relative;
		min-height: 100vh;
		background: linear-gradient(180deg, #0a1628 0%, #0d2137 30%, #0f2b4a 100%);
		overflow: hidden;
	}

	.bg-layer,
	.bg-glow {
		position: absolute;
		pointer-events: none;
	}

	.bg-layer {
		inset: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.03) 100%);
	}

	.bg-glow {
		filter: blur(40rpx);
		border-radius: 999rpx;
		opacity: 0.75;
	}

	.bg-glow-top {
		width: 360rpx;
		height: 360rpx;
		right: -120rpx;
		top: 100rpx;
		background: rgba(64, 150, 255, 0.16);
	}

	.bg-glow-bottom {
		width: 420rpx;
		height: 420rpx;
		left: -180rpx;
		bottom: 120rpx;
		background: rgba(22, 119, 255, 0.05);
	}

	.custom-header {
		position: relative;
		z-index: 2;
		display: flex;
		align-items: center;
		padding: calc(var(--status-bar-height) + 20rpx) 30rpx 22rpx;
		gap: 14rpx;
	}

	.back-btn {
		width: 64rpx;
		height: 64rpx;
		border-radius: 18rpx;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* .back-icon {
		width: 20rpx;
		height: 20rpx;
		border-left: 4rpx solid #ffffff;
		border-bottom: 4rpx solid #ffffff;
		transform: rotate(45deg);
		margin-left: 6rpx;
	} */
	 .back-icon {
		font-size: 56rpx;
		line-height: 1;
		color: #ffffff;
		font-weight: 900;
		}

	.back-btn {
		-webkit-tap-highlight-color: transparent;
		}



	.header-title {
		flex: 1;
		text-align: center;
		font-size: 34rpx;
		font-weight: 700;
		letter-spacing: 1rpx;
		color: #ffffff;
		margin-right: 78rpx;
	}

	.page-scroll {
		position: relative;
		z-index: 2;
		height: calc(100vh - var(--status-bar-height) - 106rpx);
		padding: 6rpx 30rpx 30rpx;
		box-sizing: border-box;
	}

	.hero-card {
		background: linear-gradient(135deg, rgba(64, 150, 255, 0.18), rgba(22, 119, 255, 0.06));
		border: 1px solid rgba(64, 150, 255, 0.15);
		border-radius: 24rpx;
		padding: 34rpx 30rpx;
		margin-bottom: 30rpx;
	}

	.hero-icon {
		display: block;
		width: 56rpx;
		height: 56rpx;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 10rpx;
	}

	.hero-title {
		display: block;
		font-size: 44rpx;
		font-weight: 800;
		margin-bottom: 10rpx;
		color: #ffffff;
	}

	.hero-desc {
		display: block;
		font-size: 24rpx;
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.72);
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: 10rpx;
		font-size: 30rpx;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 16rpx;
		padding-left: 2rpx;
	}

	.section-dot {
		width: 10rpx;
		height: 10rpx;
		border-radius: 50%;
		background: #4096ff;
	}

	.table-card {
		border-radius: 20rpx;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.045);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.table-row {
		display: flex;
		align-items: stretch;
		padding: 0;
		border-bottom: none;
	}

	.table-row:last-child {
		border-bottom: none;
	}


	.table-head {
		background: rgba(64, 150, 255, 0.08);
	}

	.table-head .col-name,
	.table-head .col-price {
		font-size: 33rpx;
		font-weight: 700;
		color: rgba(255, 255, 255, 0.72);
	}

	.col-name,
	.col-price {
		width: 50%;
		box-sizing: border-box;
		padding: 24rpx 18rpx;
		white-space: normal;
		word-break: break-all;
		overflow-wrap: anywhere;
	}

	.col-name {
		font-size: 30rpx;
		line-height: 1.4;
		font-weight: 600;
		color: #f2f7ff;
	}

	.col-price {
		font-size: 30rpx;
		font-weight: 700;
		line-height: 1.4;
		color: #2f9dff;
		text-align: right;
	}

	.col-price-wrap-left {
		text-align: left;
	}

	.table-row.playing {
		background: rgba(64, 150, 255, 0.08);
	}

	.table-row.played .col-name {
		color: rgba(255, 255, 255, 0.72);
	}

	.table-row.played .col-price {
		color: #7db8ff;
	}

	.footer-spacer {
		height: 46rpx;
	}
</style>
