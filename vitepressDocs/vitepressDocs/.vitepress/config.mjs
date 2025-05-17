export default {
  title: 'HR-система',
  description: 'Документация для HR-системы учета сотрудников',
  base: '/areal-hr_ext-test/', // Для GitHub Pages, замените на имя репозитория
  themeConfig: {
    logo: '/logo.png', // Если добавили логотип
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Руководство', link: '/guide/intro' },
      { text: 'GitHub', link: 'https://github.com/<ваш_логин>/areal-hr_ext-test' }
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Руководство',
          items: [
            { text: 'Введение', link: '/guide/intro' },
            { text: 'Установка', link: '/guide/installation' },
            { text: 'Начало работы', link: '/guide/getting-started' },
            { text: 'Использование', link: '/guide/usage' },
            { text: 'API', link: '/guide/api' },
            { text: 'Устранение неисправностей', link: '/guide/troubleshooting' },
            { text: 'Контрибьютинг', link: '/guide/contributing' },
            { text: 'FAQ', link: '/guide/faq' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/<ваш_логин>/areal-hr_ext-test' }
    ],
    footer: {
      message: 'Лицензия MIT',
      copyright: '© 2025 HR-система'
    }
  }
}