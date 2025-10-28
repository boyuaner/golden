// 全局变量
let particles = [];
let particleSystem;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initParticleBackground();
    initAnimations();
    initEventListeners();
});

// 初始化粒子背景
function initParticleBackground() {
    const sketch = (p) => {
        let particles = [];
        const numParticles = 80;
        
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particleCanvas');
            
            // 创建粒子
            for (let i = 0; i < numParticles; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-0.5, 0.5),
                    vy: p.random(-0.5, 0.5),
                    size: p.random(2, 6),
                    opacity: p.random(0.3, 0.8),
                    color: p.random(['#ffd700', '#ffed4e', '#ffffff', '#8892b0'])
                });
            }
        };
        
        p.draw = () => {
            // 检测是否为移动设备
            const isMobile = p.windowWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            
            if (isMobile) {
                // 移动端：使用透明背景，让CSS渐变显示
                p.clear();
            } else {
                // 桌面端：使用p5.js绘制渐变背景
                p.noStroke();
                const stepSize = Math.max(1, Math.floor(p.height / 200));
                
                for (let i = 0; i <= p.height; i += stepSize) {
                    const t = i / p.height;
                    let r, g, b;
                    
                    if (t <= 0.5) {
                        const localT = t * 2;
                        r = p.lerp(26, 22, localT);
                        g = p.lerp(26, 33, localT);
                        b = p.lerp(46, 62, localT);
                    } else {
                        const localT = (t - 0.5) * 2;
                        r = p.lerp(22, 15, localT);
                        g = p.lerp(33, 52, localT);
                        b = p.lerp(62, 96, localT);
                    }
                    
                    p.fill(r, g, b);
                    p.rect(0, i, p.width, stepSize);
                }
            }
            
            // 更新和绘制粒子
            particles.forEach(particle => {
                // 更新位置
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // 边界检测
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
                
                // 绘制粒子
                p.fill(particle.color + Math.floor(particle.opacity * 255).toString(16));
                p.noStroke();
                p.ellipse(particle.x, particle.y, particle.size);
                
                // 绘制连接线
                particles.forEach(otherParticle => {
                    const distance = p.dist(particle.x, particle.y, otherParticle.x, otherParticle.y);
                    if (distance < 100) {
                        const alpha = p.map(distance, 0, 100, 0.3, 0);
                        p.stroke(255, 255, 255, alpha * 255);
                        p.strokeWeight(0.5);
                        p.line(particle.x, particle.y, otherParticle.x, otherParticle.y);
                    }
                });
            });
        };
        
        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    };
    
    new p5(sketch);
}

// 初始化页面动画
function initAnimations() {
    // 页面加载动画
    anime({
        targets: '.fade-in',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
    
    // 标题发光动画
    anime({
        targets: '.hero-title',
        textShadow: [
            '0 0 10px rgba(255, 215, 0, 0.5)',
            '0 0 20px rgba(255, 215, 0, 0.8)',
            '0 0 10px rgba(255, 215, 0, 0.5)'
        ],
        duration: 2000,
        loop: true,
        direction: 'alternate',
        easing: 'easeInOutSine'
    });
}

// 初始化事件监听器
function initEventListeners() {
    const form = document.getElementById('nameForm');
    const nameInput = document.getElementById('studentName');
    const backBtn = document.getElementById('backBtn');
    const retryBtn = document.getElementById('retryBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // 表单提交事件
    form.addEventListener('submit', handleFormSubmit);
    
    // 输入框焦点动画
    nameInput.addEventListener('focus', () => {
        anime({
            targets: nameInput,
            scale: [1, 1.02],
            duration: 300,
            easing: 'easeOutQuart'
        });
    });
    
    nameInput.addEventListener('blur', () => {
        anime({
            targets: nameInput,
            scale: [1.02, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
    });
    
    // 返回按钮事件
    backBtn.addEventListener('click', resetToInput);
    retryBtn.addEventListener('click', resetToInput);
    
    // 下载按钮事件
    downloadBtn.addEventListener('click', handleDownload);
    
    // 按钮悬停效果
    addButtonHoverEffects();
}

// 添加按钮悬停效果
function addButtonHoverEffects() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuart'
            });
        });
    });
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('studentName');
    const studentName = nameInput.value.trim();
    
    if (!studentName) {
        showInputError('请输入您的姓名');
        return;
    }
    
    if (studentName.length > 20) {
        showInputError('姓名长度不能超过20个字符');
        return;
    }
    
    // 验证姓名格式（只允许中文、英文、数字和常见符号）
    const nameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9·•.\s]+$/;
    if (!nameRegex.test(studentName)) {
        showInputError('请输入有效的姓名格式');
        return;
    }
    
    // 切换到加载状态
    showLoadingState(studentName);
}

// 显示输入错误
function showInputError(message) {
    const nameInput = document.getElementById('studentName');
    
    // 添加错误样式
    nameInput.style.borderColor = '#ff6b6b';
    nameInput.style.boxShadow = '0 0 20px rgba(255, 107, 107, 0.3)';
    
    // 显示错误提示
    showNotification(message, 'error');
    
    // 3秒后恢复
    setTimeout(() => {
        nameInput.style.borderColor = '';
        nameInput.style.boxShadow = '';
    }, 3000);
}

// 显示加载状态
function showLoadingState(studentName) {
    const inputSection = document.getElementById('inputSection');
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');
    
    // 隐藏所有区域
    inputSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    
    // 显示加载区域
    loadingSection.classList.remove('hidden');
    
    // 加载动画
    anime({
        targets: loadingSection,
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 500,
        easing: 'easeOutQuart'
    });
    
    // 模拟加载时间（2-3秒）
    const loadingTime = 2000 + Math.random() * 1000;
    
    setTimeout(() => {
        loadStudentReport(studentName);
    }, loadingTime);
}

// 加载学生报告
function loadStudentReport(studentName, retryCount = 0) {
    const imageUrl = `https://goldencpa.oss-cn-shanghai.aliyuncs.com/${encodeURIComponent(studentName)}.jpg`;
    const resultImage = document.getElementById('resultImage');
    const displayName = document.getElementById('displayName');
    
    console.log(`开始加载图片 (尝试 ${retryCount + 1}/3):`, imageUrl);
    
    // 调试图片URL
    debugImageUrl(imageUrl);
    
    // 设置显示名称
    displayName.textContent = studentName;
    
    // 清除之前的事件监听器
    resultImage.onload = null;
    resultImage.onerror = null;
    
    // 设置超时处理，防止长时间无响应
    const timeout = setTimeout(() => {
        console.log('图片加载超时:', imageUrl);
        if (!resultImage.complete) {
            handleImageLoadFailure(studentName, retryCount);
        }
    }, 10000); // 10秒超时
    
    // 添加图片加载成功事件监听
    resultImage.onload = () => {
        clearTimeout(timeout);
        console.log('图片加载成功:', imageUrl);
        showResultState();
    };
    
    // 添加图片加载失败事件监听
    resultImage.onerror = () => {
        clearTimeout(timeout);
        console.log('图片加载失败:', imageUrl);
        handleImageLoadFailure(studentName, retryCount);
    };
    
    // 直接设置图片源，让浏览器处理加载
    resultImage.src = imageUrl;
}

// 处理图片加载失败
function handleImageLoadFailure(studentName, retryCount) {
    const maxRetries = 2;
    
    if (retryCount < maxRetries) {
        console.log(`图片加载失败，准备重试 (${retryCount + 1}/${maxRetries + 1})`);
        
        // 检查网络状态
        checkNetworkStatus();
        
        // 显示重试提示
        showNotification(`图片加载失败，正在重试... (${retryCount + 1}/${maxRetries + 1})`, 'error');
        
        // 延迟重试
        setTimeout(() => {
            loadStudentReport(studentName, retryCount + 1);
        }, 2000);
    } else {
        console.log('图片加载失败，已达到最大重试次数');
        showErrorState();
    }
}

// 检查网络状态
function checkNetworkStatus() {
    if (!navigator.onLine) {
        console.log('网络连接已断开');
        showNotification('网络连接已断开，请检查网络设置', 'error');
        return false;
    }
    
    // 尝试访问一个简单的资源来测试网络
    fetch('https://goldencpa.oss-cn-shanghai.aliyuncs.com/', { 
        method: 'HEAD',
        mode: 'no-cors'
    }).then(() => {
        console.log('网络连接正常');
    }).catch((error) => {
        console.log('网络连接可能有问题:', error);
        showNotification('网络连接可能有问题，请检查网络设置', 'error');
    });
    
    return true;
}

// 调试函数：检查图片URL是否可访问
function debugImageUrl(imageUrl) {
    console.log('=== 图片URL调试信息 ===');
    console.log('图片URL:', imageUrl);
    console.log('URL编码:', encodeURIComponent(imageUrl));
    
    // 检查URL格式
    try {
        const url = new URL(imageUrl);
        console.log('URL解析成功:', {
            protocol: url.protocol,
            hostname: url.hostname,
            pathname: url.pathname
        });
    } catch (error) {
        console.log('URL解析失败:', error);
    }
    
    // 尝试使用fetch检查资源
    fetch(imageUrl, { 
        method: 'HEAD',
        mode: 'no-cors'
    }).then(() => {
        console.log('图片资源可访问');
    }).catch((error) => {
        console.log('图片资源不可访问:', error);
    });
}

// 显示结果状态
function showResultState() {
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    
    loadingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    
    // 结果页面动画
    anime({
        targets: resultSection,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    // 图片动画 - 透明度渐变
    anime({
        targets: '#resultImage',
        opacity: [0.7, 1],
        duration: 500,
        delay: 300,
        easing: 'easeOutQuart'
    });
    
    // 图片动画完成，不显示成功提示
}

// 显示错误状态
function showErrorState() {
    const loadingSection = document.getElementById('loadingSection');
    const errorSection = document.getElementById('errorSection');
    
    loadingSection.classList.add('hidden');
    errorSection.classList.remove('hidden');
    
    // 错误页面动画
    anime({
        targets: errorSection,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        easing: 'easeOutQuart'
    });
}

// 重置到输入状态
function resetToInput() {
    const inputSection = document.getElementById('inputSection');
    const loadingSection = document.getElementById('loadingSection');
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');
    const nameInput = document.getElementById('studentName');
    
    // 清空输入框
    nameInput.value = '';
    
    // 隐藏所有区域
    loadingSection.classList.add('hidden');
    resultSection.classList.add('hidden');
    errorSection.classList.add('hidden');
    
    // 显示输入区域
    inputSection.classList.remove('hidden');
    
    // 输入区域动画
    anime({
        targets: inputSection,
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        easing: 'easeOutQuart'
    });
    
    // 聚焦到输入框
    setTimeout(() => {
        nameInput.focus();
    }, 600);
}

// 处理图片错误
function handleImageError() {
    const resultImage = document.getElementById('resultImage');
    
    // 显示占位图片或错误提示
    resultImage.style.display = 'none';
    
    // 在图片位置显示错误信息
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message p-8 rounded-2xl';
    errorDiv.innerHTML = `
        <i class="fas fa-image text-4xl mb-4"></i>
        <h3 class="text-xl font-medium mb-2">图片加载失败</h3>
        <p class="text-sm">请检查网络连接或联系教务老师</p>
    `;
    
    resultImage.parentNode.appendChild(errorDiv);
    
    showNotification('图片加载失败，请稍后重试', 'error');
}

// 处理下载功能
function handleDownload() {
    const resultImage = document.getElementById('resultImage');
    const displayName = document.getElementById('displayName').textContent;
    
    if (resultImage.src) {
        // 创建下载链接
        const link = document.createElement('a');
        link.href = resultImage.src;
        link.download = `${displayName}的学习旅程.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('下载已开始', 'success');
    } else {
        showNotification('图片尚未加载完成', 'error');
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 px-6 py-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'success-message' : 
        type === 'error' ? 'error-message' : 
        'glass-card text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' : 
                type === 'error' ? 'fa-exclamation-circle' : 
                'fa-info-circle'
            } mr-3"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 通知动画
    anime({
        targets: notification,
        opacity: [0, 1],
        translateX: [100, 0],
        duration: 400,
        easing: 'easeOutQuart'
    });
    
    // 3秒后自动消失
    setTimeout(() => {
        anime({
            targets: notification,
            opacity: [1, 0],
            translateX: [0, 100],
            duration: 400,
            easing: 'easeInQuart',
            complete: () => {
                notification.remove();
            }
        });
    }, 3000);
}

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // ESC键返回输入状态
    if (e.key === 'Escape') {
        const resultSection = document.getElementById('resultSection');
        const errorSection = document.getElementById('errorSection');
        
        if (!resultSection.classList.contains('hidden') || 
            !errorSection.classList.contains('hidden')) {
            resetToInput();
        }
    }
    
    // Enter键快速提交
    if (e.key === 'Enter') {
        const nameInput = document.getElementById('studentName');
        const inputSection = document.getElementById('inputSection');
        
        if (!inputSection.classList.contains('hidden') && 
            document.activeElement === nameInput) {
            document.getElementById('nameForm').dispatchEvent(new Event('submit'));
        }
    }
});

// 防止页面刷新时丢失状态
window.addEventListener('beforeunload', function() {
    // 清理工作
    const notification = document.querySelector('.notification');
    if (notification) {
        notification.remove();
    }
});

// 响应式处理
window.addEventListener('resize', function() {
    // 重新调整粒子系统
    if (typeof particleSystem !== 'undefined' && particleSystem.windowResized) {
        particleSystem.windowResized();
    }
});