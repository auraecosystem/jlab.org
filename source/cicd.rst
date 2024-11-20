.. highlight:: shell

.. _cicdgeneric:

GitLab CI/CD
============

GitLab CI/CD is a powerful continuous integration and continuous delivery/deployment system integrated directly into GitLab. It allows developers to automate their software development workflows, from building and testing to deploying applications.
All the information related to gitlab ci/cd are available in official doc `here <https://docs.gitlab.com/ee/topics/build_your_application.html>`_ . 

What is GitLab CI/CD?
---------------------

GitLab CI/CD is a built-in feature that provides a complete DevOps platform for automating software development processes. It enables teams to:

- Automatically build, test, and deploy code changes
- Detect bugs and errors early in the development cycle
- Ensure code quality and compliance with established standards
- Streamline the release process

Analogy to GitHub Actions
^^^^^^^^^^^^^^^^^^^^^^^^^

GitLab CI/CD is analogous to GitHub Actions. Both are CI/CD systems integrated into their respective platforms. The main differences are:

1. Configuration: GitLab uses ``.gitlab-ci.yml``, while GitHub uses ``.github/workflows/*.yml``
2. Runners: GitLab has its own runner system, while GitHub Actions uses its own hosted runners
3. Integration: GitLab CI/CD is more tightly integrated with other GitLab features

Activating Pipelines for a Repository
-------------------------------------

To activate CI/CD pipelines for your GitLab repository:

1. Create a ``.gitlab-ci.yml`` file in the root of your repository
2. Commit and push the file to your GitLab repository
3. GitLab will automatically detect the file and start running your pipeline

.gitlab-ci.yml File
-------------------

The ``.gitlab-ci.yml`` file is the heart of your GitLab CI/CD configuration. Its a YAML file, so you should follow the systax as described in: `CI/CD YAML syntax <https://docs.gitlab.com/ee/ci/yaml/>`_ 

It defines:

- Stages of your pipeline
- Jobs to be executed
- Scripts to run in each job
- Conditions for running jobs

Here's a basic example:

.. code-block:: yaml

   stages:
     - build
     - test
     - deploy

   build_job:
     stage: build
     script:
       - echo "Building the project..."

   test_job:
     stage: test
     script:
       - echo "Running tests..."

   deploy_job:
     stage: deploy
     script:
       - echo "Deploying to production..."

Key Components
^^^^^^^^^^^^^^

1. **Stages**: Define the order of execution for your jobs. In the example above, we have three stages: build, test, and deploy.

2. **Jobs**: Each job (like ``build_job``, ``test_job``, ``deploy_job``) represents a specific task in your pipeline. More info `here <https://docs.gitlab.com/ee/ci/jobs/index.html>`_

3. **Script**: The ``script`` section in each job defines the commands to be executed.

4. **Stage Assignment**: Each job is assigned to a stage using the ``stage`` keyword.

Advanced Features
^^^^^^^^^^^^^^^^^

The ``.gitlab-ci.yml`` file supports many advanced features, including:

- **Variables**: Define and use variables throughout your pipeline. more info `here <https://docs.gitlab.com/ee/ci/variables/>`_
- **Artifacts**: Pass data between jobs and stages. more info `here <https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html>`_
- **Dependencies**: Specify which jobs a particular job depends on. more info `here <https://docs.gitlab.com/ee/ci/yaml/#dependencies>`_
- **Rules**: Set conditions for when jobs should run. more info `here <https://docs.gitlab.com/ee/ci/yaml/#rules>`_
- **Includes**: Import configuration from other YAML files. `here <https://docs.gitlab.com/ee/ci/yaml/index.html#include>`_ 
- **Many more ...**



Container Building with Kaniko
------------------------------

code.jlab.org currently provides only `Kaniko <https://github.com/GoogleContainerTools/kaniko>`_ for container build. Kaniko is a tool for building container images inside a container or Kubernetes cluster without requiring a Docker daemon. 
Information on how to use Kaniko in gitlab ci/cd is `here <https://docs.gitlab.com/ee/ci/docker/using_kaniko.html#building-a-docker-image-with-kaniko>`_.

To use Kaniko in GitLab CI/CD where we push image to gitlab container registry:

.. code-block:: yaml

   build:
     image:
       name: gcr.io/kaniko-project/executor:debug
       entrypoint: [""]
     script:
       - mkdir -p /kaniko/.docker
       - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
       - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --build-arg BUILD_ARG_1=value1 --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG

This configuration builds a container image using the Dockerfile in your repository and pushes it to the GitLab Container Registry.

.. note:: 
   All the variables starting with `$CI_` are predefined variables.
   You can see all the predefined variables and its meanings `here <https://docs.gitlab.com/ee/ci/variables/predefined_variables.html>`_.

Let's break down each part:

1. **Job Definition**:
   The ``build`` job is defined, which will be responsible for building and pushing the container image.

2. **Kaniko Executor Image**:

   .. code-block:: yaml

      image:
        name: gcr.io/kaniko-project/executor:debug
        entrypoint: [""]

   This specifies the Kaniko executor image to use. The ``debug`` version is used, which includes a shell for troubleshooting. The ``entrypoint`` is set to an empty array to override the default entrypoint.

3. **Script Section**:
   The ``script`` section contains the commands to be executed:

   a. **Create Docker config directory**:
  
      .. code-block:: yaml

         - mkdir -p /kaniko/.docker

      This creates the directory for Docker configuration.

   b. **Set up GitLab Container Registry authentication**:

      .. code-block:: yaml

         - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json

      This creates a ``config.json`` file with authentication details for the GitLab Container Registry. The variables ``$CI_REGISTRY``, ``$CI_REGISTRY_USER``, and ``$CI_REGISTRY_PASSWORD`` are predefined GitLab CI variables.

   c. **Execute Kaniko**:

      .. code-block:: yaml

         - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG

      This command runs the Kaniko executor with the following options:

        - ``--context $CI_PROJECT_DIR``: Sets the build context to the project directory.
        - ``--dockerfile $CI_PROJECT_DIR/Dockerfile``: Specifies the location of the Dockerfile.
        - ``--destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG``: Sets the destination for the built image, using the GitLab Container Registry and tagging it with the commit tag.
        - ``--build-arg BUILD_ARG_1=value1``: Passes a single build argument named BUILD_ARG_1 with the value "value1".
          You can use build arument to pass variables to Dockerfile.

Pushing to Docker Hub with Kaniko
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To push your container image to Docker Hub using Kaniko in GitLab CI/CD, you can modify your ``.gitlab-ci.yml`` file as follows:

.. code-block:: yaml

   build:
     image:
       name: gcr.io/kaniko-project/executor:debug
       entrypoint: [""]
     variables:
       DOCKER_USERNAME: $DOCKERHUB_USERNAME
       DOCKER_PASSWORD: $DOCKERHUB_PASSWORD
     script:
       - mkdir -p /kaniko/.docker
       - echo "{\"auths\":{\"https://index.docker.io/v1/\":{\"username\":\"$DOCKER_USERNAME\",\"password\":\"$DOCKER_PASSWORD\"}}}" > /kaniko/.docker/config.json
       - /kaniko/executor 
         --context $CI_PROJECT_DIR 
         --dockerfile $CI_PROJECT_DIR/Dockerfile 
         --destination docker.io/$DOCKERHUB_USERNAME/$CI_PROJECT_NAME:$CI_COMMIT_TAG
         --destination docker.io/$DOCKERHUB_USERNAME/$CI_PROJECT_NAME:latest

Key changes:

1. **Authentication**: We're now using Docker Hub credentials instead of GitLab registry credentials.

2. **Variables**: ``DOCKER_USERNAME`` and ``DOCKER_PASSWORD`` are set using GitLab CI/CD variables. Make sure to set these in your GitLab project's CI/CD settings. To define variables see info `here <https://docs.gitlab.com/ee/ci/variables/#define-a-cicd-variable-in-the-ui>`_ .

3. **Registry URL**: The authentication JSON now uses ``https://index.docker.io/v1/``, which is the Docker Hub registry URL.

4. **Destination**: The ``--destination`` flag now points to your Docker Hub repository. It uses the format ``repository:tag``.

5. **Multiple tags**: We're pushing both a tagged version and a ``latest`` version of the image.

.. note::
    Here we are pushing the image to dockerhub in the ``$DOCKERHUB_USERNAME`` namespace and the container name is assumed same as ``$CI_PROJECT_NAME``. You can change these to other username and image name as you like. We are tagging it with both the commit tag ``$CI_COMMIT_TAG`` and ``latest``.

Note on Buildah and Multi-arch Builds
-------------------------------------

It's important to note that Buildah, another container building tool, is not available in JLab GitLab CI/CD. Additionally, multi-architecture builds are also NOT supported in the JLab GitLab CI/CD setup. 
We are working on it to make it available in near future.

.. warning::
    Buildah is currently NOT available.
    Muti-Archicture container image builds are currently NOT available.
    (only AMD based container image build is available)



