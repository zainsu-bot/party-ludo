# Flying Chess - Full Codebase Analysis

本文件是对情侣飞行棋项目架构、逻辑引擎以及数据结构的深度解析。

---

## 1. 数据模型与核心定义 (Data & Types)

### 📄 [src/types/index.ts](file:///f:/flying-chess/party-ludo/src/types/index.ts)
**职责**：项目的“宪法”，定义了全局通用的数据契约。

**核心接口**：
- **Player**: 状态实体，包含物理位置 (`step`)、任务触发计次 (`taskIndex`)、所属角色 (`role`) 和绑定的任务包 (`themeId`)。
- **Theme**: 任务包结构，承载 30-40 条梯度设计的任务。
- **GameState**: 全局视图快照，记录当前视图 (`view`)、轮次 (`turn`)、色子状态 (`isRolling`) 等。
- **TaskEventData**: 节点触发载荷，用于在不同玩家间传递任务文案、图标颜色等。

---

## 2. 词库与内容层 (Content Layer)

### 📄 [src/data/special_tasks.ts](file:///f:/flying-chess/party-ludo/src/data/special_tasks.ts)
**职责**：特殊奖励/特权卡 (`[★]`) 的中央仓库。

**逻辑设计**：
- **角色隔离**：将角色专属特权（如绿主、女主、骑士）进行剥离，便于不同主题包重复引用。
- **模块化注入**：通过扩展运算符，将这些特殊任务动态混入到各个主场景的主题包中，极大减少了代码冗余。

### 📄 [src/data/defaultThemes.ts](file:///f:/flying-chess/party-ludo/src/data/defaultThemes.ts)
**职责**：核心词库主文件。

**重构现状**：
- **梯度化排序**：所有主线任务（Level 1-5）已完成基于 **Stage 1-5** 的亲密度梯度排序。
- **阶段标注**：任务列表中包含 `// 1-4: Stage 1` 等注释，为后续的进度驱动引擎提供索引支持。

---

## 3. 逻辑引擎与工具类 (Engine & Utils)

### 📄 [src/utils/gameLogic.ts](file:///f:/flying-chess/party-ludo/src/utils/gameLogic.ts)
**职责**：几何计算引擎。

**核心逻辑**：
- **BOARD_MATRIX**: 13x13 静态矩阵定义。
- **Path Generator**: `generateRolePath` 根据角色 ID 生成独特的路径。它将公共航道 (`OUTER_LOOP`) 和个人私有路径 (`HOME_STRETCHES`) 按规则拼接。
- **坐标映射**: 提供了棋盘索引与物理坐标 `(r, c)` 的相互转换。

### 📄 [src/hooks/useGameState.ts](file:///f:/flying-chess/party-ludo/src/hooks/useGameState.ts)
**职责**：**项目大脑**。处理所有核心游戏规则。

**关键机制**：
- **分段洗牌算法 (`getBucketShuffledIndex`)**: 桶大小设定为 **4**。确保玩家在每个难度梯度内获得随机性，同时保证总体难度呈现明显的上升曲线。
- **判定中心 (`checkTile`)**: 
    - 处理**物理胜利** (坐标到达中心)。
    - 处理**不期而遇** (索引/坐标碰撞)。
    - 处理**幸运格磁吸** (在当前 Bucket 内精准搜索 `★` 奖励卡)。
- **任务解析 (`resolveTask`)**: 执行接受/拒绝逻辑，并计算拒绝带来的随机后退惩罚。

---

## 4. 视觉表现层 (Visual Layout)

### 📄 [src/components/GameBoard.tsx](file:///f:/flying-chess/party-ludo/src/components/GameBoard.tsx)
**职责**：渲染高品质棋盘。

**技术亮点**：
- **动态辉光**: 使用 Tailwind CSS 结合角色色值实现实时阴影和呼吸灯效果。
- **图标层级**: 根据格子属性动态显示 `⚡`、`★`、`🎁` 等图标。

### 📄 [src/components/Dice.tsx](file:///f:/flying-chess/party-ludo/src/components/Dice.tsx)
**职责**：3D 物理色子交互。

**实现**：CSS `preserve-3d` + 精确的欧拉角变换。

### 📄 [src/App.tsx](file:///f:/flying-chess/party-ludo/src/App.tsx)
**职责**：全局路由管理与 Modal 堆栈控制。

---

## 6. 游戏数值与节奏分析 (Gameplay Math)

### 📄 棋盘格数分布 (56个互动格)
根据物理映射与代码逻辑，单人游戏路径总长度约为 **55-57 步**，分布如下：
- **公共航道 (COMMON_LOOP)**：**48 个格子**（占比约 85%）。
    - **核心奖励格 (🎁)**：5个（索引：[7, 16, 25, 34, 43]）。
    - **边缘奖励格 (★)**：10个（核心档位前后各 1 格）。
    - **标准任务格 (⚡)**：33个。
- **角色专属航道**：
    - **起点衔接段**：1-3 步（取决于角色进入公共圈的位置）。
    - **终点冲刺段 (Home Stretch)**：5 步。
    - **终点**：1 步。

### 📄 触发频率与词库覆盖
- **单人期望停留点**：$56（总格） \div 3.5（色子均值） \approx$ **16 次**触发。
- **词库利用率**：主题包通常包含 **40 条** 任务。
- **节奏矛盾点**：
    - 在现有的 `BUCKET_SIZE = 4` 逻辑下，当玩家走到终点时，系统指针仅指向第 16 条任务。
    - **影响**：词库中后半段（17-40条）的高梯度、高尺度任务（Stage 4-5）在 90% 的对局中无法展露。

### 📄 优化路径：空间驱动
由于公共航道占据了 85% 的时长，必须将该航道划分为**“前、中、后”**三个心理阶段：
- **公共圈前半段** -> 对应 Stage 1-2。
- **公共圈后半段** -> 对应 Stage 3。
- **进入冲刺道 (Home Stretch)** -> **瞬时强制开启 Stage 4-5**，确保“决战阶段”的任务张力达到最高。
