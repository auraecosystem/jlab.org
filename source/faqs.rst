.. highlight:: shell

.. _faqs:

Frequently Asked Questions (FAQs)
---------------------------------

- `Cloning a Repository <#cloning-a-repository>`_

  - The ``git@code.jlab.org`` in the ``git://git@code.jlab.org/...`` URL is the correct ``username@host`` for the SSH ``git:`` protocol. Authentication (when needed) is done via SSH key exchange. You must upload a public key to your account.
  - See `Clone a Git repository to your local computer <https://docs.gitlab.com/ee/topics/git/clone.html>`_ for details.

- `Cleanup Instructions for Containers <#cleanup-instructions-for-containers>`_

  - Avoid running ``dnf install ...`` or ``dnf update`` directly in your Dockerfile or container unless absolutely necessary.
  - Instead, ensure you are starting from an up-to-date base image. For example, use:

    .. code-block:: shell

       FROM registry.access.redhat.com/ubi8/ubi:latest

    Update the base image periodically to incorporate the latest patches.
  - If you must install or update packages, clean up after yourself to minimize image size and layer bloat:

    .. code-block:: shell

       RUN dnf install -y <package> && \
           dnf clean all && \
           rm -rf /var/cache/dnf

  - Be mindful of large updates being pulled in. If updates are significant, consider rebuilding the container with an updated base image instead of performing in-place updates.


