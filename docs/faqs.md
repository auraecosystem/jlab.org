---
title: Frequently Asked Questions
version: 0.1
hide_table_of_contents: false
lastUpdated: 2026-2-2
authors: Anil Panta and Casey Morean (STRIDE team)
---

## Frequently Asked Questions (FAQs)

- [Limits for code.jlab.org, CI/CD runners, etc](#limitations)
- [Working with a restricted repository](#restricted-repo)
- [Command line access using Personal Access Tokens](#pat)
- [Cloning a repository](#cloning-a-repository)
- [Cleanup instructions for containers](#cleanup-instructions-for-containers)
- [Limited CVMFS support within CI/CD jobs](#limited-cvmfs-support)

---

### Limits for code.jlab.org, CI/CD runners, etc {#limitations}

See [JLab GitLab Limits](./gitlab#jlab-gitlab-limits) for current defaults and
instructions for requesting additional RAM and/or CPU cores if required.

---

### Working with a restricted repository {#restricted-repo}

If you set viewing restrictions on a repository (“internal only” or
“private”), it is recommended to access the repository using the SSH URL:

```

git://git@code.jlab.org/...

```

rather than the HTTPS URL:

```

[https://code.jlab.org/](https://code.jlab.org/)...

```

Authentication and access are handled using SSH key exchange.

See:  
👉 [Clone with SSH](https://docs.gitlab.com/ee/topics/git/clone.html#clone-with-ssh)

If HTTPS access is required, a Personal Access Token can be used instead:

👉 [Clone using Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#clone-repository-using-personal-access-token)

---

### Command line access using Personal Access Tokens {#pat}

Generate a Personal Access Token from your `code.jlab.org` account:

👉 [Create a Personal Access Token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)

Make sure you select appropriate token scopes. The “Learn more” link in the
GitLab UI explains what each scope allows.

Once created, store the token in:

```

$HOME/.config/containers/auth.json

````

Podman will automatically use this file for authentication.

Example login commands:

```shell
podman login codecr.jlab.org
# OR
podman --authfile="$HOME/.config/containers/auth.json" login codecr.jlab.org
````

---

### Cloning a repository {#cloning-a-repository}

The `git@code.jlab.org` portion of the URL:

```
git://git@code.jlab.org/...
```

is the correct `username@host` format for SSH-based Git access.

Authentication is performed using SSH keys. You must upload your public SSH
key to your GitLab account before cloning.

See:
👉 [Clone with SSH](https://docs.gitlab.com/ee/topics/git/clone.html#clone-with-ssh)

---

### Cleanup instructions for containers {#cleanup-instructions-for-containers}

Avoid running `dnf install` or `dnf update` directly in your Dockerfile unless
absolutely necessary. These operations consume significant disk space and slow
down CI/CD pipelines.

Instead, start from an up-to-date base image:

```dockerfile
FROM registry.access.redhat.com/ubi8/ubi:latest
```

If package installation is required, clean the package cache afterward:

```dockerfile
RUN dnf install -y <package> && \
    dnf clean all
```

Large in-place updates can create unnecessary image bloat and increase CI job
runtime. When possible, rebuild from a newer base image instead of updating
an old one.

---

### Limited CVMFS support within CI/CD jobs {#limited-cvmfs-support}

All standard CVMFS mounts are available on the CI Runner as they appear on interactive farm nodes under:

```
/cvmfs/
```

Standard `module` commands work without modification. Example:

```shell
module use /cvmfs/oasis.opensciencegrid.org/jlab/scicomp/sw/el9/modulefiles
module use /cvmfs/oasis.opensciencegrid.org/jlab/geant4/ceInstall/modulefiles
module use /cvmfs/oasis.opensciencegrid.org/jlab/halla/modulefiles
module use /cvmfs/oasis.opensciencegrid.org/jlab/hallb/clas12/sw/modulefiles
```

---
