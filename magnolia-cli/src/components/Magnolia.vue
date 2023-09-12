<template>
  <v-container
    class="mx-2 background-image max-dimensions"
    fluid
    style="background-color: #fef7da"
  >
    <v-row>
      <v-col cols="2">
        <v-text-field
          v-model="roomId"
          dirty
          flat
          label="ルームID"
          class="custom-col"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          v-model="userName"
          dirty
          flat
          label="ユーザ名"
          :readonly="joinRoom"
          class="custom-col"
        />
      </v-col>
      <!-- <v-col cols="1">
        <v-btn
         @click="createRoom" color="black" disabled>部屋を作る</v-btn>
      </v-col> -->
      <v-col cols="1">
        <v-btn
          @click="createRoom"
          color="black"
          :disabled="joinRoom"
          class="border"
        ><v-icon icon="mdi-new-box" color="white"/>部屋作る</v-btn>
      </v-col>
      <v-col cols="1">
        <v-btn
          @click="enterRoom"
          color="black"
          :disabled="joinRoom"
          class="border"
        ><v-icon icon="mdi-door-open" color="white"/>入室</v-btn>
        </v-col>
      <v-col cols="1">
        <span class="custom-text">参加人数: {{ playerNum }}</span>
      </v-col>
      <v-col cols="2">
        <v-btn
          :color="!joinRoom || playGame ? 'grey' : 'black'"
          @click="gameStart"
          elevation="20"
          height="100"
          outlined
          rounded
          max-width="500"
          :disabled="!joinRoom || playGame"
        ><v-icon icon="mdi-play"/>＜＜＜＜ゲームスタート＞＞＞＞</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2" class="border custom-col"><v-icon icon="mdi-human"/><span class="custom-text">Player</span></v-col>
      <v-col cols="2" class="border custom-col"><v-icon icon="mdi-gold"/><span class="custom-text">お金</span></v-col>
      <v-col cols="2" class="border custom-col"><v-icon icon="mdi-shield-cross"/><span class="custom-text">戦力</span></v-col>
      <v-col cols="1" class="border custom-col"><v-icon icon="mdi-cog-box"/><span class="custom-text">技術点</span></v-col>
      <v-col cols="1" class="border custom-col"><v-icon icon="mdi-cog-box"/><span class="custom-text">技術レベル</span></v-col>
      <v-col cols="1" class="border custom-col"><v-icon icon="mdi-book-cross"/><span class="custom-text">信仰点</span></v-col>
      <v-col cols="1" class="border custom-col"><v-icon icon="mdi-book-cross"/><span class="custom-text">信仰レベル</span></v-col>
      <v-col cols="2" class="border custom-col"><v-icon icon="mdi-star-face"/><span class="custom-text">VP</span></v-col>
    </v-row>
    <v-list class="pa-0">
      <v-list-item
        v-for="(user, index) in room.users ? room.users : []"
        :key="index"
        class="pa-0"
        style="background-color:cadetblue"
      >
        <v-row>
          <v-col cols="2" class="border;">
            <span class="custom-text">
              {{ user.name }}
            </span>
          </v-col>
          <v-col cols="2" class="border player-back">
            <span class="custom-text">
              {{ user.status.money }}
            </span>
          </v-col>
          <v-col cols="2" class="border player-back">
            <span class="custom-text">
            {{ user.status.force }}
            </span>
          </v-col>
          <v-col cols="1" class="border player-back">
            <span class="custom-text">
              {{ user.status.tech }} 点
            </span>
          </v-col>
          <v-col cols="1" class="border player-back">
            <span class="custom-text">
              {{ _getLevel(user.status.tech) }}
            </span>
          </v-col>
          <v-col cols="1" class="border player-back">
            <span class="custom-text">
              {{ user.status.faith }} 点
            </span>
          </v-col>
          <v-col cols="1" class="border player-back">
            <span class="custom-text">
              {{ _getLevel(user.status.faith) }}
            </span>
          </v-col>
          <v-col cols="2" class="border player-back">
            <span class="custom-text">
              {{ user.status.vp }}
            </span>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
    <v-row class="pt-6">
      <v-col cols=6 class="custom-col border"><v-icon icon="mdi-cards"/><span class="custom-text">プレイヤーカード置き場</span></v-col>
      <v-col cols=6 class="custom-col border"><v-icon icon="mdi-cards"/><span class="custom-text">手札</span></v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="3000">
      <span class="custom-text-snack">{{message}}</span>
    </v-snackbar>
    <v-row>
      <!-- カード置き場 -->
      <v-col cols="6">
        <card-place
          ref="cardPlace"
          :selectedCard="selectedCard"
          canvasName="cardPlace"
          :deckCards="deckCards"
          :status="status"
          :addCards="addCards"
          @openSnackbar="openSnackbar($event)"
          @removeHnadCard="removeHnadCard()"
          @endPhase="endPhase()"
          @addExistCardList="addExistCardList($event)"
        />
      </v-col>
      <!-- 手札置き場 -->
      <v-col cols="6">
        <v-row>
          <hand-card
            ref="handCard"
            :deckCards="deckCards"
            @updateSelectedCard="updateSelectedCard($event)"
            @removeDeckCards="removeDeckCards($event)"
            :selectedCard="selectedCard"
          />
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-btn
              :color="!trashFlg ? 'grey' : 'primary'"
              @click="trashCard()"
              :disabled="!trashFlg || endGame"
              class="border"
            ><v-icon icon="mdi-trash-can-outline"/>捨てる</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              :color="!trashFlg ? 'grey' : 'primary'"
              @click="endTrash()"
              :disabled="!trashFlg || endGame"
              class="border"
            ><v-icon icon="mdi-trash-can-outline"/>捨てるの終わったよ</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-btn
            :color="trashFlg || !playGame ? 'grey' : 'primary'"
            @click="endPhase"
            :disabled="trashFlg || !playGame || endGame"
            class="border"
          ><v-icon icon="mdi-send"/>ターン終了</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="custom-col pb-6 mb-6">
      <span class="custom-text">他プレイヤーの設置カード(comming soon...)</span>

    </v-row>
    <v-list class="pa-0 pt-6 transparent-list">
      <v-list-item
        v-for="(user, index) in room.users ? room.users.filter(u => u.name !== userName) : []"
        :key="index"
        class="pa-0"
      >
      <v-row class="py-2"><span class="custom-text">{{ user.name }}</span></v-row>
      <v-row>
        <v-col cols="6">
          <other-card-place
            :ref="index"
            :canvasName="user.name"
            :cards="user.cards"
          />
        </v-col>
      </v-row>
      </v-list-item>
    </v-list>
    <!-- 通知専用ダイアログ -->
    <phase-dialog
      ref="announceDialog"
      :nextPhase="() => {}"
      @closeDialog="closeDialog()"
    />
    <!-- ゲーム開始通知ダイアログ -->
    <phase-dialog
      ref="startDialog"
      :nextPhase="putPhase"
      @closeDialog="closeDialog()"
    />
    <!-- ドローフェイズダイアログ -->
    <phase-dialog
      ref="putPhaseDialog"
      :nextPhase="() => {}"
      @closeDialog="closeDialog()"
    />
    <!-- 戦争フェイズダイアログ -->
    <phase-dialog
      ref="warPhaseDialog"
      :nextPhase="developPhase"
      @closeDialog="closeDialog()"
    />
    <!-- 発展フェイズダイアログ -->
    <phase-dialog
      ref="developPhaseDialog"
      :nextPhase="incomePhase"
      @closeDialog="closeDialog()"
    />
    <!-- 収入フェイズダイアログ -->
    <phase-dialog
      ref="incomePhaseDialog"
      :nextPhase="vpPhase"
      @closeDialog="closeDialog()"
    />
    <!-- VPフェイズダイアログ -->
    <phase-dialog
      ref="vpPhaseDialog"
      :nextPhase="putPhase"
      @closeDialog="closeDialog()"
    />
    <!-- 待機ダイアログ -->
    <wait-dialog
      ref="waitDialog"
     />
     <!-- ゲーム終了結果通知 -->
     <result-dialog
      ref="resultDialog"
      :room="room"
     />
  </v-container>
</template>

<script>
// import { fabric } from 'fabric'
import CardPlace from './CardPlace.vue'
import HandCard from './HandCard.vue'
import  {
  SYNERGY,
  TARGET,
  PHASE,
  WAR_VP,
  BONUS_DIV,
  ELVEN_ARCHER_ID
} from '@/const/common'
import PhaseDialog from './PhaseDialog.vue'
import WaitDialog from './WaitDialog.vue'
import ResultDialog from './ResultDialog.vue'
import OtherCardPlace from './OtherCardPlace.vue'
import CardData from '@/assets/data.json'
import _ from 'lodash'
import { io } from 'socket.io-client'

export default {
  name: 'MmagnoliaGame',
  props: {
    msg: String
  },
  components: {
    CardPlace,
    HandCard,
    PhaseDialog,
    WaitDialog,
    ResultDialog,
    OtherCardPlace
  },
  data () {
    return {
      snackbar: false,
      // カード捨てるターンフラグ
      trashFlg: false,
      // 部屋参加有無
      joinRoom: false,
      playGame: false,
      endGame: false,
      vpCanvas: null,
      warCanvas: null,
      // socket: io('http://localhost:3030'),
      socket: io('https://magnolia-kkgc.onrender.com/', {
        transports: ["websocket"] // skip hppt polling
      }),
      selectedCard: {},
      // 山札カード
      deckCards: [],
      // 設置済みカード
      existCardList: [],
      // プレイヤー人数
      playerNum: 0,
      dialogMsg: '',
      // 追加するカード
      addCards: [],
      // ボーナス倍率
      bonusRatio: 1,
      // お金
      money: {
        one: { gold: 1, num: 25},
        three: { gold: 3, num: 15},
        six: { gold: 6, num: 6 }
      },
      // 手札で選択しているカード
      selectedImg: null,
      status: {
        // 金
        money: 5,
        // 技術
        tech: 0,
        // 信仰
        faith: 0,
        // 戦力
        force: 0,
        // VP
        vp: 0
      },
      // カード情報
      cardData: CardData,
      showFlg: false,
      userName: "",
      // 一旦roomId固定
      roomId: "",
      message: "",
      room: {}
    }
  },
  created () {
    this.socket.on('connect', () => {
      console.log('connected')
    })
    this.socket.on('error', (error) => {
      console.log('Connection Error:', error)
      this.message = 'Connection Error: ' + error
      this.snackbar = true
    })
    this.init()
  },
  computed: {
    otherPlayers () {
        // ユーザ名が一致しない（他プレイヤー）ユーザのリストを返す
        return this.room.users ? this.room.users.filter(u => u.name !== this.userName)
         : []
    }
  },
  watch: {
    status: {
      handler: function(newStatus) {
        // ルーム情報の更新
        const myUser = this.room.users.find(u => u.name === this.userName)
        myUser.status = newStatus
        // console.log('■watch')
        // console.log('変更後：', JSON.stringify(newStatus))
        // 他プレイヤーに送信
        this.socket.emit('updateStatus', this.roomId, this.userName, newStatus)
      },
      deep : true
    }
  },
  mounted () {
    // ルーム情報更新
    this.socket.on("updateRoom", (room, playerNum) => {
      this.$refs.announceDialog.openDialog('入室に成功しました！！')
      this.joinRoom = true
      this.playerNum = playerNum
      // ルーム情報更新
      this.room = room
      this.roomId = room.id
      console.log('updateRoom:', this.room)
      console.log('参加人数:', playerNum)
    });
    this.socket.on('updateStatus', (userName, user) => {
      console.log('変更するユーザ情報:', user.name, user.status)
      // 受け取ったユーザ情報を更新
      this.room.users = this.room.users.filter(u => u.name !== userName)
      this.room.users.push(user)
    })
    // 他プレイヤー入室通知
    this.socket.on('announceEnter', (userName, playerNum, room) => {
      console.log('他プレイヤー入室：', userName)
      this.$refs.announceDialog.openDialog(userName + ' さんが入室しました')
      console.log('参加人数:', playerNum)
      this.playerNum = playerNum
      if(!_.isEmpty(this.room)) {
        this.room = room
      }
    })
    // エラー発生
    this.socket.on("notifyError", (error) => {
      this.message = error;
      this.snackbar = true
    });

    // 他プレイヤー退室通知
    this.socket.on("notifyDisconnection", (userName) => {
      this.message = userName + " さんが退室しました";
      this.$refs.announceDialog.openDialog(userName + ' さんが入室しました')
    });
    // ゲーム開始通知
    this.socket.on('announceStart', () => {
      this.playGame = true
      // カードを配布
      this.$refs.handCard._drawCard()
      this.$refs.startDialog.openDialog('ゲームを開始します')
      // this.socket.emit('updateStatus', (this.userName, this.status))
      // this.trashFlg = true
    })
    // 山札除外処理
    this.socket.on('removeDeckCardsOthre', (removeCards) => {
      this.removeDeck(removeCards)
    })
    // 他プレイヤーの配置終了通知
    this.socket.on('announceEndPhase', (name) => {
      console.log(name,'さんが配置を終了しました')
      this.message = name + 'さんが配置を終了しました'
      this.snackbar = true
    })

    // 全員配置フェーズが終了
    this.socket.on('startRound', () => {
      console.log('★startRound')
      // 待機ダイアログを閉じる
      this.$refs.waitDialog.closeDialog()
      // 配置フェーズの処理開始
      this.configPhase()
    })

    // 戦争フェーズ終了
    this.socket.on('endWarPhase', (room) => {
      this.$refs.waitDialog.closeDialog()
      this.room = room
      const myUser = room.users.find(u => u.name === this.userName)
      console.log('■■■■■■戦争■■■■■■■■')
      console.log('順位:',myUser.rank)
      console.log('vp獲得前:',this.status.vp)
      // 戦争勝利vpを計算
      const getWarVp = this.getWarVp(myUser.rank)
      this.status.vp += getWarVp
      console.log('vp獲得後:',this.status.vp)
      this.snackbar = true
      this.message = '獲得VP:' + getWarVp
      // vp追加効果があるカードがあれば追加
      this.existCardList.forEach(ec => {
        this.addWarVp(this.cardData.skillList.find(skill => skill.skillId === ec.skillId1), getWarVp)
        this.addWarVp(this.cardData.skillList.find(skill => skill.skillId === ec.skillId12), getWarVp)
      })
      console.log('vp追加獲得後:',this.status.vp)
    })

    this.socket.on('announceEndGame', (room) => {
      this.room = room
      this.endGame = true
      // 結果通知ダイアログを開く
      this.$refs.resultDialog.openDialog()
    })
  },
  methods: {
    /**
     * 入室処理
     */
    createRoom () {
      console.log('createRoom')
      this.socket.emit("create", this.userName, this.status)
    },
    enterRoom() {
      console.log('enterRoom')
      this.socket.emit("enter", this.userName, this.roomId, this.status);
      this.message = "";
    },
    /**
     * ゲーム開始
     */
    gameStart () {
      // 全プレイヤーに通知
      this.socket.emit("gameStart", this.roomId);
    },
    /**
     * 初期化処理
     */
    init () {
      // console.log('jsonデータ', CardData)
      let serialNum = 1
      CardData.unitList.forEach(unit => {
        // カードの枚数だけ追加
        for(let i = 0; i < unit.cardNum; i++) {
          this.deckCards.push({
            serialNum: serialNum,
            unitId: unit.unitId,
            img: require('@/assets/cardSvg/' + unit.unitId + '.svg')
          })
          serialNum++
        }
      })
      // カード山札を作成
      // this.deckCards
    },
    /**
     * カード選択処理
     */
    updateSelectedCard (value) {
      // this.selectedCard = true
      this.selectedCard = value
      // カードハイライト
      if(!this.trashFlg) {
        this.$refs.cardPlace.highlight()
      }
    },
    /**
     * 引いたカードを山札から除外する
     */
    removeDeckCards (removeCards) {
      this.removeDeck(removeCards)
      // 他プレイヤーの山札からも除外する
      this.socket.emit('removeDeckCards', removeCards)
    },
    removeDeck (removeCards) {
      removeCards.forEach(rc => {
        // シリアル番号が一致するカードを除外する
        this.deckCards.filter(dc => dc.serialNum !== rc.serialNum)
      })
    },
    /**
     * カード除外処理
     */
    removeHnadCard () {
      this.$refs.handCard.removeHnadCard()
    },
    /**
     * カード捨てる
     */
     trashCard () {
      this.$refs.handCard.removeHnadCard()
    },
    /**
     * カード捨てるの終わり
     */
    endTrash () {
      console.log('カード捨て終わった')
      this.trashFlg = false
      this.$refs.handCard.reloadCard()
      this.$refs.cardPlace.highlight()
    },
    /**
     * ドローフェーズ処理 
     */
    putPhase(){
      // ダイアログ表示
      this.$refs.putPhaseDialog.openDialog('ドローフェーズです\r\nカードを捨てて設置してください')
      this.trashFlg = true
    },
    /**
     * カード設置時処理
     */
     addExistCardList (selectedCard) {
      // ユニット情報を取得
      const unitList = this.cardData.unitList
      let unitInfo = unitList.find(unit => {
        // return unit.unitId.substring(unit.unitId.length - 4, unit.unitId.length) === selectedCard.id
        return unit.unitId === selectedCard.unitId
      })
      // 位置情報を追加
      unitInfo = {
        ...unitInfo,
        posX: selectedCard.posX,
        posY: selectedCard.posY,
        img: selectedCard.img
      }
      // ユニット情報を追加
      this.addCards.push(unitInfo)
    },
    /**
     * 配置フェイズ終了処理
     */
     endPhase() {
      // 設置枚数を0にリセット
      this.$refs.cardPlace.installCount = 0

      // 他のプレイヤーを待つ
      this.socket.emit('endConfigPhase', this.roomId)
      this.$refs.waitDialog.openDialog()
    },
    /**
     * 配置フェーズ処理
     */
    configPhase() {
      // お金を払う
      console.log('■■■■■■■配置■■■■■■■')
      console.log('お金はらう前:', this.status.money)
      this.addCards.forEach(addCard => {
        this.status.money -= addCard.cost
      })
      // カードを２枚設置していなければ枚数に応じてお金を追加
      if (this.addCards.length === 1) this.status.money ++
      else if (this.addCards.length === 0) this.stasus.money += 2
      console.log('お金はらった後:', this.status.money)
      // カードの設置枚数によりお金を還元

      // 設置済みカードに追加
      this.existCardList = [...this.existCardList, ...this.addCards]
      // console.log(this.addCards)
      // console.log(this.existCardList)
      // 配置効果の発動
      console.log('配置効果発動前:',JSON.stringify(this.status))
      // 配置フェーズに効果があるカードを取得
      this.addCards.forEach(unit => {
        // スキル１の処理
        const skill1 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId1)
        this.addConfig(skill1)
        // スキル２の処理
        const skill2 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId2)
        this.addConfig(skill2)
      })
      console.log('配置効果発動後:',JSON.stringify(this.status))
      // MRMO:2個同時にビンゴになったら選べるようにする。。。
      this.bonusPhase()
      // 設置カードのリセット
      this.addCards = []
      // 戦争フェーズ呼び出し
      this.warPhase()
    },
    /**
     * 配置効果処理 
     */
     addConfig(skill){
      if(!_.isEmpty(skill) && skill.activePhase === PHASE.CONFIG){
        // 職業の種類を取得
        const uniqueJobs = _.uniqBy(this.existCardList, 'job')
        switch(skill.effectTarget) {
          case TARGET.TECH:
            this.status.tech += skill.effectValue
            break;
          case TARGET.FAITH:
            this.status.faith += skill.effectValue
            break;
          case TARGET.VP:
            // 信仰レベルバフ
            if (skill.synergyTarget === SYNERGY.FAITH_LEVEL) {
              this.status.vp += skill.effectValue * this._getLevel(this.status.faith)
            // 種族バフ
            } else {
              // 種族が一致するカードを取得
              const sameKindCards = this.existCardList.filter(card => card.kind === skill.synergyTarget)
              this.status.vp += skill.effectValue * sameKindCards.length
            }
            break;
          case TARGET.MONEY:
            this.status.money += uniqueJobs.length
            break;
          case TARGET.SPECIAL1:
            // 技術点と信仰点の値を高い方に合わせる
            if (this.status.tech < this.status.faith) {
              this.status.tech = this.status.faith
            } else if (this.status.tech > this.status.faith) {
              this.status.faith = this.status.tech
            }
            break;
          case TARGET.SPECIAL2:
            // 自分が受け取るボーナスを2倍にする
            this.bonusRatio = 2
            break;
        }
      }
     },
     /**
     * ボーナス処理
     */
     bonusPhase () {
      const bonus = []
      // 設置したカード
      this.addCards.forEach(ac => {
        const xCards = this.existCardList.filter(ec => ec.posX === ac.posX)
        const yCards = this.existCardList.filter(ec => ec.posY === ac.posY)

        // 横のビンゴ確認
        // 種別一致
        if(xCards.filter(c => c.kind === ac.kind).length === 3) {
          bonus.push(this.getBonus(BONUS_DIV.KIND, ac.kind))
        // 職業一致
        } else if (xCards.filter(c => c.job === ac.job).length === 3) {
          bonus.push(this.getBonus(BONUS_DIV.JOB, ac.job))
        }
        // 縦のビンゴ確認
        // 種別一致
        if(yCards.filter(c => c.kind === ac.kind).length === 3) {
          bonus.push(this.getBonus(BONUS_DIV.KIND, ac.kind))
        // 職業一致
        } else if (yCards.filter(c => c.job === ac.job).length === 3) {
          bonus.push(this.getBonus(BONUS_DIV.JOB, ac.job))
        }
      })
      // ボーナスがあれば処理
      if (bonus.length !== 0) {
        console.log('■■■■■■ボーナス発動！！！！！■■■■■')
        console.log('発動前:',JSON.stringify(this.status))
        bonus.forEach(b => {
          this.addBonus(b.effectTarget1, b.effectValue1)
          this.addBonus(b.effectTarget2, b.effectValue2)
        })
        console.log('発動後:',JSON.stringify(this.status))
      }
     },
     /**
     * ボーナス取得
     */
     getBonus (division, type) {
      return CardData.bonusList.filter(b => b.division === division)
            .find(b => b.type === type)
     },
    /**
     * ボーナス取得
     */
     addBonus (target, value) {
      // TODO:同じターンに同じ列、行にカードを配置して、ボーナスが発生すると２倍発動してしまうバグ修正
      if(!_.isEmpty(target)) {
        switch(target) {
          case TARGET.MONEY:
            this.status.money += value * this.bonusRatio
            break
          case TARGET.TECH:
            this.status.tech += value * this.bonusRatio
            break
          case TARGET.FAITH:
            this.status.faith += value * this.bonusRatio
            break
          case TARGET.VP:
            this.status.vp += value * this.bonusRatio
            break
        }
      }
     },
    /**
     * 戦争フェーズ処理 
     */
    warPhase(){
      // ダイアログ表示
      this.$refs.warPhaseDialog.openDialog('戦争フェーズです\r\n戦力を計算します')
      // 戦力を計算
      let force = 0
      // 前線のユニットを取得
      const frontUits = this._getFrontUnits()
      frontUits.forEach(unit => {
        // 前線ユニットの戦力を足し算
        force += unit.force
        // スキル１の処理
        const skill1 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId1)
        force += this._addForce(skill1)
        // スキル２の処理
        const skill2 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId2)
        force += this._addForce(skill2)
      })
      this.status.force = force
      console.log('warPhase呼び出し')
      // エルフの射手が設置済みかつ前線に存在しない場合、戦力を追加
      this.elvenArcher(frontUits)
      // 待機ダイアログを開く
      this.$refs.waitDialog.openDialog('他プレイヤーの更新を待っています')
      // 戦力の更新を待つため、遅延を挟む
      setTimeout(() => {
        this.socket.emit('warPhase', this.roomId, this.status, this.userName, this.existCardList)
      }, 500);
    },
    /**
     * 前線ユニット取得
     */
    _getFrontUnits () {
      let frontUnits = []
      // 横位置ごとに分類する
      for (let i = 0; i < 5; i++) {
        const verticalCards = this.existCardList.filter(card => card.posX === i)
        if(verticalCards.length !== 0) {
          // Y座標（縦位置）が一番上のカードを取得
          const topY = Math.min(...verticalCards.map(card => card.posY))
          const frontUnit = verticalCards.find(card => card.posY === topY)
          frontUnits.push(frontUnit)
        }
      }
      return frontUnits
    },
    /**
     * 戦力追加処理
     */
    _addForce(skill) {
      let addForce = 0
      if(!_.isEmpty(skill) && skill.activePhase === PHASE.WAR){
        switch (skill.synergyTarget) {
          // 技術レベルバフ
          case SYNERGY.TECH_LEVEL:
            addForce += skill.effectValue * this._getLevel(this.status.tech)
            break
          // 信仰レベルバフ
          case SYNERGY.FAITH_LEVEL:
            addForce += skill.effectValue * this._getLevel(this.status.faith)
            break
        }
      }
      return addForce
    },
    /**
     * エルフの射手処理関数
     */
    elvenArcher (frontUits) {
      // エルフの射手を設置しているか確認
      const elvenArchers = this.existCardList.filter(ec => ec.unitId === ELVEN_ARCHER_ID)
      if (!_.isEmpty(elvenArchers)) {
        // 前線に存在しているか確認
        const frontElevenArdhers = frontUits.filter(fu => fu.unitId === ELVEN_ARCHER_ID)
        // エルフの射手の戦力を取得
        const force = this.cardData.unitList.find(u => u.unitId === ELVEN_ARCHER_ID).force
        // 戦力 × (配置している数 - 前線にいる数)
        this.status.force += force * (elvenArchers.length - frontElevenArdhers.length)
      }
    },
    /**
     * 戦争勝利点計算
     */
    getWarVp (rank) {
      return WAR_VP.find(wv => wv.player === this.playerNum).result
            .find(r => r.rank === rank).vp
    },
    /**
     * 戦争追加点処理
     */
    addWarVp (skill, addVp) {
      if(!_.isEmpty(skill) && skill.activePhase === PHASE.AFTER_WAR){
        // 戦争でVPを得たなら
        if(addVp > 0 && skill.effectTarget === TARGET.GET_WAR_VP) {
          this.status.vp += skill.effectValue
        // 戦争でVPを得なかったなら
        } else if (addVp === 0 && skill.effectTarget === TARGET.NOT_GET_WAR_VP){
          this.status.vp += skill.effectValue
        }
      }
    },
    /**
     * 発展フェーズ処理
     */
    developPhase(){
      console.log('■■■■■■■発展■■■■■■■')
      // ダイアログ表示
      this.$refs.developPhaseDialog.openDialog('発展フェーズです\r\n技術・信仰をupします')
      console.log('発展前 技術:', this.status.tech,'信仰:', this.status.faith)
      // 収入フェーズに効果があるカードを取得
      this.existCardList.forEach(unit => {
        // スキル１の処理
        const skill1 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId1)
        this.addDevelop(skill1)
        // スキル２の処理
        const skill2 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId2)
        this.addDevelop(skill2)
      })
      console.log('発展後 技術:', this.status.tech,'信仰:', this.status.faith)
    },
    /**
     * 発展計算
     * @param {Object} skill スキル
     */
    addDevelop(skill){
      if(!_.isEmpty(skill) && skill.activePhase === PHASE.DEVELOP){
          switch(skill.effectTarget) {
          case TARGET.TECH:
            this.status.tech += skill.effectValue
            break;
          case TARGET.FAITH:
            this.status.faith += skill.effectValue
            break;
          }
        }
    },
    /**
     * 収入フェーズ処理
     */
    incomePhase(){
      console.log('■■■■■■■収入■■■■■■■')
      // ダイアログ表示
      this.$refs.incomePhaseDialog.openDialog('収入フェーズです\r\nお金が手に入ります')
      // 収入計算
      let income = 3
      // 収入フェーズに効果があるカードを取得
      this.existCardList.forEach(unit => {
        // スキル１の処理
        const skill1 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId1)
        income += this.addIncome(skill1)
        // スキル２の処理
        const skill2 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId2)
        income += this.addIncome(skill2)
      })
      // お金に追加
      console.log('お金もらう前:', this.status.money)
      this.status.money += income
      console.log('お金もらった後:', this.status.money)
    },
    /**
     * 収入計算
     * @param {Object} skill スキル
     * @returns 追加収入
     */
    addIncome (skill) {
      if(!_.isEmpty(skill) && skill.activePhase === PHASE.INCOM){
        // 技術レベルバフ
        if (!_.isEmpty(skill.synergyTarget) && skill.synergyTarget === SYNERGY.TECH_LEVEL) {
          return skill.effectValue * this._getLevel(this.status.tech)
        } else {
        // バフなし固定値
          return skill.effectValue
        }
      } else {
        return 0
      }
    },
    /**
     * VPフェーズ処理
     */
     vpPhase(){
      console.log('■■■■■■■VP■■■■■■■')
      // ダイアログ表示
      this.$refs.vpPhaseDialog.openDialog('VPフェーズです\r\nVPが手に入ります')
      // VP計算
      let addVP = 0
      // VPフェーズに効果があるカードを取得
      this.existCardList.forEach(unit => {
        // スキル１の処理
        const skill1 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId1)
        addVP += this.addVP(skill1)
        // スキル２の処理
        const skill2 = this.cardData.skillList.find(skill => skill.skillId === unit.skillId2)
        addVP += this.addVP(skill2)
      })
      console.log('vpもらう前:', this.status.vp)
      // VPに追加
      this.status.vp += addVP
      console.log('vpもらった後:', this.status.vp)
      // 終了条件判定
      if (this.status.vp >= 40 || this.existCardList.length >= 9) { 
        console.log('ゲーム終了')
        // 遅延を挟んで他ユーザに通知
        setTimeout(() => {
          this.socket.emit('endGame', this.roomId)
        }, 500);
        return
      }
    },
    /**
     * VP計算処理
     */
     addVP (skill) {
      if(!_.isEmpty(skill) && skill.activePhase === PHASE.VP){
        let addVp = 0
        const under3CostUnits = this.existCardList.filter(card => card.cost <= 3)
        const upper4CostUnits = this.existCardList.filter(card => card.cost >= 4)
        const upper4ForceUnits = this.existCardList.filter(card => card.force >= 4)
        switch(skill.synergyTarget) {
          // 技術レベル
          case SYNERGY.TECH_LEVEL:
            addVp = skill.effectValue * this._getLevel(this.status.tech)
            break
          // 信仰レベル
          case SYNERGY.FAITH_LEVEL:
            addVp = skill.effectValue * this._getLevel(this.status.faith)
            break
          // コスト３以下のユニット
          case SYNERGY.UNDER_3_COST:
            addVp = under3CostUnits.length
            break
          // コスト４以上のユニット
          case SYNERGY.UPPER_4_COST:
            addVp = upper4CostUnits.length
            break
          // 基本戦力４以上のユニット
          case SYNERGY.UPPER_4_FORCE:
            addVp = upper4ForceUnits.length
            break
          // 固定値
          default:
            return skill.effectValue
        }
        return addVp
      } else {
        return 0
      }
     },
    /**
     * ダイアログクローズ処理
     */
    closeDialog () {
      // 手札補充
      this.$refs.handCard.reloadCard()
    },
    /**
     * 技術レベル・信仰レベル産出
     * @param { Integer } point 点数
     * @returns レベル
     */
    _getLevel (point) {
      if(point === 0) {
        return 0
      } else if(1 <= point && point <= 2) {
        return 1
      } else if(3 <= point && point <= 6) {
        return 2
      } else if(7 <= point && point <= 14) {
        return 3
      } else if(15 <= point) {
        return 4
      }
    },
    openSnackbar (message) { 
      this.message = message
      this.snackbar = true
    }
    
  }
}
</script>

<style scoped>
.border {
  border: 1px solid black;
  border-radius: 15px;
}

.custom-col {
  background-color: #eed733;
}

.custom-text {
  font-size: 18px;
}

.player-back {
  background-color:cadetblue;
}
.my-back {
  background-color:rgb(120, 236, 151);
}
.custom-text-snack {
  font-size: 50px;
}
.custom-snack {
  background-color: aquamarine;
}
.background-image {
  background-image: url('@/assets/backGround.png'); /* 画像のパスを指定 */
  background-size: cover; /* 画像をコンポーネント全体に合わせて表示 */
  background-repeat: no-repeat; /* 画像の繰り返し表示を無効化 */
}
/* 最大幅と最大高さを指定するスタイル */
.max-dimensions {
  max-width: auto; /* 最大幅を800pxに設定 */
  max-height: auto; /* 最大高さを600pxに設定 */
}

.transparent-list {
  background-color: transparent;
}
</style>
