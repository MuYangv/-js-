Page({
    data: {
        pythonCode: `
import tensorflow as tf
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# 加载MNIST数据集
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# 数据预处理：标准化
x_train, x_test = x_train / 255.0, x_test / 255.0

# 创建模型
model = models.Sequential([
    layers.Flatten(input_shape=(28, 28)),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(10, activation='softmax')
])

# 编译模型
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# 训练模型
history = model.fit(x_train, y_train, epochs=5, validation_data=(x_test, y_test))

# 绘制训练结果
def plot_training_history(history):
    acc = history.history['accuracy']
    val_acc = history.history['val_accuracy']
    loss = history.history['loss']
    val_loss = history.history['val_loss']

    epochs = range(1, len(acc) + 1)

    # 绘制图表
    plt.figure(figsize=(12, 4))
    plt.subplot(1, 2, 1)
    plt.plot(epochs, acc, 'bo-', label='训练准确率')
    plt.plot(epochs, val_acc, 'ro-', label='验证准确率')
    plt.title('训练和验证准确率')
    plt.legend()

    plt.subplot(1, 2, 2)
    plt.plot(epochs, loss, 'bo-', label='训练损失')
    plt.plot(epochs, val_loss, 'ro-', label='验证损失')
    plt.title('训练和验证损失')
    plt.legend()

# 调用函数绘制图表
plot_training_history(history)

# 保存图表为文件
plt.savefig('training_history.png')

# 显示图表
plt.show()
`,
        chartUrl: 'https://file.imgcc.cloud/images/2024/10/15/b342aa8000243dc5b941bf819127074b.md.png' // 这里填写图表图片URL
    }
})