---
title: GitLab CI/CD
version: 0.1
hide_table_of_contents: false
lastUpdated: 2026-2-2
authors: Anil Panta and Casey Morean (STRIDE team)
---

# GitLab CI/CD

GitLab CI/CD is a powerful continuous integration and continuous delivery/deployment system integrated directly into GitLab. It allows developers to automate their software development workflows, from building and testing to deploying applications.  
All the information related to gitlab ci/cd are available in official doc [here](https://docs.gitlab.com/ee/topics/build_your_application.html).

## What is GitLab CI/CD?

GitLab CI/CD is a built-in feature that provides a complete DevOps platform for automating software development processes. It enables teams to:

- Automatically build, test, and deploy code changes
- Detect bugs and errors early in the development cycle
- Ensure code quality and compliance with established standards
- Streamline the release process

### Analogy to GitHub Actions

GitLab CI/CD is analogous to GitHub Actions. Both are CI/CD systems integrated into their respective platforms. The main differences are:

1. Configuration: GitLab uses `.gitlab-ci.yml`, while GitHub uses `.github/workflows/*.yml`
2. Runners: GitLab has its own runner system, while GitHub Actions uses its own hosted runners
3. Integration: GitLab CI/CD is more tightly integrated with other GitLab features

## Activating Pipelines for a Repository

To activate CI/CD pipelines for your GitLab repository:

1. Ensure CI/CD is enabled under the repo Settings:General:Visibility,project features, permissions:Repository:CI/CD. (This should be the default for any new projects.)
2. Create a `.gitlab-ci.yml` file in the root of your repository
3. Commit and push the file to your GitLab repository
4. GitLab will automatically detect the file and start running your pipeline

## .gitlab-ci.yml File

The `.gitlab-ci.yml` file is the heart of your GitLab CI/CD configuration. Its a YAML file, so you should follow the systax as described in: [CI/CD YAML syntax](https://docs.gitlab.com/ee/ci/yaml/)

It defines:

- Stages of your pipeline
- Jobs to be executed
- Scripts to run in each job
- Conditions for running jobs

Here's a basic example:

```yaml
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
````

### Key Components

1. **Stages**: Define the order of execution for your jobs. In the example above, we have three stages: build, test, and deploy.

2. **Jobs**: Each job (like `build_job`, `test_job`, `deploy_job`) represents a specific task in your pipeline. More info [here](https://docs.gitlab.com/ee/ci/jobs/index.html)

3. **Script**: The `script` section in each job defines the commands to be executed.

4. **Stage Assignment**: Each job is assigned to a stage using the `stage` keyword.

### Advanced Features

The `.gitlab-ci.yml` file supports many advanced features, including:

* **Variables**: Define and use variables throughout your pipeline. more info [here](https://docs.gitlab.com/ee/ci/variables/)
* **Artifacts**: Pass data between jobs and stages. more info [here](https://docs.gitlab.com/ee/ci/jobs/job_artifacts.html)
* **Dependencies**: Specify which jobs a particular job depends on. more info [here](https://docs.gitlab.com/ee/ci/yaml/#dependencies)
* **Rules**: Set conditions for when jobs should run. more info [here](https://docs.gitlab.com/ee/ci/yaml/#rules)
* **Includes**: Import configuration from other YAML files. [here](https://docs.gitlab.com/ee/ci/yaml/index.html#include)
* **Many more ...**

## Container Building with Kaniko

code.jlab.org currently provides [Kaniko](https://aarongoldenthal.com/posts/google-kaniko-is-dead-long-live-chainguard-kaniko/) for container build. Kaniko is a tool for building container images inside a container or Kubernetes cluster without requiring a Docker daemon.
Information on how to use Kaniko in gitlab ci/cd is [here](https://docs.gitlab.com/ee/ci/docker/using_kaniko.html#building-a-docker-image-with-kaniko).

To use Kaniko in GitLab CI/CD where we push image to gitlab container registry:

```yaml
build:
  image:
    name: registry.gitlab.com/gitlab-ci-utils/container-images/kaniko:debug
    entrypoint: [""]
  script:
    - mkdir -p /kaniko/.docker
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
    - /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --build-arg BUILD_ARG_1=value1 --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
```

This configuration builds a container image using the Dockerfile in your repository and pushes it to the GitLab Container Registry.

> **Note**
> All the variables starting with `$CI_` are predefined variables.
> You can see all the predefined variables and their meanings [here](https://docs.gitlab.com/ee/ci/variables/predefined_variables.html).

Let's break down each part:

1. **Job Definition**:
   The `build` job is defined, which will be responsible for building and pushing the container image.

2. **Kaniko Executor Image**:

```yaml
image:
  name: registry.gitlab.com/gitlab-ci-utils/container-images/kaniko:debug
  entrypoint: [""]
```

This specifies the Kaniko executor image to use. The `debug` version is used, which includes a shell for troubleshooting. The `entrypoint` is set to an empty array to override the default entrypoint.

3. **Script Section**:
   The `script` section contains the commands to be executed:

a. **Create Docker config directory**:

```yaml
- mkdir -p /kaniko/.docker
```

This creates the directory for Docker configuration.

b. **Set up GitLab Container Registry authentication**:

```yaml
- echo "{\"auths\":{\"$CI_REGISTRY\":{\"username\":\"$CI_REGISTRY_USER\",\"password\":\"$CI_REGISTRY_PASSWORD\"}}}" > /kaniko/.docker/config.json
```

This creates a `config.json` file with authentication details for the GitLab Container Registry. The variables `$CI_REGISTRY`, `$CI_REGISTRY_USER`, and `$CI_REGISTRY_PASSWORD` are predefined GitLab CI variables.

c. **Execute Kaniko**:

```yaml
- /kaniko/executor --context $CI_PROJECT_DIR --dockerfile $CI_PROJECT_DIR/Dockerfile --destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG
```

This command runs the Kaniko executor with the following options:

* `--context $CI_PROJECT_DIR`: Sets the build context to the project directory.
* `--dockerfile $CI_PROJECT_DIR/Dockerfile`: Specifies the location of the Dockerfile.
* `--destination $CI_REGISTRY_IMAGE:$CI_COMMIT_TAG`: Sets the destination for the built image, using the GitLab Container Registry and tagging it with the commit tag.
* `--build-arg BUILD_ARG_1=value1`: Passes a single build argument named BUILD_ARG_1 with the value "value1".
  You can use build arument to pass variables to Dockerfile.

### Pushing to Docker Hub with Kaniko

To push your container image to Docker Hub using Kaniko in GitLab CI/CD, you can modify your `.gitlab-ci.yml` file as follows:

```yaml
build:
  image:
    name: registry.gitlab.com/gitlab-ci-utils/container-images/kaniko:debug
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
```

Key changes:

1. **Authentication**: We're now using Docker Hub credentials instead of GitLab registry credentials.

2. **Variables**: `DOCKER_USERNAME` and `DOCKER_PASSWORD` are set using GitLab CI/CD variables. Make sure to set these in your GitLab project's CI/CD settings. To define variables see info [here](https://docs.gitlab.com/ee/ci/variables/#define-a-cicd-variable-in-the-ui).

3. **Registry URL**: The authentication JSON now uses `https://index.docker.io/v1/`, which is the Docker Hub registry URL.

4. **Destination**: The `--destination` flag now points to your Docker Hub repository. It uses the format `repository:tag`.

5. **Multiple tags**: We're pushing both a tagged version and a `latest` version of the image.

> **Note**
> Here we are pushing the image to dockerhub in the `$DOCKERHUB_USERNAME` namespace and the container name is assumed same as `$CI_PROJECT_NAME`. You can change these to other username and image name as you like. We are tagging it with both the commit tag `$CI_COMMIT_TAG` and `latest`.

---

## Container Building with Buildah

Buildah is a daemonless container image build tool that can run inside a CI job container. Unlike Docker builds, Buildah does **not** require Docker-in-Docker (DinD). This makes it a good fit for Kubernetes-based GitLab runners—**if** the runner security profile allows the necessary kernel features (notably user namespaces for rootless builds).

> **Important**
> Buildah success in Kubernetes CI depends heavily on runner configuration (seccomp/apparmor, user namespaces, storage driver support, UID/GID/FSGroup behavior, etc.). If builds fail, check the troubleshooting notes below.

---

## Example: Build and Push to the GitLab Container Registry

This example builds from a Dockerfile in your repository and pushes to the **GitLab Container Registry** with two tags:

* `build-<timestamp>`
* `latest`

```yaml
stages: [build]

variables:
  # Rootless-friendly defaults for restricted Kubernetes runners.
  STORAGE_DRIVER: "vfs"
  BUILDAH_ISOLATION: "chroot"
  BUILDAH_FORMAT: "docker"

  # Use /tmp for runtime/temp to avoid odd workspace mount behaviors.
  TMPDIR: "/tmp"
  XDG_RUNTIME_DIR: "/tmp/xdg_runtime"

build_and_push_gitlab_registry:
  stage: build
  image: registry-gitlab.jlab.org/containers/buildah:latest
  script:
    - set -euo pipefail
    - export DATE="$(date "+%Y%m%d-%H%M%S")"

    # Login to GitLab registry
    - buildah login -u "${CI_REGISTRY_USER}" -p "${CI_REGISTRY_PASSWORD}" "${CI_REGISTRY}"

    # Build
    - buildah bud
        --storage-driver "${STORAGE_DRIVER}"
        --isolation "${BUILDAH_ISOLATION}"
        --format "${BUILDAH_FORMAT}"
        -f "${CI_PROJECT_DIR}/Dockerfile"
        -t "${CI_REGISTRY_IMAGE}:build-${DATE}"
        -t "${CI_REGISTRY_IMAGE}:latest"
        --build-arg CI_JOB_TOKEN="${CI_JOB_TOKEN}"
        .

    # Push
    - buildah push "${CI_REGISTRY_IMAGE}:build-${DATE}"
    - buildah push "${CI_REGISTRY_IMAGE}:latest"
```

### Notes

* `STORAGE_DRIVER=vfs` is slower than overlay, but is the most reliable option in constrained Kubernetes environments.
* `BUILDAH_ISOLATION=chroot` is a common workaround when other isolation modes are blocked.

---

## Example: Push to Docker Hub and GitLab Registry in the Same Pipeline

If you want to push the **same build** to both registries, you can:

1. build once with local tags
2. tag for each registry
3. push to both

### Required CI/CD variables (Docker Hub)

Define these in GitLab **Settings → CI/CD → Variables**:

* `DOCKERHUB_USERNAME`
* `DOCKERHUB_TOKEN` (recommended) or `DOCKERHUB_PASSWORD`

```yaml
stages: [build]

variables:
  STORAGE_DRIVER: "vfs"
  BUILDAH_ISOLATION: "chroot"
  BUILDAH_FORMAT: "docker"
  TMPDIR: "/tmp"
  XDG_RUNTIME_DIR: "/tmp/xdg_runtime"

build_and_push_gitlab_and_dockerhub:
  stage: build
  image: registry-gitlab.jlab.org/containers/buildah:latest
  script:
    - set -euo pipefail
    - export DATE="$(date "+%Y%m%d-%H%M%S")"
    - export LOCAL_TAG="local/${CI_PROJECT_NAME}:build-${DATE}"

    # Build once locally
    - buildah bud
        --storage-driver "${STORAGE_DRIVER}"
        --isolation "${BUILDAH_ISOLATION}"
        --format "${BUILDAH_FORMAT}"
        -f "${CI_PROJECT_DIR}/Dockerfile"
        -t "${LOCAL_TAG}"
        --build-arg CI_JOB_TOKEN="${CI_JOB_TOKEN}"
        .

    # --- GitLab Container Registry ---
    - buildah login -u "${CI_REGISTRY_USER}" -p "${CI_REGISTRY_PASSWORD}" "${CI_REGISTRY}"
    - buildah tag "${LOCAL_TAG}" "${CI_REGISTRY_IMAGE}:build-${DATE}"
    - buildah tag "${LOCAL_TAG}" "${CI_REGISTRY_IMAGE}:latest"
    - buildah push "${CI_REGISTRY_IMAGE}:build-${DATE}"
    - buildah push "${CI_REGISTRY_IMAGE}:latest"

    # --- Docker Hub ---
    # Recommended: use a token (DOCKERHUB_TOKEN) rather than a password.
    - buildah login -u "${DOCKERHUB_USERNAME}" -p "${DOCKERHUB_TOKEN}" docker.io

    # Choose your Docker Hub repo naming convention:
    # docker.io/<username>/<image>:tag
    - export DOCKERHUB_IMAGE="docker.io/${DOCKERHUB_USERNAME}/${CI_PROJECT_NAME}"
    - buildah tag "${LOCAL_TAG}" "${DOCKERHUB_IMAGE}:build-${DATE}"
    - buildah tag "${LOCAL_TAG}" "${DOCKERHUB_IMAGE}:latest"
    - buildah push "${DOCKERHUB_IMAGE}:build-${DATE}"
    - buildah push "${DOCKERHUB_IMAGE}:latest"
```

---

## Troubleshooting and Runner Constraints

In some Kubernetes CI environments, the Git checkout volume is mounted with restrictive options (examples: `noexec`, disallowed `chmod`, UID/GID mismatch between build container and helper container). If you see odd permission errors:

* Prefer `bash script.sh` over `./script.sh` (works even when execute bits are ignored).
* Keep temp/runtime paths in `/tmp` (e.g., `TMPDIR=/tmp`, `XDG_RUNTIME_DIR=/tmp/...`).
* If artifact upload fails due to permissions, ensure outputs are readable by the helper container:

  * `chmod -R a+rX results || true`

---

## Note on Multi-arch Builds

It's important to note that multi-architecture builds are currently **NOT supported** in the JLab GitLab CI/CD setup.  In advanced setups, you can [register your own runner](https://docs.gitlab.com/runner/register/) to target other architectures like ARM.

:::caution
Multi-architecture container image builds are currently **NOT** available.
Only AMD-based container image builds are available.
:::
