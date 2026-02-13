import {themes as prismThemes} from 'prism-react-renderer';

const isDeploy = process.env.DEPLOY_ENV === 'production';

export default {
  title: 'Jefferson Lab LLM Deployments',
  url: isDeploy ? 'https://pages.jlab.org' : 'http://localhost:3000',
  baseUrl: isDeploy ? '/scicomp/software/code-gitlab-docs/' : '/',

  favicon: 'img/favicon.svg',
  organizationName: 'SciComp',
  projectName: 'code-gitlab-docs',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        docsRouteBasePath: '/', // matches your docs config
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'GitLab at JLab',
      logo: {
        alt: 'JLab Logo',
        src: '/img/JSA_SuraCompany_ColorLogo.svg',
        srcDark: '/img/JSA_SuraCompany_ColorLogo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          type: 'search',
          position: 'right',
        },  
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'java'],
    },
  },
};
