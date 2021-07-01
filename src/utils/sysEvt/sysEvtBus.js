import Vue from 'vue'
import EVT_ENUM_CONST from './sysEvtEnum.js'
const EVT_BUS = new Vue()
const eventRegs = new Map()
// 注册
function regOnEvent(vueName, evtType, evtHandler, uid) {
  let vueEvtMap = {}
  if (eventRegs.has(vueName)) {
    vueEvtMap = eventRegs.get(vueName)
  } else {
    vueEvtMap = new Map()
    eventRegs.set(vueName, vueEvtMap)
  }
  if (uid) {
    evtType += uid
    console.log('事件名', vueName + '[' + evtType + ']')
  }
  if (vueEvtMap.has(evtType) === false) {
    EVT_BUS.$on(evtType, evtHandler)
    vueEvtMap.set(evtType, evtHandler)
    return
  }
  console.log('已注册事件', vueName + '[' + evtType + ']')
}
// 清理
function regOffEvent(vueName) {
  console.log('Clear Event Begin--', vueName)
  if (eventRegs.has(vueName)) {
    const vueEvtMap = eventRegs.get(vueName)
    vueEvtMap.forEach((value, key) => {
      EVT_BUS.$off(key, value)
    })
    const beforeCnt = vueEvtMap.size
    vueEvtMap.clear()
    console.log('[' + vueName + ']清理事件 Cnt:' + beforeCnt + '-->', vueEvtMap.size)
  }
}
// 触发
function raiseEvent(evtType, evtParam, uid) {
  if (uid) {
    evtType += uid
    console.log('[raise]', evtType)
  }
  EVT_BUS.$emit(evtType, evtParam)
}
const globalEventPlugin = {}
globalEventPlugin.install = vueInstance => {
  console.log('INIT PLUG -Global Event Bus')
  vueInstance.prototype.EVT_BUS = new Vue()
  vueInstance.prototype.REG_ON_EVT = regOnEvent
  vueInstance.prototype.RAISE_EVT = raiseEvent
  vueInstance.prototype.REG_OFF_EVT = regOffEvent
  vueInstance.prototype.EVT_ENUM = EVT_ENUM_CONST
}
Vue.use(globalEventPlugin)
