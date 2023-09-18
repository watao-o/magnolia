<template>
  <v-container>
    <div class="" style="width:auto;">
      <canvas :id="canvasName" class="border"/>
    </div>
  </v-container>
</template>
<script>
import { fabric } from 'fabric'
import { CARD_SIZE } from '@/const/common'

export default {
  name: 'otherCardPlace',
  props: {
    canvasName: { type: String , require: true},
    // 他プレイヤーのカード
    cards: { type: Array },
    canvasWidth: { type: Number}
  },
  data () {
    return {
      canvaz: null,
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
      this.canvaz = new fabric.Canvas(this.canvasName)
      this.canvaz.setWidth(CARD_SIZE.X * 3)
      this.canvaz.setHeight(CARD_SIZE.Y * 3)

      this.canvaz.selectable = false
      const x = 3
      const y = 3
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
        }
      }
      // ウィンドウサイズ変更イベント
      window.addEventListener('resize', () => {
        this.resize()
      })
    },
    resize () {
      const zoomFactor = this.canvasWidth / (CARD_SIZE.X * 5)
      this.canvaz.setZoom(zoomFactor)
      this.canvaz.setWidth(CARD_SIZE.X * 3 * zoomFactor)
      this.canvaz.setHeight(CARD_SIZE.Y * 3 * zoomFactor)
      this.canvaz.renderAll()
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
      // ポジションの最小値を取得
      const minX = newCards ? Math.min(...newCards.map(c => c.posX)) : 0
      const minY = newCards ? Math.min(...newCards.map(c => c.posY)) : 0
      // 新しいカードを再描画
      newCards.forEach(c => {
        // カード設置
        fabric.Image.fromURL(c.img, (obj) =>  {
          var oImg = obj.set({ 
              left: CARD_SIZE.X * (c.posX - minX),
              top: CARD_SIZE.Y * (c.posY - minY)
            })
          oImg.scaleToWidth(CARD_SIZE.X)
          oImg.selectable = false
          oImg.id = 'card'
          this.canvaz.add(oImg)
        })
      })
      this.canvaz.renderAll()
   }
  }
}
</script>

