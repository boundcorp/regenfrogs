Docker Build Architecture
=========================


Using virtualenv with docker for local django building
======================================================

+ In a hurry? Don't care how this works? Just run `bin/setup.dev` and be on your way!

+ Outside docker, this creates a local virtualenv with all the python dependencies installed;
    This is located in `env/` and you can activate it by running
    `source env/bin/activate`, followed by `pip install -r requirements.txt`
    (or just `bin/setup.venv` for short).

+ This virtualenv is handy for 2 main reasons:
    1) it allows us to use the virtualenv for IDE completion
    2) it allows us to use the `compose/django/pip.cache` folder to store all the python
    dependencies, saving us lots of pip downloading that would normally happen in a
    docker setup like this.

+ But you should be aware! Using manage.py with the virtualenv, outside a docker
    container, will only work for tasks that don't require access to the database,
    cache, or other docker services. For example, we can run the test suite in
    virtualenv using settings/test_settings.py, which sets up a local memory cache and
    database.

About the containers, inside and out
====================================

So how do these docker containers work? Easy, just run `bin/dc up -d` to launch them all,
    or `bin/runserver` for convenience.

+ build.yml defines the base images for django, with definitions for building a
    development container and a production container

+ in development container, the `build_context` is set to the `compose/django` subfolder,
    so that individual code changes do not force a full container rebuild.

+ this means that in development, the container has NO CODE inside it -- the code is
    mounted as a volume (so hotreload etc function as expected)

+ in the production container, the requirements are reduced and the image is minimized
    in size. you can set a remote registry URL for the push destination in build.yml

+ dev.yml defines a database container, a runserver container and a "django commands"
    container. this third container is used for manage.py commands, or dropping into a
    bash shell. (most people would try to execute into the runserver container, but that
    only works when the service is running, which can create circular errors when trying
    to run initial migrations)

