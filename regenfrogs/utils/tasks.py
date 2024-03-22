from django.conf import settings
from django_q.tasks import Schedule


def print_if_not_tests(*args, **kwargs):
    if not settings.IS_TEST:
        print(*args, **kwargs)


def ensure_scheduled(func, schedule_type, name=None, **kwargs):
    if not name:
        name = func.split(".")[-1].replace("_", " ").title()
    exists = Schedule.objects.filter(name__iexact=name)
    updates = dict(func=func, schedule_type=schedule_type, **kwargs)
    info = "{} ({})".format(name, dict(**kwargs, schedule_type=schedule_type))
    if exists.count() > 1:
        raise ValueError("Multiple schedules with name %s" % name)
    elif exists.count() == 1:
        if exists.first().repeats < 0:
            updates["repeats"] = -1
        exists.update(name=name, **updates)
        print_if_not_tests("*** Schedule updated: {}".format(info))
    else:
        if not "repeats" in kwargs:
            updates["repeats"] = -1  # it says it defaults to -1 but it keeps getting set to -2 for some reason
        Schedule.objects.create(name=name, **updates)
        print_if_not_tests("*** Created schedule: {}".format(info))


def create_scheduled_tasks():
    from django.conf import settings

    tasks = settings.SCHEDULED_TASKS
    if tasks:
        print_if_not_tests("*** Loading tasks...")
        for task in tasks:
            ensure_scheduled(**task)
        print_if_not_tests()
    else:
        print_if_not_tests("*** No scheduled tasks to load")
