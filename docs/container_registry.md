---
title: GitLab Container Registry
version: 0.1
hide_table_of_contents: false
lastUpdated: 2026-2-2
authors: Anil Panta and Casey Morean (STRIDE team)
---

## GitLab Container Registry

GitLab Container Registry is a secure and private registry for Docker images. It's fully integrated with GitLab, allowing you to store and manage your Docker images within your GitLab projects.

To use it:

1. Enable the Container Registry for your project.

   * Go to settings → General → expand **“Visibility, project features, permissions”** and check the **“Container registry”**
   * You can set the visibility of the image registry according to the needs of your project.

2. Configure your CI/CD pipeline to push images to the registry

3. Use the images in your deployments

More info:
[GitLab Container Registry Documentation](https://docs.gitlab.com/ee/user/packages/container_registry/)

The base URL for JLab gitlab container registry is:
[https://codecr.jlab.org](https://codecr.jlab.org)

Base URL for jlab gitlab container registry is:
[https://codecr.jlab.org](https://codecr.jlab.org)

Fo example to use one of the image in my personal repo:

```console
docker run [options] codecr.jlab.org/panta/ladlib:v0.0.1
```

> **Note**
> The container registry is visible to everyone with access to the project.
> If the project is public, the container registry is also public.

If your container registry needs authentication you need to login to container registry.
Follow procedure
[authenticate_with_container_registry](https://docs.gitlab.com/ee/user/packages/container_registry/authenticate_with_container_registry.html).

i.e. Once you get the access token with minimum scope `read_registry` just do following to authenticate.

```console
TOKEN=<token>
echo "$TOKEN" | docker login registry.example.com -u <username> --password-stdin
```

Here replace `<token>` with your token.
For podman replace `docker` with `podman`.
