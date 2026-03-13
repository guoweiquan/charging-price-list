<template>
	<view class="container">
		<view class="bg-layer"></view>
		<view class="bg-glow bg-glow-top"></view>
		<view class="bg-glow bg-glow-bottom"></view>

		<view class="content-wrapper">
			<view class="header-block">
				<text class="title-company">浙江中税企业管理有限公司</text>
				<text class="title-main">收费价目表</text>
				<view class="logo-wrapper">
					<image class="logo-banner" src="/static/images/logo.png" mode="widthFix"></image>

				</view>
			</view>

			<view class="menu-list">
				<view
					v-for="(item, index) in menuList"
					:key="index"
					class="menu-item"
					hover-class="menu-item-hover"
					@click="goToDetail(item.id)"
				>
					<view class="item-left">
						<view class="item-icon-wrap">
							<text class="item-icon">{{ item.icon }}</text>
						</view>
						<view class="item-content">
							<text class="menu-text">{{ item.category }}</text>
							<text class="menu-subtext">{{ item.subtitle }}</text>
						</view>
					</view>
					<text class="arrow-icon">›</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { computed } from 'vue';
	import { priceList } from '../../common/data.js';

	const subtitleMap = {
		yiban: '适用于一般纳税人企业',
		xiaoguimo: '适用于小规模纳税人',
		guishang: '规模以上企业专属',
		gaoxin: '高新技术企业认定',
		chukou: '进出口退税申报',
		kaipiao: '发票开具服务',
		mianfei: '免费配套服务项目'
	};

	const iconMap = {
		yiban: '📄',
		xiaoguimo: '📦',
		guishang: '🏭',
		gaoxin: '🚀',
		chukou: '🌐',
		kaipiao: '🧾',
		mianfei: '🎁'
	};

	const menuList = computed(() =>
		priceList.map((item) => ({
			...item,
			subtitle: subtitleMap[item.id] || '点击查看收费详情',
			icon: iconMap[item.id] || '📌'
		}))
	);

	const goToDetail = (id) => {
		uni.navigateTo({
			url: `/pages/detail/detail?id=${id}`
		});
	};
</script>

<style scoped>
	.container {
		position: relative;
		min-height: 100vh;
		width: 100%;
		overflow-y: auto;
		background: linear-gradient(180deg, #0a1628 0%, #0d2137 30%, #0f2b4a 100%);
	}

	.bg-layer,
	.bg-glow {
		position: absolute;
		pointer-events: none;
	}

	.bg-layer {
		inset: 0;
		background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0) 25%, rgba(255, 255, 255, 0.03) 100%);
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
		top: 80rpx;
		background: rgba(64, 150, 255, 0.15);
	}

	.bg-glow-bottom {
		width: 420rpx;
		height: 420rpx;
		left: -180rpx;
		bottom: 120rpx;
		background: rgba(22, 119, 255, 0.05);
	}

	.content-wrapper {
		position: relative;
		z-index: 1;
		padding: 28rpx 30rpx 44rpx;
		padding-top: calc(var(--status-bar-height) + 24rpx);
	}

	.header-block {
		padding: 22rpx 0rpx 26rpx;
		text-align: center;
		margin-bottom: 28rpx;
		background: transparent;
	}

	.title-company {
		display: block;
		font-size: 40rpx;
		font-weight: 700;
		color: #ffffff;
		letter-spacing: 2rpx;
		text-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.5);
		margin-bottom: 12rpx;
	}

	.title-main {
		display: block;
		font-size: 56rpx;
		font-weight: 800;
		line-height: 1.18;
		background: linear-gradient(90deg, #fff, #a8d4ff);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		letter-spacing: 3rpx;
		margin-bottom: 24rpx;
	}

	.logo-wrapper {
		margin: 0 auto;
		border-radius: 75rpx;
		overflow: hidden ;
		background: #0d2137 ;
	}





	.logo-banner {
		display: block;
		width: 100%;
		margin: 0 auto;
	}


	.menu-list {
		display: flex;
		flex-direction: column;
		gap: 18rpx;
		padding: 0 10rpx;
	}

	.menu-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 32rpx;
		border-radius: 24rpx;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.06);
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.menu-item-hover {
		background: rgba(255, 255, 255, 0.08);
		transform: translateX(4px);
	}

	.item-left {
		display: flex;
		align-items: center;
		gap: 24rpx;
		min-width: 0;
	}

	.item-icon-wrap {
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(64, 150, 255, 0.12);
	}

	.item-icon {
		font-size: 40rpx;
	}

	.item-content {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		min-width: 0;
	}

	.menu-text {
		font-size: 32rpx;
		font-weight: 500;
		color: #ffffff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.menu-subtext {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.35);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.arrow-icon {
		font-size: 36rpx;
		line-height: 1;
		color: rgba(255, 255, 255, 0.2);
		margin-left: 14rpx;
	}
</style>


