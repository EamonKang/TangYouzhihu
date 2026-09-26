import { ChatMessage, PatientProfile } from '../types';

export interface ChatResponse {
  reply: string;
  source: string;
}

export async function sendChatMessage(
  prompt: string,
  history: ChatMessage[],
  patient?: PatientProfile | null
): Promise<ChatResponse> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        history: history.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        patientContext: patient
          ? {
              name: patient.name,
              age: patient.age,
              type: patient.diabetesType,
              treatment: patient.treatmentMethod,
              baselineHbA1c: patient.baselineHbA1c,
              currentHbA1c: patient.currentHbA1c,
              tcmSyndrome: patient.tcmSyndrome,
            }
          : undefined,
      }),
    });

    if (!res.ok) {
      throw new Error(`API responded with status: ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || '糖糖护士已收到您的消息，请问还有什么想咨询的吗？',
      source: data.source || 'gemini',
    };
  } catch (err: any) {
    console.warn('Network or server error in chat, using instant fallback:', err);
    // Local fallback
    return {
      reply: localClinicalFallback(prompt),
      source: 'offline_clinical_engine',
    };
  }
}

function localClinicalFallback(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('3.') || p.includes('低血糖') || p.includes('发慌') || p.includes('手抖') || p.includes('出冷汗')) {
    return `【⚠️ 糖糖护士紧急提醒：双15原则】
血糖低于 3.9 mmol/L 或有低血糖症状时，请立即：
1. **立即进食15g快速升糖糖类**：如喝半杯果汁/含糖饮料、3-4片葡萄糖片或4-5颗水果糖。
2. **静坐休息15分钟**。
3. **15分钟后复测血糖**：若仍<3.9需再次补充15g糖分；若持续不缓解或出现意识模糊，请家属立即拨打120送医！
【医学依据】《中国2型糖尿病防治指南(2024版)》`;
  }

  if (p.includes('西瓜') || p.includes('苹果') || p.includes('吃') || p.includes('水果')) {
    return `【🍎 饮食指导：水果怎么吃】
- **苹果**：属于低GI水果（GI约36），升糖慢，建议在两餐中间（如上午10点或下午3点半）吃半个至一个。
- **西瓜**：GI较高（72），但含水量高，每次严格限量在100g以内（一小片），不可打汁喝。
- **金标准**：空腹血糖<7.0且餐后2小时<10.0时，方可适量在加餐时间享用低GI水果哦！`;
  }

  if (p.includes('烦') || p.includes('压力') || p.includes('累') || p.includes('难过')) {
    return `【💖 糖糖抱抱您 - 情绪疏导】
叔叔/阿姨，常年控糖确实很不容易，您觉得烦躁或者疲惫是非常能够理解的。
您已经做得非常棒了！不必苛求每一次数字都完美无缺。
糖糖建议您深吸一口气，点击屏幕上的“呼吸放松”训练，跟着音乐深呼吸5分钟，给紧绷的身心放个小假吧。我和奉贤中医内分泌科的护士们会一直陪在您身边！`;
  }

  return `【🩺 糖糖护士温馨解答】
您好！我是您的AI虚拟糖尿病护士糖糖。针对您咨询的问题，建议您保持膳食荤素粗细搭配、餐后1小时适度运动、遵医嘱规范用药并规律记录血糖。如有明显不适，可随时呼叫我们科室护士跟进哦！`;
}
