module.exports = {
  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾去除分号
  semi: false,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // jsx 中使用双引号
  jsxSingleQuote: true,
  // 末尾使用逗号
  trailingComma: 'es5',
  // 大括号内的首尾需要空格 { foo: bar }
  bracketSpacing: true,
  // 多行HTML、JSX等元素的结束标签 > 放在最后一行
  bracketSameLine: false,
  // 箭头函数，只有一个参数的时候不需要括号
  arrowParens: 'avoid',
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准
  proseWrap: 'preserve',
  // HTML/Vue 文件中空白处理遵循 CSS 规则
  htmlWhitespaceSensitivity: 'css',
  // Vue文件中script和style标签是否缩进
  vueIndentScriptAndStyle: false,
  // 换行符
  endOfLine: 'auto',
  // 控制如何格式化嵌入在其他语言
  embeddedLanguageFormatting: 'auto',
  // 在HTML、Vue和JSX中每行强制执行一个属性。
  singleAttributePerLine: false,
}
