import numpy as np
import gym
import matplotlib.pyplot as plt
import matplotlib

matplotlib.rcParams['font.family'] = 'SimHei'  #byd plt的图表不提前改，中文会乱码（我记得以前不这样啊

env = gym.make("CartPole-v1") #创建环境

# 初始化Q表
Q = np.zeros((20, 20, 2))  #离散化状态空间
num_episodes = 100
learning_rate = 0.1
discount_factor = 0.99
epsilon = 1.0
epsilon_decay = 0.995
min_epsilon = 0.1

def discretize(state): #离散化状态
    cart_pos, cart_vel, pole_angle, pole_vel = state
    return (int(np.digitize(cart_pos, bins=np.linspace(-2.4, 2.4, 20)) - 1),
            int(np.digitize(pole_angle, bins=np.linspace(-0.209, 0.209, 20)) - 1))


rewards = [] #记录每个回合的总奖励

#创建图形
plt.figure(figsize=(10, 5))
plt.title('强化学习过程中的奖励变化', fontsize=14)
plt.xlabel('回合', fontsize=12)
plt.ylabel('总奖励', fontsize=12)


for episode in range(num_episodes): #Q-learning算法
    state, _ = env.reset()
    total_reward = 0
    done = False

    while not done:
        # 离散化状态
        state_discrete = discretize(state)
        
        # 选择动作 (epsilon-greedy策略)
        if np.random.rand() < epsilon:
            action = env.action_space.sample()  #探索
        else:
            action = np.argmax(Q[state_discrete])  #利用

        # 执行动作
        next_state, reward, terminated, truncated, info = env.step(action)
        total_reward += reward

        # 离散化下一个状态
        next_state_discrete = discretize(next_state)

        # 更新Q值
        Q[state_discrete][action] += learning_rate * (reward + discount_factor * np.max(Q[next_state_discrete]) - Q[state_discrete][action])

        state = next_state  #更新状态
        done = terminated or truncated  #设置回合结束条件

    rewards.append(total_reward)

    # 在每个回合后更新图表（实现更新的主要办法
    plt.plot(rewards, color='blue')
    plt.xlim(0, num_episodes)  #设置x轴范围
    plt.ylim(0, max(100, max(rewards)))  #设置y轴范围
    plt.pause(0.01)  #暂停以更新图表

    # 衰减epsilon
    if epsilon > min_epsilon:
        epsilon *= epsilon_decay

# 显示最终的奖励曲线
plt.plot(rewards, color='blue')
plt.grid()
plt.show()

# 评估学习后的策略
state, _ = env.reset()
done = False
frames = []

while not done:
    # 自定义可视化
    frames.append(env.render(mode='rgb_array'))
    
    state_discrete = discretize(state)
    action = np.argmax(Q[state_discrete])  #选择最优动作
    next_state, reward, terminated, truncated, info = env.step(action)
    state = next_state  #更新状态
    done = terminated or truncated  #设置回合结束条件

env.close()
