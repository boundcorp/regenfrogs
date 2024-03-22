def test_my_profile_query(project_fixture_common):
    result = project_fixture_common.query("query { myProfile { email }}")
    assert result["data"]["myProfile"]["email"] == project_fixture_common.user.email
