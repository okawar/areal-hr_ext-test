export default {
  base: "/docs/",
  title: 'HR-система',
  description: 'Документация для HR-системы',
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Руководство', link: '/guide/intro' },
      { text: 'API', link: '/guide/api' },
      { text: 'GitHub', link: 'https://github.com/okawar/areal-hr_ext-test' }
    ],
    sidebar: {
      '/guide/': [
        { text: 'Введение', link: '/guide/intro' },
        { text: 'Установка', link: '/guide/installation' },
        { text: 'API', link: '/guide/api' },
        { text: 'Руководство пользователя', link: '/guide/user-guide' },
        { text: 'FAQ', link: '/guide/faq' }
      ]
    }
  }
}
