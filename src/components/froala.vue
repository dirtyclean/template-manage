<template>
    <froala :config="froalaConfig" :value="value" :onManualControllerReady="initializeFroala"></froala>
</template>
<script>
const tool = [
  'fullscreen',
  'insertLink',
  'insertImage',
  'insertVideo',
  'undo',
  'redo',
  'clearFormatting',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'fontFamily',
  'fontSize',
  'textColor',
  'color',
  'backgroundColor',
  'inlineStyle',
  'paragraphFormat',
  'align',
  'formatOL',
  'formatUL',
  'outdent',
  'indent',
  'quote',
  'embedly',
  'insertTable',
  'specialCharacters',
  'insertHR',
  'selectAll',
  'print',
  'spellChecker',
  'html',
  'help'
]
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    this.initFroalaControls = null
    this.isFroalaFocus = false
    return {
      froalaConfig: {
        language: 'zh_cn',
        // 后端必须返回这种格式{"link":"http://i.froala.com/download/c851ce49b4d7f086fa323a7818387a7797074182.png?1611043615"}
        // imageUploadURL: this.$apiReq.uoloadArticleBodyFile, // http://i.froala.com/upload
        // imageUploadParams: {},
        // videoUploadURL: this.$apiReq.uoloadArticleBodyFile,
        videoMaxSize: 50 * 1024 * 1024, // 最大50M
        // requestHeaders: {
        //     pcbstoken: getStorage('token'),
        // },
        heightMin: 200,
        heightMax: 205,
        toolbarButtons: tool,
        toolbarSticky: true, // 操作栏是否自动吸顶 存在兼容性问题
        tabSpaces: 0,
        zIndex: 9999,
        events: {
          initialized: () => {
            console.log('initialized')
            // 设置tabSpaces: 0, 重新定义按下tab事件
            document.addEventListener('keyup', this.setTab)
          },
          contentChanged: () => {
            const editor = this.initFroalaControls.getEditor()
            // Live Code Preview： editor.codeBeautifier.run(editor.html.get())即代码视图的内容
            console.log(
              'contentChanged-实时代码Live Code Preview：',
              editor,
              editor.codeBeautifier.run(editor.html.get())
            )
            // Live Content Preview：editor.html.get()
            console.log('contentChanged-实时Live Content Preview：', editor.html.get())
            this.$emit('change', editor.html.get())
          },
          focus: () => {
            console.log('focus')
            this.isFroalaFocus = true
          },
          blur: () => {
            setTimeout(() => {
              console.log('blur')
              this.isFroalaFocus = false
            }, 200)
            const editor = this.initFroalaControls.getEditor()
            if (editor.codeView.isActive()) {
              this.$emit('change', editor.codeView.get())
            }
          },
          destroy: () => {
            console.log('destroy')
            document.removeEventListener('keyup', this.setTab)
          },
          keyup: e => {
            // tabSpaces: 0时, 按下tab,自带的keyup事件不会被激活且会失去焦点
            console.log('keyup')
          },
          'image.error': (error, response) => {
            console.log(error, response, 'error, response')
            try {
              const { errCode, msg } = JSON.parse(response)
              if (errCode === 401) {
                this.$notification401(msg)
              } else {
                this.$message.error(msg || '服务器错误')
              }
            } catch (e) {
              console.log(e, 'e')
              this.$message.error('服务器错误')
            }
          },
          'video.error': (error, response) => {
            console.log(error, response, 'error, response')
            if (error.code === 5) {
              this.$message.warning('视频超过50M')
              return
            }
            try {
              const { errCode, msg } = JSON.parse(response)
              if (errCode === 401) {
                this.$notification401(msg)
              } else {
                this.$message.error(msg || '服务器错误')
              }
            } catch (e) {
              console.log(e, 'e')
              this.$message.error('服务器错误')
            }
          }
        }
      }
    }
  },
  props: {
    value: {
      type: undefined,
      required: false,
      default: undefined
    }
  },
  methods: {
    setTab (event) {
      if (event.code === 'Tab') {
        console.log(this.isFroalaFocus, 'this.isFroalaFocus')
        if (!this.isFroalaFocus) return
        setTimeout(() => {
          const editor = this.initFroalaControls.getEditor()
          console.log('ChinaTab')
          editor.html.insert('&emsp;&emsp;')
        }, 200)
      }
    },
    initializeFroala (initControls) {
      this.initFroalaControls = initControls
      this.initFroalaControls.initialize() // 初始化Froala编辑器
    }
  }
}
</script>
<style lang="scss">
.fr-second-toolbar {
    #fr-logo {
        display: none;
    }
}
</style>
