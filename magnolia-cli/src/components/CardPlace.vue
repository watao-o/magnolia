<template>
  <v-container>
    <div class="" style="width:600px;">
      <!-- <canvas id="cardCanvas" class="border"/> -->
      <canvas :id="canvasName" class="border"/>
    </div>
  </v-container>
</template>
<script>
import { fabric } from 'fabric'
// import { utils } from '@/utils/commonUtils'
import { CARD_SIZE } from '@/const/common'
import _ from 'lodash'
import CardData from '@/assets/data.json'

export default {
  name: 'cardPlace',
  props: {
    selectedCard: { type: Object },
    cardImgList: { type:Array },
    canvasName: { type: String , require: true},
    status: { type: Object },
    addCards: { type: Object },
    // 他プレイヤーのカード
    cards: { type: Array }
  },
  // mixins: [utils],
  data () {
    return {
      canvaz: null,
      // カード設置回数
      installCount: 0,
      maxPos: {x: 4, y:4},
      minPos: {x: 0, y:0}
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    // 他プレイヤーのカード情報が更新されたら再描画
    cards: {
      handler: function(newCards) {
        // 描画しているものをクリア
        this._drawOtherPlayerCards(newCards)
      },
      deep : true
    }
  },
  methods: {
    init () {
      // this.canvaz = new fabric.Canvas('cardCanvas')
      this.canvaz = new fabric.Canvas(this.canvasName)
      this.canvaz.setWidth(CARD_SIZE.X * 5)
      this.canvaz.setHeight(CARD_SIZE.Y * 5)

      this.canvaz.selectable = false
      const x = 5
      const y = 5
      for(let i = 0 ; i < x ; i++) {
        for(let j = 0 ; j < y ; j++) {
          const rect = new fabric.Rect({
            left: i * CARD_SIZE.X,
            top: j * CARD_SIZE.Y,
            width: CARD_SIZE.X,
            height: CARD_SIZE.Y, 
            fill: '#2222',
            stroke: 'brack',
            strokeWidth: 1,
            selectable: false,
            posX: i,
            posY: j
          })
          this.canvaz.add(rect)
          this.setClickEvent(rect)
        }
      }
    },
    /**
     * イベントリスナー
     */
     setClickEvent (rect) {
      // クリック処理
      // カード設置処理
      rect.on('mousedown', () => {
        if (rect.Installable) {
          // 残金をカードのコストが超える場合
          if (this.chkCost()) {
            console.log('お金足りない')
            this.$emit('openSnackbar', 'お金が足りません。')
            return;
          }
          // カード設置
          fabric.Image.fromURL(this.selectedCard.img, (obj) =>  {
            var oImg = obj.set({ 
              left: this._approximateNumber(rect.left,CARD_SIZE.X),
               top: this._approximateNumber(rect.top,CARD_SIZE.Y)
              })
            oImg.scaleToWidth(CARD_SIZE.X)
            oImg.selectable = false
            oImg.id = 'card'
            // カードの位置を設定
            oImg.posX = rect.left / CARD_SIZE.X
            oImg.posY = rect.top / CARD_SIZE.Y
            // 縦横３枚設置したかチェック
            this.chkMaxPos(oImg.posX, oImg.posY)
            this.canvaz.add(oImg)
          })
          this.installCount++
          // 選択した手札を撤去
          this.$emit('removeHnadCard')
          // 選択カード情報に位置情報を追加
          const selectedCardInfo = {
            ...this.selectedCard,
            posX: rect.left / CARD_SIZE.X,
            posY: rect.top / CARD_SIZE.Y
          }
          // 設置済みカードに追加
          this.$emit('addExistCardList',selectedCardInfo)
          // ハイライトを解除
          this._disHighLight()
        }
      })
    },
    /**
     * コストチェック
     */
    chkCost () {
      // 設置カードのコストを取得
      let totalCost = CardData.unitList.find(u => u.unitId === this.selectedCard.unitId).cost
      // 同ターンで設置済みのカードがあれば考慮する
      if (!_.isEmpty(this.addCards)) {
        totalCost += CardData.unitList.find(u => u.unitId === this.addCards[0].unitId).cost
      }
      // カード設置1枚目なら残金+1まで設置可能
      // 2枚目なら残金を超える設置は不可
      return _.isEmpty(this.addCards) ? this.status.money + 1 < totalCost : this.status.money < totalCost
    },
    /**
     * カード縦横３枚設置チェック
     */
    chkMaxPos(posX, posY) {
      // カードのリストを取得
      const imgList = this._getImgObjList()
      // X軸に３枚並んでるかチェック
      const xList = imgList.map(img => img.posX)
      xList.push(posX)
      const maxPosX = Math.max(...xList)
      const minPosX = Math.min(...xList)
      if (maxPosX - minPosX >= 2) {
        this.maxPos.x = maxPosX
        this.minPos.x = minPosX
      }
      // Y軸に３枚並んでるかチェック
      const yList = imgList.map(img => img.posY)
      yList.push(posY)
      const maxPosY = Math.max(...yList)
      const minPosY = Math.min(...yList)
      if (maxPosY - minPosY >= 2) {
        this.maxPos.y = maxPosY
        this.minPos.y = minPosY
      }
    },
    /**
     * カードハイライト
     */
    highlight () {
      const cardObjs = this._getImgObjList()
      // カード設置枚数が0枚なら真ん中をハイライト
      if (cardObjs.length === 0) {
        // 中心のrectを取得
        const centerRect = this.canvaz.getObjects().filter(obj => obj.type === 'rect')
                                                    .find(rect => rect.posX === 2 && rect.posY === 2)
        centerRect.set({ fill: this._getHighlightFill()})
        centerRect.Installable = true

        this.canvaz.renderAll()
      }
      // カード設置済みなら上下左右のカードエリアを取得してハイライト
      cardObjs.forEach(cObj => {
        this._getNextCard(cObj, cardObjs)
      })
    },
    /**
     * 隣接するカードを取得
     */
    _getNextCard (cardObj, cardObjs) {
      const cCoords = cardObj.aCoords
      const [cL, cT, cR, cB] = [
          this._approximateNumber(cCoords.tl.x, CARD_SIZE.X),
          this._approximateNumber(cCoords.tl.y, CARD_SIZE.Y),
          this._approximateNumber(cCoords.br.x, CARD_SIZE.X),
          this._approximateNumber(cCoords.br.y, CARD_SIZE.Y),
      ]
      const rects = this.canvaz.getObjects().filter(obj => obj.type === 'rect')
      rects.forEach(rect => {
        // Y軸に並んでる枚数
        const yLength = cardObjs.filter(obj => obj.posX === cardObj.posX).length
        // X軸に並んでる枚数
        const xLength = cardObjs.filter(obj => obj.posY === cardObj.posY).length
        const rCoords = rect.aCoords
        const [rL, rT, rR, rB] = [
          this._approximateNumber(rCoords.tl.x, CARD_SIZE.X),
          this._approximateNumber(rCoords.tl.y, CARD_SIZE.Y),
          this._approximateNumber(rCoords.br.x, CARD_SIZE.X),
          this._approximateNumber(rCoords.br.y, CARD_SIZE.Y),
        ]
        // カードの上
        const conditions1 = cL === rL && cT === rB && yLength < 3
        // カードの左
        const conditions2 = cT === rT && cL === rR && xLength < 3
        // カードの右
        const conditions3 = cT === rT && cR === rL && xLength < 3
        // カードの下
        const conditions4 = cL === rL && cB === rT && yLength < 3
        // カードに隣接している場合ハイライト
        if (conditions1 || conditions2 || conditions3 || conditions4) {
          // 縦、横に３枚設置済みで３×３をはみ出す位置なら除外
          if ((rect.posX < this.minPos.x || this.maxPos.x < rect.posX) ||
              (rect.posY < this.minPos.y || this.maxPos.y < rect.posY)){
          // カードが隣接しているなら
          } else {
            // ブレンドモードを設定
            rect.set({ fill: this._getHighlightFill()})
            rect.Installable = true
          }
        }
      })
      this.canvaz.renderAll()
    },
    _approximateNumber (num, multiple) {
      return Math.round(num / multiple) * multiple
    },
    /**
     * ハイライトのグラデーション取得
     */
    _getHighlightFill () {
      return new fabric.Gradient({
              type: 'linear',
              coords: { x1: 0, y1: 0, x2: 0, y2: CARD_SIZE.Y },
              colorStops: [
                { offset: 0, color: 'blue' },
                { offset: 1, color: 'white' }
              ],
          })
    },
    /** 
     * ハイライト解除
     */
    _disHighLight () {
      const rects = this.canvaz.getObjects().filter(obj => obj.type === 'rect')
      rects.forEach(rect => {
        rect.Installable = false
        rect.set({fill: '#2222' })
      })
      if (this.installCount >= 2) {
        this.installCount = 0
        // alert('2枚設置したのでターン終了します')
        this.$emit('endPhase')
      }
    },
    /**
     * 他プレイヤーのカード描画
     */    
    _drawOtherPlayerCards (newCards) {
      // 描画しているカードを全撤去
      const oldCards = this.canvaz.getObjects().filter(obj => obj.type === 'image')
      oldCards.forEach(c => {
        this.canvaz.remove(c)
      })
      // 新しいカードを再描画
      newCards.forEach(c => {
        // カード設置
        fabric.Image.fromURL(c.img, (obj) =>  {
          var oImg = obj.set({ 
              left: CARD_SIZE.X * c.posX,
              top: CARD_SIZE.Y * c.posY
            })
          oImg.scaleToWidth(CARD_SIZE.X)
          oImg.selectable = false
          oImg.id = 'card'
          this.canvaz.add(oImg)
        })
      })
      this.canvaz.renderAll()
   },
    /**
     * 0~maxのランダムの整数取得
     */
     getRandomInt(max) {
      return Math.floor(Math.random() * (max + 1))
    },
    _getImgObjList() {
      return this.canvaz.getObjects().filter(obj => obj.type === 'image')
    }
  }
}
</script>

