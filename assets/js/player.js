// player.js - 视频播放器脚本

document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');
    const muteBtn = document.getElementById('muteBtn');
    const volumeBar = document.getElementById('volumeBar');
    const speedSelect = document.getElementById('speedSelect');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const pipBtn = document.getElementById('pipBtn');
    const screenshotBtn = document.getElementById('screenshotBtn');
    const qualitySelect = document.getElementById('qualitySelect');
    const danmuContainer = document.getElementById('danmuContainer');
    const danmuInput = document.getElementById('danmuInput');
    const sendDanmuBtn = document.getElementById('sendDanmuBtn');
    const danmuColor = document.getElementById('danmuColor');
    const danmuPosition = document.getElementById('danmuPosition');
    const danmuSize = document.getElementById('danmuSize');
    const danmuOpacity = document.getElementById('danmuOpacity');
    const danmuSpeed = document.getElementById('danmuSpeed');
    const playlist = document.getElementById('playlist');

    let danmuList = [];
    let danmuId = 0;

    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // 更新进度条
    function updateProgress() {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.value = percent;
        currentTimeSpan.textContent = formatTime(video.currentTime);
    }

    // 设置进度
    progressBar.addEventListener('input', function() {
        const time = (progressBar.value / 100) * video.duration;
        video.currentTime = time;
    });

    // 播放/暂停
    playPauseBtn.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '⏸️';
        } else {
            video.pause();
            playPauseBtn.textContent = '▶️';
        }
    });

    // 静音
    muteBtn.addEventListener('click', function() {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
    });

    // 音量调节
    volumeBar.addEventListener('input', function() {
        video.volume = volumeBar.value;
        video.muted = false;
        muteBtn.textContent = '🔊';
    });

    // 播放速度
    speedSelect.addEventListener('change', function() {
        video.playbackRate = parseFloat(speedSelect.value);
    });

    // 全屏
    fullscreenBtn.addEventListener('click', function() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            video.requestFullscreen();
        }
    });

    // 画中画
    pipBtn.addEventListener('click', function() {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
        } else {
            video.requestPictureInPicture();
        }
    });

    // 截图
    screenshotBtn.addEventListener('click', function() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // 清晰度切换 (模拟)
    qualitySelect.addEventListener('change', function() {
        // 这里可以切换视频源，但现在只是模拟
        console.log('切换到', qualitySelect.value);
    });

    // 弹幕发送
    sendDanmuBtn.addEventListener('click', function() {
        const text = danmuInput.value.trim();
        if (text) {
            const danmu = {
                id: danmuId++,
                text: text,
                color: danmuColor.value,
                position: danmuPosition.value,
                size: danmuSize.value,
                opacity: danmuOpacity.value,
                speed: danmuSpeed.value,
                time: video.currentTime
            };
            danmuList.push(danmu);
            displayDanmu(danmu);
            danmuInput.value = '';
        }
    });

    // 显示弹幕
    function displayDanmu(danmu) {
        const danmuElement = document.createElement('div');
        danmuElement.className = 'danmu';
        danmuElement.textContent = danmu.text;
        danmuElement.style.color = danmu.color;
        danmuElement.style.fontSize = danmu.size + 'px';
        danmuElement.style.opacity = danmu.opacity;

        if (danmu.position === 'scroll') {
            danmuElement.style.left = '100%';
            danmuElement.style.top = Math.random() * 60 + 20 + '%';
            danmuElement.style.animation = `scrollDanmu ${100 - danmu.speed * 10}s linear forwards`;
            setTimeout(() => {
                danmuElement.remove();
            }, (100 - danmu.speed * 10) * 1000);
        } else {
            danmuElement.style.left = Math.random() * 80 + 10 + '%';
            danmuElement.style.top = danmu.position === 'top' ? '10%' : '80%';
            danmuElement.style.position = 'absolute';
            setTimeout(() => {
                danmuElement.remove();
            }, 5000); // 显示5秒
        }

        danmuContainer.appendChild(danmuElement);
    }

    // 播放列表
    playlist.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const src = e.target.dataset.src;
            video.src = src;
            document.querySelectorAll('#playlist li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');
        }
    });

    // 视频事件
    video.addEventListener('loadedmetadata', function() {
        durationSpan.textContent = formatTime(video.duration);
    });

    video.addEventListener('timeupdate', updateProgress);

    video.addEventListener('play', function() {
        playPauseBtn.textContent = '⏸️';
    });

    video.addEventListener('pause', function() {
        playPauseBtn.textContent = '▶️';
    });

    // 鼠标悬停显示控件
    const videoContainer = document.querySelector('.video-container');
    let controlsTimeout;

    function showControls() {
        videoContainer.classList.add('show-controls');
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            videoContainer.classList.remove('show-controls');
        }, 3000);
    }

    videoContainer.addEventListener('mousemove', showControls);
    videoContainer.addEventListener('mouseenter', showControls);

    // 响应式调整
    window.addEventListener('resize', function() {
        // 可以在这里添加响应式逻辑
    });
});

// 页面切换函数
function showContent(type) {
    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function(section) {
        section.classList.remove('active');
    });
    document.getElementById(type).classList.add('active');
}