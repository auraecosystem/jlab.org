.. highlight:: shell

.. _faqs:

Frequently Asked Questions (FAQs)
---------------------------------
- `Limits for code.jlab.org, CI/CD runners, etc <#limitations>`_

  - See `JLab GitLab Limits <gitlab.html#jlab-gitlab-limits>`_ for current defaults and
    pointers to requesting additional RAM and/or cores if required.

- `Working with a restricted repository (ie. 'internal only', or 'private') <#restricted_repo>`_

  - If you set viewing restrictions on a repository ('internal only', or
    'private') then it is recommended to access to the repository using the
    ``git://git@code.jlab.org/...`` URL **not** the
    ``https://code.jlab.org/...`` URL. Authentication and access are then
    handled using the SSH key exchange method.
  - See `Clone with SSH
    <https://docs.gitlab.com/ee/topics/git/clone.html#clone-with-ssh>`_ for
    details.
  - If ``https://...`` access is required, then a `Personal Access Tocken
    <https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html#clone-repository-using-personal-access-token>`_
    should also work.

- `Cloning a Repository <#cloning-a-repository>`_

  - The ``git@code.jlab.org`` in the ``git://git@code.jlab.org/...`` URL is the
    correct ``username@host`` for the SSH ``git:`` protocol. Authentication
    (when needed) is done via SSH key exchange. You must upload a public key to
    your account.
  - See `Clone with SSH
    <https://docs.gitlab.com/ee/topics/git/clone.html#clone-with-ssh>`_ for
    details.

- `Cleanup Instructions for Containers <#cleanup-instructions-for-containers>`_

  - Avoid running ``dnf install ...`` or ``dnf update`` directly in your
    Dockerfile or container unless absolutely necessary.  This can take a lot
    of time and consume significant disk resources.
  - Instead, ensure you are starting from an up-to-date base image. For example, use:

    .. code-block:: shell

       FROM registry.access.redhat.com/ubi8/ubi:latest

    Update the base image periodically to incorporate the latest patches.
  - If you must install or update packages, clean up after yourself to minimize
    image size and layer bloat:

    .. code-block:: shell

       RUN dnf install -y <package> && \
           dnf clean all

  - Be mindful of large updates being pulled in. This generates bloat and can
    greatly increase the run time of your CI/CD jobs. If updates are
    significant, consider rebuilding the container with an updated base image
    instead of performing in-place updates.


- `Limited CVMFS support within CI/CD jobs <limited_cvmfs_support>`_

  - OpenShift (RedHat's Kubernetes implementation) complicates the use of CVMFS
    within the GitLab CI/CD runners.

  - As a result **only** the JLab-managed CVMFS software under the path
    ``/cvmfs/oasis.opensciencegrid.org/jlab/`` is available for now.  The usual
    ``module`` commands will without modification.  For example:

    .. code-block:: shell

      module use /cvmfs/oasis.opensciencegrid.org/jlab/scicomp/sw/el9/modulefiles
      module use /cvmfs/oasis.opensciencegrid.org/jlab/geant4/ceInstall/modulefiles
      module use /cvmfs/oasis.opensciencegrid.org/jlab/halla/modulefiles
      module use /cvmfs/oasis.opensciencegrid.org/jlab/hallb/clas12/sw/modulefiles

      etc...

