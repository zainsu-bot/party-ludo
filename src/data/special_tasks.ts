/**
 * 基础等级 (Common) 独有/卡
 */
const SWEET_SPECIALS = [
  "[★] 温柔指令：你可以要求对方在接下来的10分钟内，无论做什么都要牵着你的手。",
  "[★] 服务豁免：获得一张免做家务/免罚跑腿的免责券，可随时由对方代劳。",
  "[★] 真话一问：可以向对方提出一个情感问题，对方必须坦诚作答不能撒谎。",
  "[★] 睡前导演：你可以决定今晚上床睡觉时，两人的相拥姿势和谁负责关灯。",
  "[★] 免惩豁免：你可以获得一次抵消后退或者各种惩罚机会的专属免责。",
  "[★] 任性一舞：要求对方为你跳一段只有你能独自欣赏的三十秒搞笑舞蹈。",
  "[★] 绝对静音：你可以封印对方说话的权力两回合，对方只能用表情或手势交流。"
];

const LOVE_SPECIALS = [
  "[★] 触觉剥夺：你可以蒙住对方的眼睛，接下来的三回合内对方只能凭感觉服从。",
  "[★] 特别推拿：要求对方为你进行5分钟的肩颈按摩，力度与位置由你绝对指挥。",
  "[★] 封口令：在接下来的5分钟内，你不允许对方发出任何声音，违规就有小惩罚。",
  "[★] 感官享受：你可以闭上眼，享受对方在你耳边说出三句最露骨肉麻的情话。",
  "[★] 局部统治：你可以指定对方的一个敏感地带，在游戏结束前只有你拥有碰触权。",
  "[★] 贴身服侍：要求对方用亲吻代步，为你完成下一次移动时的掷骰子和走格子。",
  "[★] 王者调配：获得一次直接改变对方惩罚任务判定标准的绝对命令。"
];

const COUPLE_SPECIALS = [
  "[★] 局部统治：你可以指定对方身体的一个核心部位，接下来的游戏里只有你绝对掌控它。",
  "[★] 视听盛宴：要求对方为你表演一段为期1分钟的性感脱衣舞或贴身热舞。",
  "[★] 动作豁免：获得一次随时跳过惩罚任务并安全停留在原本格子的。",
  "[★] 前戏导演：由你来全局规划接下来的前戏阶段走向，对方只能无条件配合。",
  "[★] 敏感地带守护：强制对方今晚对你最敏感的区域不能私自触碰，只能等恩赐。",
  "[★] 口干舌燥：享受对方主动要求的一个深情长吻直到彻底忘情。",
  "[★] 全场停步：强迫对方停留原地两回合，供你仔细近距离全方位感官品鉴。"
];

const INTIMATE_SPECIALS = [
  "[★] 绝对控制：在接下来的三回合内，对方高潮的临界点必须由你来掌握和批准。",
  "[★] 贴身侍奉：要求对方以最诱惑的姿态，贴身为你服务任意一件你想要的事。",
  "[★] 角色反转：获得一次逆转局面的，将自己抽到的危险挑战直接转嫁给对方执行。",
  "[★] 潮水指挥：指定对方现在立刻为你服务极其敏感的部位3分钟，不准停歇。",
  "[★] 姿态控制：指定对方下一个回合必须以某种难堪但充满诱惑的特定姿势前行。",
  "[★] 冰火伺候：要求对方用含着冰块或温水的特殊触感为您进行局部极速刺激。",
  "[★] 深渊赦免：你有权力豁免任何即将到来的深层次挑战，并改罚对方加倍履行。"
];

const ADVANCED_SPECIALS = [
  "[★] 姿态霸权：今晚的主导体位完全由你决定，对方必须绝对服从你的频率和节奏。",
  "[★] 狂热赞美：在最深入的冲刺时，要求对方大声喊出你是他/她遇到过最棒的伴侣。",
  "[★] 终极豁免：获得一次神圣的“免罚金牌”，可以无条件拒绝任何不喜欢的极端挑战。",
  "[★] 完全释放：高潮过后，对方必须为你温柔地清理身体，并提供一杯温水和极致的安全感拥抱。",
  "[★] 快感开关：你可以随意暂停对方的愉悦进程，直到其疯狂求导才能重新许可。",
  "[★] 感官奴隶：享受对方全程只为你服务的极端忘我贡献。",
  "[★] 最高宣示：拥有强制宣发权，今晚的所有快感归属权将强制印记在你的名下。"
];


/**
 * 角色通用 (Cuckold Style) /卡
 */
const SHARED_HUSBAND_SPECIALS = [
  "[★] 摄影导演：移动到最佳视角位置，指挥两人摆出一个主从调情视角。",
  "[★] 余温接管：在这项服侍结束后，你可以亲吻女主刚被绿主深度开发过的地方。",
  "[★] 辅助规划：你可以指定绿主接下来必须重点开发女主的某个部位。",
  "[★] 交流听证：要求绿主为你客观描述他此刻每一次绝对占有的真实感官。",
  "[★] 卑微保险：由于你的绝对服从，获得一次替道侣免罚（免后退步数）的机会。",
  "[★] 臣服宣誓：女主必须当着绿主的面声明，她做的一切都是为了保全你。",
  "[★] 近距离观礼：你可以趴在旁边，近距离观察绿主如何彻底摧毁她的理智。"
];

const SHARED_WIFE_SPECIALS = [
  "[★] 女王时间：由绿主为你进行5分钟的全身感官推拿，丈夫在一旁提供服务。",
  "[★] 指令下达：接下来的三回合内，你可以随时打断任何人的动作并下达新的指令。",
  "[★] 绝对优先：指定丈夫为你做一件极其讨好且丧失尊严的侍奉任务。",
  "[★] 真情魅惑：两个男人必须轮流用最华丽的辞藻夸赞你作为终极渴望的魅力。",
  "[★] 女主特赦：获得一次不需要后退步数且彻底免罚的任务。",
  "[★] 极致温存：同时获得两人的温存亲吻（一吻唇一吻背），持续一分钟。",
  "[★] 归属支配：指定今晚接下来的禁忌时刻中，谁拥有你的最初拥抱权。"
];

const SHARED_BULL_SPECIALS = [
  "[★] 领地宣示：指定女主身上最敏感的禁区，宣布接下来十分钟内部位只属于你。",
  "[★] 降维打击：获得一次免死金牌，随时替她拒绝那些无聊的低级任务。",
  "[★] 霸主礼遇：要求尊贵的心动猎物以最奉献的姿态为你进行全身服侍。",
  "[★] 绝对豁免：命令绿帽丈夫今晚不得合眼，必须全程看你是如何彻底占有她。",
  "[★] 额外考核：对那个可怜的丈夫提出任何一个摧毁他心理防线的物理羞辱要求。",
  "[★] 征服之刻：高潮冲刺时，紧搂着女主，指给丈夫看谁才是这间屋子的王。",
  "[★] 绝对主权：命令丈夫亲自为你系好皮带或鞋带，承认他在各个层面的完败。"
];

/**
 * 完整仓库：按 Theme ID 映射所有特殊卡 (保留原始映射关系，一条不落)
 */
export const SPECIAL_TASKS_REPOSITORY: Record<string, string[]> = {
  // 基础等级
  sweet: SWEET_SPECIALS,
  love: LOVE_SPECIALS,
  couple: COUPLE_SPECIALS,
  intimate: INTIMATE_SPECIALS,
  advanced: ADVANCED_SPECIALS,

  // 绿帽系列 - 丈夫
  cuckold_pro_husband: SHARED_HUSBAND_SPECIALS,
  xianxia_husband: SHARED_HUSBAND_SPECIALS,
  school_husband: SHARED_HUSBAND_SPECIALS,
  office_husband: SHARED_HUSBAND_SPECIALS,
  hospital_husband: SHARED_HUSBAND_SPECIALS,
  maid_husband: SHARED_HUSBAND_SPECIALS,
  wild_husband: SHARED_HUSBAND_SPECIALS,
  cyber_speed_husband: SHARED_HUSBAND_SPECIALS,
  romantic_secrets_husband: SHARED_HUSBAND_SPECIALS,
  magic_academy_husband: SHARED_HUSBAND_SPECIALS,

  // 绿帽系列 - 女主
  cuckold_pro_wife: SHARED_WIFE_SPECIALS,
  xianxia_wife: SHARED_WIFE_SPECIALS,
  school_wife: SHARED_WIFE_SPECIALS,
  office_wife: SHARED_WIFE_SPECIALS,
  hospital_wife: SHARED_WIFE_SPECIALS,
  maid_wife: SHARED_WIFE_SPECIALS,
  wild_wife: SHARED_WIFE_SPECIALS,
  cyber_speed_wife: SHARED_WIFE_SPECIALS,
  romantic_secrets_wife: SHARED_WIFE_SPECIALS,
  magic_academy_wife: SHARED_WIFE_SPECIALS,

  // 绿帽系列 - 绿主/骑士
  cuckold_pro_bull: SHARED_BULL_SPECIALS,
  xianxia_bull: SHARED_BULL_SPECIALS,
  school_bull: SHARED_BULL_SPECIALS,
  office_bull: SHARED_BULL_SPECIALS,
  hospital_bull: SHARED_BULL_SPECIALS,
  maid_bull: SHARED_BULL_SPECIALS,
  wild_bull: SHARED_BULL_SPECIALS,
  cyber_speed_bull: SHARED_BULL_SPECIALS,
  romantic_secrets_bull: SHARED_BULL_SPECIALS,
  magic_academy_bull: SHARED_BULL_SPECIALS,
};
