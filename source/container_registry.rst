.. highlight:: shell

.. _container_registry:

GitLab Container Registry
-------------------------

GitLab Container Registry is a secure and private registry for Docker images. It's fully integrated with GitLab, allowing you to store and manage your Docker images within your GitLab projects.

To use it:

1. Enable the Container Registry for your project.

    - Go to settings -> General -> expand "Visibility, project features, permissions" and check the "Container registry"
    - You can set the visibility of the image registry according to the needs of your project.

2. Configure your CI/CD pipeline to push images to the registry
3. Use the images in your deployments

More info: `GitLab Container Registry Documentation <https://docs.gitlab.com/ee/user/packages/container_registry/>`_

The base URL for JLab gitlab container registry is: `<https://codecr.jlab.org>`_ .

Base URL for jlab gitlab container registry is: `<https://codecr.jlab.org>`_ .
Fo example to use one of the image in my personal repo:

.. code-block:: console

  docker run [options] codecr.jlab.org/panta/ladlib:v0.0.1
