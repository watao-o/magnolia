// ユニット種類
export const UNIT_KIND = {
  // 人間
  HUMAN: '01',
  // ドワーフ
  DOWARF: '02',
  // エルフ
  ELF: '03',
  // ゴブリン
  GOBLIN: '04',
  // ゴーレム
  GOLEM: '05',
  // デーモン
  DEMON: '06'
}

// ユニット_職業
export const UNIT_JOB = {
  // 戦士
  KNIGHT: '01',
  // 商人
  MERCHANT: '02',
  // 職人
  ARTISAN: '03',
  // 魔術師
  MAGICIAN: '04',
  // 聖職者
  CLERGYMAN: '05',
  // 君主
  KING: '06'
}

// フェイズ
export const PHASE = {
  // 配置
  CONFIG: '01',
  // 戦争中
  WAR: '02',
  // 戦争後
  AFTER_WAR: '03',
  // 発展
  DEVELOP: '04',
  // 収入
  INCOM: '05',
  // VP
  VP: '06',
  // 終了時
  END: '07'
}

// 効果対象
export const TARGET = {
  // お金
  MONEY: '01',
  // 技術点
  TECH: '02',
  // 信仰点
  FAITH: '03',
  // 戦力
  WAR: '04',
  // VP
  VP: '05',
  // 技術点と信仰点の値を高い方に合わせる
  SPECIAL1: '06',
  // 自分が受け取るボーナスを2倍にする
  SPECIAL2: '07',
  // 前線でなくても戦争に参加する
  SPECIAL3: '08',
  // 戦争でVPを得たなら
  GET_WAR_VP: '09',
  // 戦争でVPを得なかったら
  NOT_GET_WAR_VP: '10'
}

// バフ
export const SYNERGY = {
  // 人間
  HUMAN: '01',
  // ドワーフ
  DOWARF: '02',
  // エルフ
  ELF: '03',
  // ゴブリン
  GOBLIN: '04',
  // ゴーレム
  GOLEM: '05',
  // デーモン
  DEMON: '06',
  // 技術レベル
  TECH_LEVEL: '07',
  // 信仰レベル
  FAITH_LEVEL: '08',
  // 職業の種類
  JOB_KIND: '09',
  // コスト３以下のユニット
  UNDER_3_COST: '10',
  // コスト４以上のユニット
  UPPER_4_COST: '11',
  // 基本戦力４以上のユニット
  UPPER_4_FORCE: '12'
}
// 戦争勝利ポイント
export const WAR_VP = [
  {
    // プレイ人数
    player: 1,
    // 順位、勝利点
    result: [
      { rank: 1, vp: 3 }
    ]
  },
  {
    // プレイ人数
    player: 2,
    // 順位、勝利点
    result: [
      { rank: 1, vp: 4 },
      { rank: 2, vp: 0 }
    ]
  },
  {
    // プレイ人数
    player: 3,
    // 順位、勝利点
    result: [
      { rank: 1, vp: 5 },
      { rank: 2, vp: 3 },
      { rank: 3, vp: 0 }
    ]
  },
  {
    // プレイ人数
    player: 4,
    // 順位、勝利点
    result: [
      { rank: 1, vp: 5 },
      { rank: 2, vp: 3 },
      { rank: 3, vp: 0 },
      { rank: 4, vp: 0 }
    ]
  },
  {
    // プレイ人数
    player: 5,
    // 順位、勝利点
    result: [
      { rank: 1, vp: 5 },
      { rank: 2, vp: 3 },
      { rank: 3, vp: 1 },
      { rank: 4, vp: 0 },
      { rank: 5, vp: 0 }
    ]
  }
]

// ボーナス区分
export const BONUS_DIV = {
  // 種族
  KIND: '01',
  // 職業
  JOB: '02'
}

// 点
export const POINT = {
  // お金
  MONEY: '01',
  // 技術
  TECH: '02',
  // 信仰
  FAITH: '03',
  // 戦力
  WAR: '04',
  // VP
  VP: '05'
}

export const GRID_SIZE = 30
export const CARD_SIZE = {
  X: 1000 / 2,
  Y: 1380 / 2
}

// エルフの射手のユニットID
export const ELVEN_ARCHER_ID = 'unit_0017'
