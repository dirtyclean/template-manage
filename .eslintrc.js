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
// prettier 只是会帮我们格式化代码，并不能够修复所有 eslint 错误，比如定义未使用的变量，prettier 不会自动帮我们删除，要手动删除。
// 因此，prettier 后再 eslint，是有必要的。
