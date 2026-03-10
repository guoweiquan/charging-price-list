<template>
	<view class="container">
		<!-- Background Image -->
		<image class="bg-image full-screen-bg" src="/static/images/浙江中税背景_9比16.jpg" mode="aspectFill"></image>
		
		<!-- Custom Header -->
		<view class="custom-header">
			<view class="back-btn" @click="goBack">
				<!-- Replaced text with icon -->
				<text class="back-icon">❮</text> 
			</view>
			<text class="header-title">{{ pageTitle }}</text>
		</view>

		<!-- Content List -->
		<scroll-view scroll-y="true" class="list-container">
			<view 
				v-for="(item, index) in listItems" 
				:key="index"
				class="list-item glass-card"
				:class="{ 'playing': currentPlayingIndex === index, 'played': item.status === 'played' }"
				@click="playItem(index)"
			>
				<view class="text-content">
					<text 
						v-for="(char, charIndex) in item.chars" 
						:key="charIndex"
						class="char-span"
						:class="getCharClass(index, charIndex)"
					>{{ char }}</text>
				</view>
				
				<!-- Visual Indicator for Audio -->
				<view v-if="currentPlayingIndex === index" class="audio-wave">
					<view class="bar"></view>
					<view class="bar"></view>
					<view class="bar"></view>
				</view>
			</view>
			
			<view class="footer-spacer"></view>
		</scroll-view>
	</view>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { priceList } from '../../common/data.js';

	const categoryId = ref('');
	const pageTitle = ref('');
	const listItems = ref([]);
	
	// Audio State
	const currentPlayingIndex = ref(-1);
	const currentCharIndex = ref(-1);
	let audioContext = null;
	let progressTimer = null;

	onLoad((options) => {
		if (options.id) {
			categoryId.value = options.id;
			const categoryData = priceList.find(c => c.id === options.id);
			if (categoryData) {
				pageTitle.value = categoryData.title || categoryData.category;
				// Pre-process items for character splitting
				listItems.value = categoryData.items.map(item => ({
					originalText: item.text,
					chars: item.text.split(''),
					status: 'idle' // idle, playing, played
				}));
			}
		}
	});

	onUnmounted(() => {
		stopAudio();
	});

	const goBack = () => {
		stopAudio();
		uni.navigateBack();
	};

	const getCharClass = (itemIndex, charIndex) => {
		const item = listItems.value[itemIndex];
		
		if (item.status === 'played') {
			return 'text-orange';
		}
		
		if (itemIndex === currentPlayingIndex.value) {
			if (charIndex <= currentCharIndex.value) {
				return 'text-orange';
			}
			return 'text-gold';
		}
		
		return 'text-gold'; // Default
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
		
		// If something was playing, mark it as idle (or played? User interrupted, so maybe idle)
		if (currentPlayingIndex.value !== -1) {
			// Reset the interrupted item to idle, or keep as is? 
			// Design says "打断/切换", implying new one starts. Old one stops.
			// Let's reset the old one to 'idle' so it can be played again from start.
			// Or mark as 'played'? Usually 'played' means finished.
			listItems.value[currentPlayingIndex.value].status = 'idle'; 
			currentPlayingIndex.value = -1;
			currentCharIndex.value = -1;
		}
	};

	const playItem = (index) => {
		// Stop any current playback
		if (currentPlayingIndex.value === index) {
			// Toggle pause? Or restart? Design says "click to play", usually restart if already playing or ignore?
			// Let's restart.
			stopAudio();
		} else {
			stopAudio();
		}

		currentPlayingIndex.value = index;
		currentCharIndex.value = -1;
		listItems.value[index].status = 'playing';

		// Create Audio Context
		audioContext = uni.createInnerAudioContext();
		// Path strategy: /static/audio/{categoryId}_{index}.mp3 (0-based index)
		// e.g. /static/audio/yiban_0.mp3
		const audioSrc = `/static/audio/${categoryId.value}_${index}.mp3`;
		audioContext.src = audioSrc;
		
		audioContext.onPlay(() => {
			console.log('Audio started:', audioSrc);
		});
		
		audioContext.onTimeUpdate(() => {
			if (!audioContext) return;
			const duration = audioContext.duration || 0;
			const currentTime = audioContext.currentTime || 0;
			
			if (duration > 0) {
				const progress = currentTime / duration;
				const totalChars = listItems.value[index].chars.length;
				// Calculate char index based on progress
				const newCharIndex = Math.floor(progress * totalChars);
				if (newCharIndex > currentCharIndex.value) {
					currentCharIndex.value = newCharIndex;
				}
			}
		});

		audioContext.onEnded(() => {
			console.log('Audio ended');
			// Mark as fully played
			listItems.value[index].status = 'played';
			currentPlayingIndex.value = -1;
			currentCharIndex.value = -1;
			stopAudio(); // Cleanup
		});

		audioContext.onError((res) => {
			console.warn('Audio error (file missing?):', res);
			// Fallback Simulation for Demo
			simulatePlayback(index);
		});

		audioContext.play();
	};

	const simulatePlayback = (index) => {
		// If audio file is missing, simulate the karaoke effect
		console.log('Simulating playback...');
		const totalChars = listItems.value[index].chars.length;
		const duration = Math.min(Math.max(totalChars * 200, 2000), 10000); // 200ms per char, min 2s, max 10s
		const interval = duration / totalChars;
		
		let step = 0;
		progressTimer = setInterval(() => {
			step++;
			currentCharIndex.value = step;
			
			if (step >= totalChars) {
				// Finished
				listItems.value[index].status = 'played';
				currentPlayingIndex.value = -1;
				currentCharIndex.value = -1;
				if (progressTimer) clearInterval(progressTimer);
			}
		}, interval);
	};

</script>

<style scoped>
	.container {
		position: relative;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	/* Header 标题栏内容 */
	.custom-header {
		height: 11.7vw;
		padding-top: calc(var(--status-bar-height) + 35rpx);
		display: flex;
		align-items: center;
		padding-left: 4vw;
		padding-right: 4vw;
		z-index: 10;
	}

	.back-btn {
		display: flex;
		align-items: center;
		padding: 2.6vw;
		justify-content: center;
	}

	.back-icon {
		font-size: 5.83vw;
		color: #FFFFFF;
		text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.8);
		font-weight: bold;
	}

	/* 调整第二层页面标题文字颜色、大小和字体 */
	.header-title {
		flex: 1;
		text-align: center;
		color: #FFD700;
		font-size: 6.28vw;
		font-weight: bold;
		margin-right: 10.6vw;
		text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.8);
		letter-spacing: 1rpx;
	}

	/* List */
	.list-container {
		flex: 1;
		padding: 6vw 4vw 4vw 4vw;
		padding-bottom: 8vw;
	}

	.list-item {
		margin-bottom: 2vw;
		padding: 2.6vw;
		background: transparent;
		border: none;
		box-shadow: none;
		transition: all 0.3s ease;
		position: relative;
		overflow: visible;
	}

	.list-item.playing {
		background: transparent;
		transform: scale(1.02);
		text-shadow: 0 0 20rpx rgba(255, 69, 0, 0.6); /* Glow effect when playing */
	}

	.list-item.played {
		border-color: transparent;
	}

	.text-content {
		font-size: 4.98vw;
		line-height: 1.3;
		word-break: break-all;
		font-weight: 600;
		text-shadow: 0 4rpx 8rpx rgba(0,0,0,0.9);
		color: #FFFFFF;
		letter-spacing: -2rpx;
	}

	.char-span {
		display: inline-block;
		margin-right: -1rpx;
		transition: color 0.1s linear;
	}
	
	/* Colors */
	.text-gold { color: #FFFFFF; } /* Normal text is now white */
	.text-orange { color: #FFD700; } /* Highlight/Played text is Gold/Orange */
	.char-span:last-child { margin-right: 0; }

	/* Audio Wave Animation */
	.audio-wave {
		position: absolute;
		right: 30rpx;
		bottom: 20rpx;
		display: flex;
		gap: 6rpx;
		align-items: flex-end;
		height: 30rpx;
	}

	.bar {
		width: 6rpx;
		background-color: #FFD700; /* Changed to Gold to match highlight */
		animation: wave 1s infinite ease-in-out;
	}

	.bar:nth-child(1) { height: 40%; animation-delay: 0s; }
	.bar:nth-child(2) { height: 80%; animation-delay: 0.2s; }
	.bar:nth-child(3) { height: 60%; animation-delay: 0.4s; }

	@keyframes wave {
		0%, 100% { height: 20%; opacity: 0.5; }
		50% { height: 100%; opacity: 1; }
	}
	
	.footer-spacer {
		height: 100rpx;
	}
</style>
