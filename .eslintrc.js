module.exports = {
  root: true,
  env: {
    node: true
  },
  /*
    配置让eslint忽略与perttier冲突的检查：extends：['plugin:prettier/recommended']。
    然而我不想这样子做，我想保留eslint的一些校验规则，
    可以先使用prettier格式化，再使用eslint修复。让prettier兼容eslint。
  */
  extends: ['plugin:vue/essential', '@vue/standard'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['warn', 'always']
  }
}
