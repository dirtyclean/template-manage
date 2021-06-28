module.exports = {
  root: true,
  env: {
    node: true
  },
  /*
    配置让eslint忽略与perttier冲突的检查时，extends：['plugin:prettier/recommended'] 导致编辑器不抛一些错,以及失去自动修复功能 只有执行eslint --fix时才能发现
    so, 先使用prettier格式化，再使用eslint修复。让prettier兼容eslint。
  */
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
