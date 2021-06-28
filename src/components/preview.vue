<template>
  <a-modal
    :title="modalTitle"
    :visible="isShowModal"
    width="60%"
    :footer="null"
    dialogClass="custom-modal-h"
    @cancel="handleCancel"
    :maskClosable="false"
    :bodyStyle="
      fileType !== 'pdf'
        ? {
            display: 'flex', // 初始水平垂直居中
            'justify-content': 'center',
            'align-items': 'center'
          }
        : null
    "
  >
    <a-spin :spinning="modalLoading" v-if="modalLoading" />
    <template v-else>
      <iframe v-if="fileType === 'pdf'" :src="fileSrc" frameborder="0" width="100%" height="98%"></iframe>
      <template v-else>
        <img
          id="previewImg"
          class="preview-img"
          :src="fileSrc"
          alt=""
          ref="img"
          :style="`transform: scale(${this.multiples}) rotateZ(${this.deg}deg);`"
          v-drag
        />
        <div class="look-image-footer">
          <div>
            <a-icon type="zoom-in" @click="magnify" class="icon" />
            <a-icon type="zoom-out" @click="shrink" class="icon" />
            <a-icon type="fullscreen" @click="fullscreen" class="icon" v-if="!isFullscreen" />
            <a-icon type="fullscreen-exit" @click="fullscreen" class="icon" v-if="isFullscreen" />
            <a-icon type="redo" @click="rotate" class="icon" />
          </div>
        </div>
      </template>
    </template>
  </a-modal>
</template>
<script>
import { Modal, Icon, Spin } from 'ant-design-vue'
export default {
  name: 'preview',
  data () {
    return {
      multiples: 1, // 放大或者缩小
      deg: 0, // 旋转的角度
      fileSrc: '',
      modalLoading: false,
      isFullscreen: false
    }
  },
  directives: {
    drag: {
      inserted: (el, binding, vnode) => {
        const oDiv = el // 当前元素
        // 禁止选择网页上的文字
        // 比如在很多地方当用户双击时，一些元素会变成蓝色（选中状态），而当我们要避免这种情况时就可以使用该事件。
        document.onselectstart = function () {
          return false
        }
        oDiv.onmousedown = function (e) {
          console.log('onmousedown')
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - oDiv.offsetLeft
          const disY = e.clientY - oDiv.offsetTop
          document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            const l = e.clientX - disX
            const t = e.clientY - disY
            // 移动当前元素
            oDiv.style.left = l + 'px'
            oDiv.style.top = t + 'px'
            // 初始化居中，父元素设置了flex，导致拖曳时定位有偏差，这里还原
            document.getElementsByClassName('ant-modal-body')[0].style.display = 'block'
          }
          document.onmouseup = function (e) {
            console.log('onmouseup')
            document.onmousemove = null
            document.onmouseup = null
          }
          // return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
          return false
        }
      }
    }
  },
  components: {
    AModal: Modal,
    AIcon: Icon,
    ASpin: Spin
  },
  props: {
    isShowModal: {
      required: true,
      type: Boolean
    },
    fileName: {
      required: false,
      type: String,
      default: ''
    },
    fileId: {
      required: true,
      type: String
    },
    modalTitle: {
      required: true,
      type: String
    },
    fileType: {
      required: true,
      type: String
    }
  },
  watch: {
    isShowModal: {
      immediate: true,
      handler: function (isShowModal) {
        if (isShowModal) {
          this.downloadPromise()
        } else {
          this.reset()
        }
      }
    }
  },
  beforeDestroy () {
    this.reset()
    document.removeEventListener('mousewheel', this.handleScroll)
  },
  mounted () {
    document.addEventListener('mousewheel', this.handleScroll)
  },
  methods: {
    handleScroll (e) {
      console.log(e, 'e')
      if (e.target.className !== 'previewImg') return
      const direction = e.deltaY > 0 ? 'down' : 'up' // deltaY为正则滚轮向下，为负滚轮向上
      if (direction === 'down') {
        this.shrink()
      } else {
        this.magnify()
      }
    },
    reset () {
      document.onselectstart = function () {
        return true
      }
    },
    downloadPromise () {
      const { fileType, fileId, fileName } = this
      this.modalLoading = true
      this.$apiReq
        .downloadPromise({ id: fileId })
        .then(res => {
          const blob = new Blob([res])
          // 生成一个blob链接
          const fileSrc = URL.createObjectURL(blob)
          if (fileType === 'pdf') {
            this.fileSrc = `/pdfjs-2.6.347-dist/web/viewer.html?file=${fileSrc}&saveName=${fileName}`
          } else {
            this.fileSrc = fileSrc
          }
          console.log(this.fileSrc, 'this.fileSrc')
        })
        .finally(() => {
          this.modalLoading = false
        })
    },
    // 全屏/原始
    fullscreen () {
      this.isFullscreen = !this.isFullscreen
      const img = document.getElementById('previewImg')
      const body = document.getElementsByClassName('ant-modal-body')[0]
      if (this.isFullscreen) {
        img.style.maxHeight = 'unset'
        img.style.maxWidth = 'unset'
        if (img.clientHeight <= body.clientHeight) {
          // 图片高度小于body高度
          img.style.height = '100%'
        } else {
          // 图片高度大于body高度
          img.style.height = 'unset'
          body.style.alignItems = 'start'
        }
      } else {
        img.style.maxHeight = '100%'
        img.style.maxWidth = '100%'
        img.style.height = 'unset'
      }
      this.multiples = 1
      this.deg = 0
      img.style.left = 0
      img.style.top = 0
      body.style.display = 'flex'
    },
    // 放大
    magnify () {
      if (this.multiples >= 10) {
        return
      }
      this.multiples += 0.25
    },
    // 缩小
    shrink () {
      if (this.multiples <= 0.25) {
        return
      }
      this.multiples -= 0.25
    },
    // 旋转
    rotate () {
      this.deg += 90
      if (this.deg >= 360) {
        this.deg = 0
      }
    },
    handleCancel () {
      this.$emit('update:isShowModal', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.icon {
  margin: 0 10px;
  font-size: 30px;
}
.preview-img {
  position: relative; // relative导致拖曳时定位有偏差（优化为absolute时，父元素要设置relative,不然会拖出去）
  max-width: 100%;
  max-height: 100%;
  cursor: move;
}
.look-image-footer {
  position: absolute;
  bottom: 50px;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 282px;
  height: 44px;
  padding: 0 23px;
  color: #fff;
  background-color: #606266;
  border-color: #fff;
  border-radius: 22px;
  transform: translateX(-50%);
  cursor: pointer;
  opacity: 0.8;
}
/deep/ .ant-spin {
  width: 100%;
  height: 400px;
  line-height: 400px;
  text-align: center;
}
</style>
