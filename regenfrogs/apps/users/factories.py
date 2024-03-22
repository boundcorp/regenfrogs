import factory


class PasswordSetter(factory.PostGenerationMethodCall):
    def call(self, instance, step, context):
        if context.value_provided and context.value is None:
            # disable setting the password, it's set by hand outside of the factory
            return

        return super().call(instance, step, context)


class UserFactory(factory.django.DjangoModelFactory):
    username = factory.lazy_attribute(lambda obj: obj.email)
    email = factory.Faker("email")
    first_name = factory.Faker("first_name")
    last_name = factory.Faker("last_name")
    password = PasswordSetter("set_password", "test")

    class Meta:
        model = "users.User"
        django_get_or_create = ("username",)


class SuperUserFactory(UserFactory):
    is_staff = True
    is_superuser = True
