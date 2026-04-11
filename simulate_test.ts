import { PATHS_BY_ROLE, GET_BOARD_MATRIX } from './src/utils/gameLogic';

const matrix = GET_BOARD_MATRIX();
const roles = ['绅士(Blue)', '淑女(Rose)', '骑士(Green)', '精灵(Amber)'];
const laneLetters = ['a', 'b', 'd', 'c']; // 注意：d 对应 Green, c 对应 Amber

console.log('--- 飞行棋路径逻辑仿真报告 ---\n');

PATHS_BY_ROLE.forEach((path, roleId) => {
  console.log(`[检查角色]: ${roles[roleId]}`);
  console.log(`总步数: ${path.length}`);
  
  const start = path[0];
  const goal = path[path.length - 1];
  console.log(`起点坐标: (${start.r}, ${start.c}) -> 矩阵值: ${matrix[start.r][start.c]}`);
  console.log(`终点坐标: (${goal.r}, ${goal.c}) -> 矩阵值: ${matrix[goal.r][goal.c]}`);

  // 寻找切入点
  let switchIndex = -1;
  for (let i = 0; i < path.length; i++) {
    const val = matrix[path[i].r][path[i].c];
    if (val === laneLetters[roleId]) {
      switchIndex = i;
      break;
    }
  }

  if (switchIndex !== -1) {
    const prev = path[switchIndex - 1];
    console.log(`✅ 转场检测: 在第 ${switchIndex} 步成功切入专属航道 '${laneLetters[roleId]}'`);
    console.log(`   切入点前一格坐标: (${prev.r}, ${prev.c}) -> 矩阵值: ${matrix[prev.r][prev.c]}`);
    console.log(`   切入点坐标: (${path[switchIndex].r}, ${path[switchIndex].c})`);
  } else {
    console.log(`❌ 逻辑错误: 未能检测到专属航道切入点！`);
  }

  // 校验是否存在 0
  const hasBlank = path.some(p => matrix[p.r][p.c] === 0);
  console.log(`🈳 空格检测: ${hasBlank ? '❌ 警告：路径中包含 0 区域' : '✅ 正常'}`);
  console.log('---------------------------\n');
});
