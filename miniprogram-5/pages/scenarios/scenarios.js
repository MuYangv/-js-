Page({
    data: {
        logs: [],
        canvasContext: null
    },

    onLoad: function() {
        // 创建 canvas 上下文，用于绘制进化条形图
        const ctx = wx.createCanvasContext('aiCanvas', this);
        this.setData({
            canvasContext: ctx
        });
    },

    startEvolution: function() {
        const that = this;
        const ctx = this.data.canvasContext;

        // 请求后端 API 获取 AI 进化数据
        wx.request({
            url: 'http://192.168.8.1:3000/api/evolution', // 请确保后端可以被小程序访问
            method: 'GET',
            success(res) {
                const data = res.data;
                that.logMessage('进化开始...');
                that.drawEvolution(data.generation, data.progress);
            },
            fail() {
                that.logMessage('连接服务器失败。');
            }
        });
    },

    // 清空进化数据的函数
    clearEvolution: function() {
        const that = this;

        // 发送 DELETE 请求清空进化数据
        wx.request({
            url: 'http://192.168.8.1:3000/api/evolution', // 请确保后端可以被小程序访问
            method: 'DELETE',
            success(res) {
                const data = res.data;
                that.logMessage(data.message); // 记录清空成功的消息
                that.drawEvolution(data.generation, data.progress); // 重新绘制进化条形图
            },
            fail() {
                that.logMessage('清空进化数据失败。');
            }
        });
    },

    logMessage: function(message) {
        // 添加日志信息并更新到页面
        const logs = this.data.logs;
        logs.push(message);
        this.setData({
            logs: logs
        });
    },

    drawEvolution: function(generation, progress) {
        const ctx = this.data.canvasContext;
        const width = 375; // canvas 的宽度，需根据实际情况调整
        const height = 400; // canvas 的高度
        const barWidth = width / generation; // 根据进化代数确定每个进化条的宽度

        // 清除之前的画布内容
        ctx.clearRect(0, 0, width, height);

        // 设置进化条的颜色
        ctx.setFillStyle('#61dafb');

        // 绘制每一代的进化条
        for (let i = 0; i < generation; i++) {
            const barHeight = progress[i] * height; // 根据进度确定条形图的高度
            ctx.fillRect(i * barWidth, height - barHeight, barWidth - 5, barHeight); // 绘制矩形作为进化条
        }

        // 将绘制内容渲染到画布上
        ctx.draw();
    }
});