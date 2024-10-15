const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());

// 模拟的AI进化数据生成
const MAX_PROGRESS = 1.0; // 设置进化进度的上限为10

// 初始化进化进度，范围为0到7
let lastProgress = Array.from({ length: 20 }, () => Math.random() * MAX_PROGRESS * 0.01);

app.get('/api/evolution', (req, res) => {
    const generation = 20; // 假设有20代进化
    // 创建新数组，确保每个数字比上一个大，但数组不递增
    const newProgress = lastProgress.map((value, index) => {
        let newValue;
        do {
            // 生成新值，范围从旧值到MAX_PROGRESS之间
            newValue = value + Math.random() * (MAX_PROGRESS - value) * 0.5; // 限制在旧值和MAX_PROGRESS之间
        } while (newValue <= value || newValue > MAX_PROGRESS); // 确保新值大于旧值且不超过上限
        return newValue;
    });
    lastProgress = newProgress; // 更新最后的进化进度
    res.json({
        generation: generation,
        progress: newProgress
    });
});
// 处理 DELETE 请求以清空进化数据
app.delete('/api/evolution', (req, res) => {
    lastProgress = Array.from({ length: 20 }, () => Math.random() * MAX_PROGRESS * 0.01);
    res.json({
        message: '进化数据已清空并重新初始化。',
        progress: lastProgress
    });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`AI evolution server running at https://localhost:${port}`);
});