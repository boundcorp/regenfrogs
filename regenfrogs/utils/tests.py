def validation_errors(result):
    return [err["extensions"]["validationErrors"] for err in result["errors"] if err["message"] == "ValidationError"]


def find_error(result, code):
    found = [e for e in validation_errors(result) if e[0]["code"] == code]
    return found and found[0] or None


def assertValidationError(result, code):
    assert "errors" in result, "Expected errors in result"
    assert result["errors"], "Expected errors in result"

    # Check if the form level error matches:
    if result["errors"][0]["message"] == code:
        pass
    else:
        assert find_error(result, code), "Expected %s, but got %s" % (code, result)
