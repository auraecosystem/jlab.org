// @ts-check

/**
 * Manually ordered sidebar for JLab container docs
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  tutorialSidebar: [
    { type: 'doc', id: 'intro', label: 'Welcome' },
    { type: 'doc', id: 'gitlab', label: 'GitLab @ JLab' },
    { type: 'doc', id: 'cicd', label: 'GitLab CI/CD' },
    { type: 'doc', id: 'pages', label: 'GitLab Pages' },
    { type: 'doc', id: 'container_registry', label: 'Container Registry' },
    { type: 'doc', id: 'faqs', label: 'FAQs' },
  ],
};

export default sidebars;

