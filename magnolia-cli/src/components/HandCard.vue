<template>
  <v-container>
    <div class="" style="width: 600px">
      <canvas id="handCanvas" class="border" />
    </div>
  </v-container>
</template>

<script>
import { fabric } from 'fabric'
import { CARD_SIZE } from '@/const/common'
import _ from 'lodash'

export default {
  name: 'handCard',
  props: {
    selectedCard: { type: Object },
    deckCards: { type: Object },
    canvasWidth: { type: Number }
  },
  data () {
    return {
      canvaz: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.canvaz = new fabric.Canvas('handCanvas')
      this.resize()
      // this.canvaz.setWidth(CARD_SIZE.X * 5);
      // this.canvaz.setHeight(CARD_SIZE.Y * 2);

      const x = 5
      const y = 2
      for (let i = 0; i < x; i++) {
        for (let j = 0; j < y; j++) {
          const rect = new fabric.Rect({
            left: i * CARD_SIZE.X,
            top: j * CARD_SIZE.Y,
            width: CARD_SIZE.X,
            height: CARD_SIZE.Y,
            fill: '#2222',
            stroke: 'brack',
            strokeWidth: 1,
            selectable: false
          })
          this.canvaz.add(rect)
        }
      }
    },
    resize () {
      const zoomFactor = this.canvasWidth / (CARD_SIZE.X * 5)
      this.canvaz.setZoom(zoomFactor)
      this.canvaz.setWidth(CARD_SIZE.X * 5 * zoomFactor)
      this.canvaz.setHeight(CARD_SIZE.Y * 2 * zoomFactor)
      const imgs = this.canvaz.getObjects().filter((obj) => obj.type === 'image')
      imgs.forEach(img => {
        this.canvaz.remove(img)
      })
      imgs.forEach(img => {
        this.canvaz.add(img)
      })
      this.canvaz.renderAll()
    },
    /**
     * カード置き場にカード描画：sample
     */
    _drawCard () {
      const x = 5
      const y = 2
      // 手札に引いたカードリスト
      const removeCards = []
      for (let i = 0; i < x; i++) {
        for (let j = 1; j < y; j++) {
          // ランダムでカード取得
          const selectImg =
            this.deckCards[this.getRandomInt(this.deckCards.length - 1)]
          // 引いたカードを山札から除外する
          removeCards.push(selectImg)
          fabric.Image.fromURL(selectImg.img, (obj) => {
            const oImg = obj.set({ left: CARD_SIZE.X * i, top: CARD_SIZE.Y * j })
            // サイズを調整
            oImg.scaleToWidth(CARD_SIZE.X)
            oImg.selectable = false
            // Imgデータを持たせる
            oImg.imgData = selectImg
            this.canvaz.add(oImg)
            this._setCardEvent(oImg)
          })
        }
      }

      this.$emit('removeDeckCards', removeCards)
    },
    /**
     * イベントリスナー
     */
    _setCardEvent (obj) {
      obj.on('mousedown', () => {
        const objs = this.canvaz.getObjects()
        const imgs = objs.filter((obj) => obj.type === 'image')
        const moveImg = imgs.find((img) => img.top === 0)
        // 選択カードが下に手元にあるなら（選択中でなければ）
        if (obj.top === CARD_SIZE.Y) {
          if (!_.isEmpty(moveImg)) {
            // 選択中のカードを元の位置に戻す
            moveImg.top = CARD_SIZE.Y
          }
          // クリックしたーカードを選択する
          obj.top -= CARD_SIZE.Y
          this.$emit('updateSelectedCard', obj.imgData)
        }
      })
    },
    removeHnadCard () {
      const moveImg = this.canvaz
        .getObjects()
        .filter((obj) => obj.type === 'image')
        .find((img) => img.top === 0)
      this.canvaz.remove(moveImg)
    },
    /**
     * 手札補充処理
     */
    reloadCard () {
      console.log('手札補充処理')
      const x = 5
      const y = 2
      for (let i = 0; i < x; i++) {
        for (let j = 1; j < y; j++) {
          // ランダムの画像取得
          const selectImg =
            this.deckCards[this.getRandomInt(this.deckCards.length - 1)]
          fabric.Image.fromURL(selectImg.img, (obj) => {
            const imgs = this.canvaz
              .getObjects()
              .filter((obj) => obj.type === 'image')
            // カードが設置していなければ設置する
            if (!imgs.find((img) => img.left === CARD_SIZE.X * i)) {
              // 山札から除外
              this.$emit('removeDeckCards', [selectImg])

              const oImg = obj.set({
                left: CARD_SIZE.X * i,
                top: CARD_SIZE.Y * j
              })
              oImg.scaleToWidth(CARD_SIZE.X)
              oImg.selectable = false
              // Imgデータを持たせる
              oImg.imgData = selectImg
              this.canvaz.add(oImg)
              this._setCardEvent(oImg)
            } else {
              // console.log('設置済みのカード存在する i=', i)
            }
          })
        }
      }
    },
    /**
     * undo
     */
    undo (addCards) {
      const ac = addCards[0]
      const imgs = this.canvaz
        .getObjects()
        .filter((obj) => obj.type === 'image')
      for (let i = 0; i < 5; i++) {
        if (!imgs.find((img) => img.left === CARD_SIZE.X * i)) {
          fabric.Image.fromURL(ac.img, (obj) => {
            const oImg = obj.set({
              left: CARD_SIZE.X * i,
              top: CARD_SIZE.Y * 1
            })
            oImg.scaleToWidth(CARD_SIZE.X)
            oImg.selectable = false
            // Imgデータを持たせる
            oImg.imgData = { ...ac }
            this.canvaz.add(oImg)
            this._setCardEvent(oImg)
          })
        }
      }
    },
    /**
     * 0~maxのランダムの整数取得
     */
    getRandomInt (max) {
      return Math.floor(Math.random() * (max + 1))
    }
  }
}
</script>
