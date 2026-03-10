<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* Global Styles */
	page {
		font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "HarmonyOS Sans", "Microsoft YaHei", sans-serif;
		background-color: #1a1a1a;
		color: #FFD700;
		line-height: 1.6;
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
	}

	text,
	view {
		-webkit-text-size-adjust: 100%;
		text-size-adjust: 100%;
	}

	/* Text Utilities */
	.text-gold {
		color: #FFD700;
	}
	
	.text-orange {
		color: #FF4500;
	}

	/* Layout Utilities */
	.full-screen-bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	
	.bg-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	/* Glassmorphism Card */
	.glass-card {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(10rpx);
		-webkit-backdrop-filter: blur(10rpx);
		border: 1rpx solid rgba(255, 255, 255, 0.2);
		box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
		border-radius: 16rpx;
	}
</style>
