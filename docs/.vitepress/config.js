

export default {
  title: 'geo-types-cz',
  ignoreDeadLinks: true,
  description: '完整的 TypeScript GeoJSON 类型定义包',
  lang: 'zh-CN',
  base: '/geo-types-cz/',
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3c8772' }]
  ],

  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started' },
      { text: 'API 文档', link: '/api/' },
      { text: '示例', link: '/examples/' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com/Thunder7991/geo-types-cz' },
          { text: 'NPM', link: 'https://www.npmjs.com/package/geo-types-cz' }
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '快速开始', link: '/guide/getting-started' },
          ]
        }
      ],
      '/api/': [
        {
          text: 'API 参考',
          items: [
            { text: '概览', link: '/api/' },
            { text: '几何类型', link: '/api/geometry' },
            { text: '要素类型', link: '/api/feature' },
            { text: '坐标参考系统', link: '/api/crs' },
            { text: '边界框', link: '/api/bbox' },
            { text: '扩展类型', link: '/api/extensions' },
            { text: '工具函数', link: '/api/utils' },
            { text: '服务函数', link: '/api/service' }
          ]
        }
      ],
      '/examples/': [
        {
          text: '示例',
          items: [
            { text: '基础用法', link: '/examples/' },
            // { text: '地图应用', link: '/examples/map' },
            // { text: '数据可视化', link: '/examples/visualization' },
            // { text: '空间分析', link: '/examples/analysis' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Thunder7991/geo-types-cz' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 geo-types-cz'
    },

    editLink: {
      pattern: 'https://github.com/Thunder7991/geo-types-cz/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    search: {
      provider: 'local'
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true
  }
}