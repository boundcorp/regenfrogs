def test_basic_user_fixture(project_fixture_common):
    user = project_fixture_common.user
    assert not user.is_anonymous
    assert not user.is_staff
    assert not user.is_superuser
    assert user.email in str(user)
