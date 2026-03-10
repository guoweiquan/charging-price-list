<template>
	<view class="container">
		<!-- Background Image -->
		<image class="bg-image full-screen-bg" src="/static/images/浙江中税背景_9比16.jpg" mode="aspectFill"></image>
		
		<!-- Content -->
		<view class="content-wrapper">
			<view class="header">
				<text class="title-company">浙江中税企业管理有限公司</text>
				<text class="title-main">收费价目表</text>
			</view>
			
			<view class="menu-list">
				<view 
					v-for="(item, index) in menuList" 
					:key="index"
					class="menu-item"
					hover-class="menu-item-hover"
					@click="goToDetail(item.id)"
				>
					<text class="menu-text">{{ item.category }}</text>
					<!-- Removed arrow icon -->
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { priceList } from '../../common/data.js';

	const menuList = ref(priceList);

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
	}

	.content-wrapper {
		position: relative;
		z-index: 1;
		padding: 5.3vw;
		padding-top: 13.3vw;
	}

	.header {
		margin-bottom: 8vw;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.title-company {
		font-size: 5.60vw;
		font-weight: 600;
		color: #FFD700;
		margin-bottom: 2.1vw;
		text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.8);
		letter-spacing: 1rpx;
	}

	.title-main {
		font-size: 8.35vw;
		font-weight: bold;
		color: #FFD700;
		text-shadow: 0 4rpx 12rpx rgba(0,0,0,0.9);
		letter-spacing: 2rpx;
	}

	.subtitle {
		font-size: 30.8rpx;
		color: rgba(255, 255, 255, 0.8);
		letter-spacing: 2rpx;
	}

	.menu-list {
		display: flex;
		flex-direction: column;
		gap: 4vw;
		width: fit-content;
		margin: 0 auto;
	}

	.menu-item {
		padding: 2.6vw 0;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		transition: all 0.3s ease;
		border-radius: 20rpx;
		background: transparent;
		border: none;
	}

	.menu-item-hover {
		transform: scale(0.98);
		filter: brightness(1.2);
	}

	.menu-text {
		font-size: 6.51vw;
		font-weight: 600;
		color: #FFFFFF;
		letter-spacing: 2rpx;
		text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.8);
		text-align: left;
		white-space: nowrap;
	}

	.arrow-icon {
		display: none;
	}
</style>
