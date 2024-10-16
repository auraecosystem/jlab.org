.. highlight:: shell

.. _pages:

GitLab Pages
------------

GitLab Pages is a feature that allows you to publish static websites directly from a repository in GitLab. 

To use it:

1. Enable the Container Registry for your project. 
        - Go to settings -> General -> expand “Visibility, project features, permissions” and check the “Wiki”
        - You can set the visibility of the pages according to the needs of your project.

Here's a basic configuration:

.. code-block:: yaml

   pages:
     stage: deploy
     script:
       - mkdir .public
       - cp -r * .public
       - mv .public public
     artifacts:
       paths:
         - public
     only:
       - main

This job creates a ``public`` directory with your static content and deploys it to GitLab Pages.

More info: `GitLab Pages Documentation <https://docs.gitlab.com/ee/user/project/pages/>`_

Example repo with page is `here <https://code.jlab.org/panta/hcana_container_doc>`_  with corresponding page is this doc `<https://pages.jlab.org/panta/hcana_container_doc/>`_ . Where my ``.gitlab-ci.yml`` is:


.. code-block:: yaml

    image: python:3.7-alpine
    
    pages:
    stage: deploy
    before_script:
        - apk add --no-cache make
    script:
        - pip install -U sphinx sphinx-rtd-theme sphinx-copybutton
        - make html
        - mkdir public
        - cp -r docs/html/* public
    artifacts:
        paths:
        - public
    rules:
        - if: $CI_COMMIT_REF_NAME == $CI_DEFAULT_BRANCH

After the pipeline completes successfully, your pages will be deployed. You can find the page link at Deploy -> Pages. 
