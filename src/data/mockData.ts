import { PatientProfile, BloodGlucoseRecord, NurseAlert, FoodItem, TcmPrescription, RCTCohortMetrics } from '../types';

export const mockPatients: PatientProfile[] = [
  {
    id: 'p1',
    uuid: 'FX-RCT-2026-001',
    name: '张建国',
    gender: '男',
    age: 62,
    diabetesType: '2型糖尿病',
    courseYears: 7,
    treatmentMethod: '口服药+胰岛素联合',
    group: 'experimental',
    weekInStudy: 8,
    baselineHbA1c: 8.9,
    currentHbA1c: 7.2,
    complianceRate: 91.4,
    nonFastingMissRate: 14.3,
    points: 460,
    continuousDays: 14,
    phone: '138****5218',
    primaryDoctor: '谢玉华 (副主任医师)',
    primaryNurse: '揭梦惠 (主管护师)',
    signedConsent: true,
    tcmSyndrome: '气阴两虚证',
    medications: [
      { id: 'm1', name: '盐酸二甲双胍片', dose: '0.5g / 次', timing: '早餐及晚餐随餐', reminderTime: '07:30', takenToday: true },
      { id: 'm2', name: '阿卡波糖片 (拜唐苹)', dose: '50mg / 次', timing: '午餐第一口饭嚼服', reminderTime: '11:45', takenToday: true },
      { id: 'm3', name: '甘精胰岛素注射液', dose: '14 单位', timing: '每晚睡前皮下注射', reminderTime: '21:00', takenToday: false },
    ],
  },
  {
    id: 'p2',
    uuid: 'FX-RCT-2026-015',
    name: '李桂芳',
    gender: '女',
    age: 58,
    diabetesType: '2型糖尿病',
    courseYears: 3,
    treatmentMethod: '口服降糖药',
    group: 'experimental',
    weekInStudy: 6,
    baselineHbA1c: 8.3,
    currentHbA1c: 7.4,
    complianceRate: 85.0,
    nonFastingMissRate: 20.0,
    points: 310,
    continuousDays: 6,
    phone: '139****9431',
    primaryDoctor: '谢玉华 (副主任医师)',
    primaryNurse: '余华丹 (护师)',
    signedConsent: true,
    tcmSyndrome: '阴虚热盛证',
    medications: [
      { id: 'm4', name: '格列美脲片', dose: '2mg / 次', timing: '早餐前即刻', reminderTime: '07:00', takenToday: true },
      { id: 'm5', name: '二甲双胍缓释片', dose: '1.0g / 次', timing: '晚餐后即服', reminderTime: '18:30', takenToday: false },
    ],
  },
  {
    id: 'p3',
    uuid: 'FX-RCT-2026-033',
    name: '王志强',
    gender: '男',
    age: 48,
    diabetesType: '2型糖尿病',
    courseYears: 2,
    treatmentMethod: '口服降糖药',
    group: 'experimental',
    weekInStudy: 4,
    baselineHbA1c: 9.2,
    currentHbA1c: 8.1,
    complianceRate: 64.2,
    nonFastingMissRate: 42.0,
    points: 180,
    continuousDays: 2,
    phone: '136****1120',
    primaryDoctor: '陈茉 (医师)',
    primaryNurse: '殷智 (护师)',
    signedConsent: true,
    tcmSyndrome: '痰湿内阻证',
    medications: [
      { id: 'm6', name: '达格列净片 (安达唐)', dose: '10mg / 次', timing: '早晨晨起口服', reminderTime: '08:00', takenToday: true },
    ],
  },
  {
    id: 'p4',
    uuid: 'FX-RCT-2026-052',
    name: '周凤仙',
    gender: '女',
    age: 71,
    diabetesType: '2型糖尿病',
    courseYears: 15,
    treatmentMethod: '口服药+胰岛素联合',
    group: 'control',
    weekInStudy: 10,
    baselineHbA1c: 9.5,
    currentHbA1c: 8.8,
    complianceRate: 48.0,
    nonFastingMissRate: 58.0,
    points: 90,
    continuousDays: 0,
    phone: '137****6624',
    primaryDoctor: '谢玉华 (副主任医师)',
    primaryNurse: '孙佳 (护师)',
    signedConsent: true,
    tcmSyndrome: '脾肾两虚证',
    medications: [
      { id: 'm7', name: '门冬胰岛素30注射液', dose: '16 单位', timing: '早晚两餐前', reminderTime: '07:00', takenToday: false },
    ],
  },
  {
    id: 'p5',
    uuid: 'FX-RCT-2026-068',
    name: '陈荣华',
    gender: '男',
    age: 65,
    diabetesType: '2型糖尿病',
    courseYears: 9,
    treatmentMethod: '口服降糖药',
    group: 'control',
    weekInStudy: 12,
    baselineHbA1c: 8.7,
    currentHbA1c: 8.3,
    complianceRate: 52.0,
    nonFastingMissRate: 51.5,
    points: 120,
    continuousDays: 1,
    phone: '150****8833',
    primaryDoctor: '陈茉 (医师)',
    primaryNurse: '刘怡 (护师)',
    signedConsent: true,
    tcmSyndrome: '气阴两虚兼血瘀证',
    medications: [
      { id: 'm8', name: '西格列汀片', dose: '100mg / 次', timing: '早餐前口服', reminderTime: '07:30', takenToday: true },
    ],
  }
];

// Generate 100 simulated patients for the RCT cohort (50 experimental, 50 control)
export function generateFullCohort(): PatientProfile[] {
  const cohort: PatientProfile[] = [...mockPatients];
  const surnames = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜'];
  const names = ['建国', '秀英', '志明', '桂芳', '国庆', '玉兰', '明华', '丽娟', '金宝', '宝珍', '成龙', '凤英', '培根', '淑华', '宏伟', '美芳', '德华', '慧珍', '大伟', '彩娥'];
  
  for (let i = 6; i <= 100; i++) {
    const isExp = i <= 50;
    const randomSurname = surnames[i % surnames.length];
    const randomName = names[(i * 3) % names.length];
    const age = 45 + ((i * 7) % 32);
    const baseline = Number((7.8 + ((i * 11) % 25) / 10).toFixed(1)); // 7.8 - 10.2
    
    // Experimental group has better improvement
    let current: number;
    let compliance: number;
    let missRate: number;
    
    if (isExp) {
      current = Number((baseline - (0.8 + ((i * 5) % 12) / 10)).toFixed(1));
      compliance = Number((78 + ((i * 3) % 20)).toFixed(1));
      missRate = Number((12 + ((i * 4) % 15)).toFixed(1));
    } else {
      current = Number((baseline - (0.2 + ((i * 2) % 6) / 10)).toFixed(1));
      compliance = Number((42 + ((i * 4) % 22)).toFixed(1));
      missRate = Number((45 + ((i * 3) % 20)).toFixed(1));
    }

    cohort.push({
      id: `p${i}`,
      uuid: `FX-RCT-2026-${String(i).padStart(3, '0')}`,
      name: `${randomSurname}${randomName}`,
      gender: i % 2 === 0 ? '男' : '女',
      age,
      diabetesType: '2型糖尿病',
      courseYears: 1 + (i % 18),
      treatmentMethod: i % 3 === 0 ? '口服药+胰岛素联合' : i % 3 === 1 ? '口服降糖药' : '胰岛素治疗',
      group: isExp ? 'experimental' : 'control',
      weekInStudy: Math.min(12, 4 + (i % 9)),
      baselineHbA1c: baseline,
      currentHbA1c: current,
      complianceRate: compliance,
      nonFastingMissRate: missRate,
      points: isExp ? 200 + (i * 8) % 400 : 50 + (i * 3) % 150,
      continuousDays: isExp ? 3 + (i % 18) : i % 4,
      phone: `13${(i % 9) + 1}****${String(1000 + i * 17).slice(0, 4)}`,
      primaryDoctor: i % 2 === 0 ? '谢玉华 (副主任医师)' : '陈茉 (医师)',
      primaryNurse: i % 4 === 0 ? '揭梦惠 (主管护师)' : i % 4 === 1 ? '余华丹 (护师)' : i % 4 === 2 ? '殷智 (护师)' : '刘怡 (护师)',
      signedConsent: true,
      tcmSyndrome: i % 4 === 0 ? '气阴两虚证' : i % 4 === 1 ? '阴虚热盛证' : i % 4 === 2 ? '脾肾气虚证' : '痰湿瘀阻证',
      medications: [
        { id: `m_${i}_1`, name: '二甲双胍片', dose: '0.5g', timing: '餐后口服', reminderTime: '07:30', takenToday: true }
      ]
    });
  }

  return cohort;
}

// 14-day history for the active patient (张建国)
export const mockGlucoseRecords: BloodGlucoseRecord[] = [
  // Today
  { id: 'g1', patientId: 'p1', timestamp: '2026-09-26 07:15', timeSlot: 'fasting', value: 6.3, status: 'normal', note: '晨起空腹，昨晚睡得较好' },
  { id: 'g2', patientId: 'p1', timestamp: '2026-09-26 09:30', timeSlot: 'post_breakfast', value: 8.4, status: 'normal', note: '早餐燕麦粥+水煮蛋+黄瓜' },
  { id: 'g3', patientId: 'p1', timestamp: '2026-09-26 13:45', timeSlot: 'post_lunch', value: 9.1, status: 'normal', note: '餐后快走25分钟' },
  
  // Yesterday
  { id: 'g4', patientId: 'p1', timestamp: '2026-09-25 07:05', timeSlot: 'fasting', value: 6.6, status: 'normal' },
  { id: 'g5', patientId: 'p1', timestamp: '2026-09-25 09:20', timeSlot: 'post_breakfast', value: 8.8, status: 'normal' },
  { id: 'g6', patientId: 'p1', timestamp: '2026-09-25 13:30', timeSlot: 'post_lunch', value: 10.4, status: 'high', note: '午餐吃了两块红烧肉，米饭稍多' },
  { id: 'g7', patientId: 'p1', timestamp: '2026-09-25 20:00', timeSlot: 'post_dinner', value: 8.2, status: 'normal' },
  { id: 'g8', patientId: 'p1', timestamp: '2026-09-25 22:15', timeSlot: 'bedtime', value: 6.9, status: 'normal' },

  // Day before yesterday
  { id: 'g9', patientId: 'p1', timestamp: '2026-09-24 07:10', timeSlot: 'fasting', value: 6.1, status: 'normal' },
  { id: 'g10', patientId: 'p1', timestamp: '2026-09-24 09:15', timeSlot: 'post_breakfast', value: 7.9, status: 'normal' },
  { id: 'g11', patientId: 'p1', timestamp: '2026-09-24 16:30', timeSlot: 'random', value: 3.6, status: 'low', note: '下午打理阳台有点出汗发慌，遵双15进食3颗葡萄糖片复测恢复到5.5' },
  { id: 'g12', patientId: 'p1', timestamp: '2026-09-24 20:10', timeSlot: 'post_dinner', value: 8.0, status: 'normal' },

  // 4-7 days ago
  { id: 'g13', patientId: 'p1', timestamp: '2026-09-23 07:20', timeSlot: 'fasting', value: 6.5, status: 'normal' },
  { id: 'g14', patientId: 'p1', timestamp: '2026-09-23 09:35', timeSlot: 'post_breakfast', value: 8.6, status: 'normal' },
  { id: 'g15', patientId: 'p1', timestamp: '2026-09-23 13:40', timeSlot: 'post_lunch', value: 8.9, status: 'normal' },
  { id: 'g16', patientId: 'p1', timestamp: '2026-09-23 20:15', timeSlot: 'post_dinner', value: 8.5, status: 'normal' },

  { id: 'g17', patientId: 'p1', timestamp: '2026-09-22 07:05', timeSlot: 'fasting', value: 6.8, status: 'normal' },
  { id: 'g18', patientId: 'p1', timestamp: '2026-09-22 13:30', timeSlot: 'post_lunch', value: 9.3, status: 'normal' },
  { id: 'g19', patientId: 'p1', timestamp: '2026-09-22 20:00', timeSlot: 'post_dinner', value: 8.7, status: 'normal' },

  { id: 'g20', patientId: 'p1', timestamp: '2026-09-21 07:15', timeSlot: 'fasting', value: 7.1, status: 'high' },
  { id: 'g21', patientId: 'p1', timestamp: '2026-09-21 09:20', timeSlot: 'post_breakfast', value: 9.0, status: 'normal' },
  { id: 'g22', patientId: 'p1', timestamp: '2026-09-21 13:50', timeSlot: 'post_lunch', value: 11.2, status: 'high', note: '家庭聚餐' },
  { id: 'g23', patientId: 'p1', timestamp: '2026-09-21 22:00', timeSlot: 'bedtime', value: 7.4, status: 'normal' },

  { id: 'g24', patientId: 'p1', timestamp: '2026-09-20 07:10', timeSlot: 'fasting', value: 6.4, status: 'normal' },
  { id: 'g25', patientId: 'p1', timestamp: '2026-09-20 09:30', timeSlot: 'post_breakfast', value: 8.3, status: 'normal' },
  { id: 'g26', patientId: 'p1', timestamp: '2026-09-20 20:05', timeSlot: 'post_dinner', value: 8.1, status: 'normal' },
];

export const mockAlerts: NurseAlert[] = [
  {
    id: 'alt1',
    patientId: 'p3',
    patientName: '王志强',
    patientUuid: 'FX-RCT-2026-033',
    type: 'continuous_missed',
    severity: 'high',
    timestamp: '2026-09-26 08:30',
    details: '已连续 2 天未上传任何时段血糖，触发漏测关怀，AI已二次推送未应答',
    status: 'pending',
  },
  {
    id: 'alt2',
    patientId: 'p1',
    patientName: '张建国',
    patientUuid: 'FX-RCT-2026-001',
    type: 'severe_low',
    severity: 'critical',
    timestamp: '2026-09-24 16:32',
    value: 3.6,
    details: '下午发生偶发性低血糖 (3.6 mmol/L)，系统已自动启动双15急救指导，患者15分钟后复测5.5平稳',
    status: 'resolved',
    handlerNote: '已电话回访，系下午整理阳台体力消耗偏大，已指导运动前加餐5g碳水。——主管护师 揭梦惠',
  },
  {
    id: 'alt3',
    patientId: 'p4',
    patientName: '周凤仙',
    patientUuid: 'FX-RCT-2026-052',
    type: 'high_glucose',
    severity: 'high',
    timestamp: '2026-09-25 21:10',
    value: 14.8,
    details: '睡前血糖 14.8 mmol/L，显著高于安全阈值，对照组常规护理随访标记',
    status: 'processing',
    handlerNote: '已嘱咐多饮温开水，提醒明晨空腹复测并关注是否有恶心口渴等酮症先兆。',
  },
  {
    id: 'alt4',
    patientId: 'p2',
    patientName: '李桂芳',
    patientUuid: 'FX-RCT-2026-015',
    type: 'emotional_distress',
    severity: 'medium',
    timestamp: '2026-09-25 15:40',
    details: '对话智能体时识别到多次“扎针好疼”、“每天盯着数字心烦”等糖尿病管理倦怠词汇',
    status: 'resolved',
    handlerNote: '系统已自动推送5分钟腹式呼吸与心理疏导音频，李阿姨反馈听后心情放松很多。',
  },
];

export const foodDatabase: FoodItem[] = [
  { id: 'f1', name: '苹果', category: '水果', gi: 36, gl: 4.4, level: 'low', portion: '1个 (约150g)', advice: '低GI代表水果，富含果胶水溶性膳食纤维，适宜在两餐之间加餐食用', tcmProperty: '性凉，生津润肺，健脾开胃' },
  { id: 'f2', name: '西瓜', category: '水果', gi: 72, gl: 4.3, level: 'high', portion: '1小片 (100g内)', advice: '高GI但含水量超90%，可少量浅尝，严禁一次性吃半个或榨汁', tcmProperty: '性寒，清热解暑，脾虚胃寒者慎食' },
  { id: 'f3', name: '燕麦片 (纯燕麦)', category: '主食', gi: 55, gl: 9.2, level: 'low', portion: '熟重 1小碗 (生重35g)', advice: '富含β-葡聚糖，延缓糖分吸收与胃排空，早餐主食优选', tcmProperty: '性平，补脾益气，降脂养胃' },
  { id: 'f4', name: '精白米饭', category: '主食', gi: 83, gl: 21.5, level: 'high', portion: '1平碗 (约130g)', advice: '精米升糖快，建议与糙米、黑米、藜麦按1:1掺合蒸煮', tcmProperty: '性平，益气健脾，多食易滞热' },
  { id: 'f5', name: '苦瓜', category: '蔬菜', gi: 24, gl: 0.8, level: 'low', portion: '每餐 150-200g', advice: '含苦瓜皂苷与多肽类物质，有天然植物胰岛素美誉，推荐清炒或焯水凉拌', tcmProperty: '性寒，清心泻火，解渴生津，适宜胃热消渴' },
  { id: 'f6', name: '菠菜', category: '蔬菜', gi: 15, gl: 0.4, level: 'low', portion: '每餐 200g', advice: '极低GI，富含叶黄素、叶酸与膳食纤维，烹饪前建议焯水去草酸', tcmProperty: '性凉，养血止血，敛阴润燥' },
  { id: 'f7', name: '水煮鸡蛋', category: '肉蛋奶', gi: 0, gl: 0, level: 'low', portion: '每天 1-2个', advice: '优质完全蛋白，不含碳水，对血糖几乎无干扰，早餐必备', tcmProperty: '性平，滋阴润燥，养心安神' },
  { id: 'f8', name: '清蒸鲈鱼', category: '肉蛋奶', gi: 0, gl: 0, level: 'low', portion: '每餐 100-150g', advice: '富含优质低脂蛋白与Omega-3脂肪酸，清蒸保留营养，减少油盐', tcmProperty: '性温，健脾补气，益肾安胎' },
  { id: 'f9', name: '全麦面包 (真全麦)', category: '主食', gi: 50, gl: 8.5, level: 'low', portion: '1-2片', advice: '配料表第一位应为全麦粉，提供长效饱腹感', tcmProperty: '性温，养心益脾' },
  { id: 'f10', name: '土豆 (马铃薯)', category: '主食', gi: 62, gl: 10.3, level: 'medium', portion: '1个中等', advice: '含淀粉丰富，吃土豆时必须相应减少等量米饭主食，不可当纯蔬菜吃', tcmProperty: '性平，和胃健中，解毒消肿' },
  { id: 'f11', name: '纯纯牛奶', category: '肉蛋奶', gi: 28, gl: 1.4, level: 'low', portion: '每日 250-300ml', advice: '低GI优质乳钙与乳清蛋白，早晨或睡前半小时饮用均宜', tcmProperty: '性微寒，生津润燥，补虚健胃' },
  { id: 'f12', name: '葡萄干', category: '零食饮品', gi: 64, gl: 28.0, level: 'high', portion: '严格限量 (仅作低血糖备用)', advice: '高糖高浓缩，日常切勿当休闲零食，可随身装1小包防低血糖', tcmProperty: '性平，补气血，强筋骨' },
];

export const tcmPrescriptions: TcmPrescription[] = [
  {
    id: 'tcm1',
    title: '玉竹麦冬养阴生津茶',
    syndrome: '气阴两虚型（口干咽燥、神疲乏力、多饮多尿）',
    teaOrDiet: '药茶代饮方',
    ingredients: ['玉竹 6g', '麦冬 6g', '生黄芪 6g', '枸杞子 3g'],
    acupoints: ['三阴交（内踝上3寸）', '太溪（内踝后凹陷）', '足三里（外膝眼下3寸）'],
    cautions: '奉贤中医内分泌科指导：每日早晨开水冲泡代茶饮，水温适口；腹泻便溏者减麦冬。',
  },
  {
    id: 'tcm2',
    title: '石斛天花降火润燥饮',
    syndrome: '阴虚热盛型（烦渴引饮、多食易饥、面红烘热）',
    teaOrDiet: '清热生津汤方',
    ingredients: ['鲜石斛 10g (或干品5g)', '天花粉 6g', '葛根 8g', '绿茶少许'],
    acupoints: ['太冲（足背一二跖骨间）', '涌泉（足底前1/3）', '内庭（足二三趾缝间）'],
    cautions: '具有清虚热、敛津液之效；孕妇忌服天花粉；血糖极平稳者不宜过量饮用苦寒方。',
  },
  {
    id: 'tcm3',
    title: '温通经络防病变中药足浴方',
    syndrome: '糖尿病周围神经病变（手足麻木、畏寒发凉、刺痛）',
    teaOrDiet: '中医特色足浴熏洗',
    ingredients: ['红花 10g', '透骨草 15g', '伸筋草 15g', '桂枝 10g', '艾叶 15g'],
    acupoints: ['涌泉穴', '三阴交穴', '昆仑穴（外踝后方）'],
    cautions: '⚠️【严防烫伤规范】：糖尿病神经病变患者温觉迟钝！必须使用水温计测温（不超过37℃-38℃），浸泡时间严格控制在10-15分钟内，足部有破损溃疡者严禁足浴！',
  },
];

export const rctMetrics: RCTCohortMetrics = {
  totalEnrolled: 100,
  experimentalCount: 50,
  controlCount: 50,
  avgComplianceExperimental: 86.8, // 实验组依从率 (目标>80%)
  avgComplianceControl: 49.3,       // 对照组依从率
  missedRateExperimental: 15.2,     // 非空腹漏测率
  missedRateControl: 53.6,          // 对照组非空腹漏测率
  hba1cBaselineAvg: 8.64,           // 基线糖化均值
  hba1c12wExperimentalAvg: 7.21,   // 实验组12周降幅 -1.43%
  hba1c12wControlAvg: 8.18,          // 对照组12周降幅 -0.46%
  satisfactionScore: 94.6,          // 患者对AI虚拟护士好评率
};
