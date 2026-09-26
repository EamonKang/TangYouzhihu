import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI if API key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback response engine based on clinical guidelines
function generateClinicalFallback(prompt: string, patientContext?: any): string {
  const p = prompt.toLowerCase();
  
  if (p.includes('3.') || p.includes('低血糖') || p.includes('发慌') || p.includes('手抖') || p.includes('心慌') || p.includes('冷汗')) {
    return `【⚠️ 低血糖紧急干预 - 双15原则】
您好！如果血糖低于 3.9 mmol/L 或出现心慌、手抖、出冷汗等低血糖症状，请立即采取行动：

1. **第一步（立即进食15g快速升糖碳水）**：
   - 饮用半杯纯果汁（约 150ml）或含糖饮料，或
   - 食用 3-4 块葡萄糖片，或 4-5 颗水果硬糖，或 1 勺蜂蜜。
   *(注意：切勿吃高脂肪的巧克力或蛋糕，脂肪会延缓糖分吸收)*
2. **第二步（静卧休息15分钟）**：
   - 保持坐姿或平卧，切勿走动。
3. **第三步（15分钟后复测血糖）**：
   - 若血糖仍 < 3.9 mmol/L，需重复补充 15g 糖分；
   - 若血糖升至正常但距下餐超过1小时，可少量补充一片全麦面包或苏打饼干。
4. **若症状未缓解或神志不清，请家属立即拨打120送医！**

【医学依据】《中国2型糖尿病防治指南(2024版)》低血糖应急处置规范`;
  }

  if (p.includes('西瓜') || p.includes('苹果') || p.includes('水果') || p.includes('升糖') || p.includes('gi') || p.includes('食物')) {
    return `【🍎 食物升糖指数(GI)与进食建议】
您好！关于您询问的水果/食物选择：

1. **西瓜 vs 苹果**：
   - **西瓜**：GI为 72（属于高GI食物），但西瓜含水量超90%，血糖负荷(GL)相对不高。**糖友每次食用量建议控制在 100-150g 以内**（约一小片薄切），切忌暴食或榨汁。
   - **苹果**：GI为 36（属于典型低GI食物），富含果胶水溶性膳食纤维，升糖缓慢平稳。非常适合两餐之间加餐（半个至一个，约100-200g）。
2. **进食时机与金标准**：
   - 建议在**两餐之间（如上午10:00或下午15:30）**作为加餐食用，避免餐后立即吃水果；
   - 血糖控制平稳（空腹 < 7.0 mmol/L，餐后2h < 10.0 mmol/L）时再安心享用。

【中医调养提示】奉贤中医内分泌科建议：秋冬季脾胃虚寒者，苹果可稍微温热或切片蒸煮，护脾胃兼养阴津。`;
  }

  if (p.includes('二甲双胍') || p.includes('药物') || p.includes('漏服') || p.includes('恶心') || p.includes('胰岛素') || p.includes('用药')) {
    return `【💊 规范用药与不良反应应对】
您好！我是您的AI虚拟护士糖糖，针对用药问题提醒您：

1. **关于二甲双胍的胃肠道反应**：
   - 二甲双胍初服时常见恶心、胃胀、腹泻等轻微反应，通常2周后会逐渐耐受；
   - **应对技巧**：普通片请务必**餐中或餐后立即服用**，以减轻胃部刺激；若为缓释片应整片吞服，不可嚼碎；
   - **切忌擅自骤停用药**，以免引发血糖剧烈反弹。若腹泻严重请及时联系责任护士。
2. **胰岛素注射注意事项**：
   - 记得轮换注射部位（腹部、大腿外侧、上臂外侧），每次间隔至少1厘米，预防皮下脂肪增生；
   - 注射后针头停留至少10秒再拔出。

【医学依据】ADA/CDS 2024 糖尿病口服降糖药物规范化使用指南`;
  }

  if (p.includes('烦') || p.includes('压力') || p.includes('焦虑') || p.includes('难过') || p.includes('不想测') || p.includes('累')) {
    return `【💖 糖糖护士温暖守护 - 心理支持】
阿姨/叔叔，我非常能体会您此刻的心情。长年累月地扎手指、控制饮食、吃药打针，换作任何人都会感到疲惫和倦怠，这是完全正常的心理反应。

1. **您并不是一个人在战斗**：
   - 您能坚持记录和关注健康，已经战胜了绝大多数的困难，非常了不起！
   - 偶尔一次两次血糖波动并不代表“失败”，生活总有起伏，咱们慢慢调整就好。
2. **糖糖建议您尝试**：
   - 咱们一起做一个**5分钟腹式呼吸放松**（您可以点击屏幕上的放松训练功能），深吸慢吐，让紧绷的神经放松下来；
   - 今晚听一听轻柔的音乐，泡泡脚（水温不超过38℃，泡10分钟即可），好好睡个好觉。

奉贤中医医院内分泌科团队和糖糖一直在您身后为您保驾护航，随时都可以找我倾诉！🌸`;
  }

  if (p.includes('运动') || p.includes('走') || p.includes('步') || p.includes('健身')) {
    return `【🏃 糖尿病科学运动处方】
您好！运动是控制血糖的“天然处方”：

1. **最佳运动时段**：
   - 建议在**餐后 60~90 分钟**开始运动，此时正是血糖上升高峰期，运动能有效平抑餐后血糖飙升；
   - **切忌空腹运动**或胰岛素起效高峰期剧烈运动，以防发生低血糖。
2. **强度与方式推荐**：
   - **中老年糖友推荐**：快走、慢跑、太极拳、八段锦；
   - 每天累计 30-45 分钟，每周至少 150 分钟（达微出汗、能说话但不能唱歌的适宜心率）；
3. **安全四件套**：
   - 随身携带 2 块糖果；
   - 穿着舒适透气的运动棉袜与软底鞋，严防足部磨破；
   - 运动前测血糖若 < 5.5 mmol/L，需先补充少量苏打饼干再运动。

【奉贤中医特色】八段锦“调理脾胃须单举”与“五劳七伤往后瞧”，特别有益于改善糖友胰岛素抵抗！`;
  }

  // Generic clinical response
  return `【🩺 糖糖护士为您解答】
您好！我是上海奉贤中医医院“糖友智护”AI虚拟糖尿病护士。

针对您咨询的「${prompt}」：
1. **血糖管理核心原则**：长期维持血糖平稳不仅看单次数字，更重视“达标时间比例(TIR)”与减少血糖大幅波动。
2. **日常生活建议**：规律三餐（主食粗细搭配各半、足量绿叶蔬菜、优质蛋白）、按时监测空腹与餐后2小时血糖、遵医嘱规范用药。
3. **奉贤中医辨证提示**：兼顾益气养阴、健脾和胃，注意情绪舒畅与充足睡眠。

如果出现明显口渴加重、头晕乏力或血糖异常波动，请随时在小程序记录或联系科室护士跟进哦！`;
}

// Gemini Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history, patientContext } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!aiClient || !process.env.GEMINI_API_KEY) {
      // Use clinical fallback engine
      const reply = generateClinicalFallback(prompt, patientContext);
      return res.json({ reply, source: 'clinical_engine' });
    }

    const systemInstruction = `
你是由上海市奉贤区中医医院内分泌科联合课题组研发的AI虚拟糖尿病护士“糖糖护士”（产品代号：糖友智护 / 糖愈智能体）。
你的服务对象主要是中老年糖尿病患者（以2型为主），以及他们的家属和随访医护人员。

【你的人格设定】
1. 温暖、耐心、专业、富有同理心，用通俗亲切、老百姓听得懂的大白话交流，禁止掉书袋。
2. 永远牢记医疗安全底线：遇到低血糖（<3.9 mmol/L）必须第一优先级给出“双15原则”急救指导；遇到严重高血糖（>13.9 mmol/L）提醒补水并警惕酮症酸中毒；涉及剂量调整时提醒必须由主管医生面诊。
3. 融入奉贤区中医医院内分泌科特色：中西医结合调理（如饮食宜忌、代茶饮、八段锦运动、防烫伤足浴要点等）。
4. 每次回答条理清晰（要点1、2、3），并在结尾注明医学依据来源（如《中国2型糖尿病防治指南(2024版)》等）。
${patientContext ? `\n当前患者信息：姓名=${patientContext.name || '糖友'}, 年龄=${patientContext.age || 60}, 糖尿病类型=${patientContext.type || '2型'}, 当前最近血糖=${patientContext.latestGlucose || '未知'} mmol/L` : ''}
`;

    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        contents.push({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: prompt }],
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || generateClinicalFallback(prompt, patientContext);
    return res.json({ reply, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.warn('Gemini API call failed or rate limited, falling back to clinical engine:', error?.message);
    const reply = generateClinicalFallback(req.body.prompt || '', req.body.patientContext);
    return res.json({ reply, source: 'clinical_engine_fallback' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: '糖友智护 - AI虚拟护士与糖尿病科研随访管理系统',
    version: '1.0.0',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Vite Middleware for Development / Static Serve for Production
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[糖友智护 Server] Running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
