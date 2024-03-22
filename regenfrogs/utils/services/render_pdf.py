import os
from tempfile import NamedTemporaryFile

from django.conf import settings
from django.http import HttpResponse
from django.template import Context
from django.template.loader import get_template
from xhtml2pdf import pisa


def link_callback(uri, rel):
    """
    Convert HTML URIs to absolute system paths so xhtml2pdf can access those
    resources
    """
    if uri.startswith("/dj-static"):
        path = os.path.join(settings.PROJECT_ROOT, "frontend/public", uri.split("/")[-1])
        # make sure that file exists
        if not os.path.isfile(path):
            raise Exception("media URI must start with /dj-static")
        return path
    return uri


def django_write_tempfile(asset, default=None):
    if asset:
        tempfile = NamedTemporaryFile(suffix=".png", delete=False)
        asset.open()
        tempfile.write(asset.read())
        tempfile.close()
        return tempfile
    return default


def render_template(template, context, assets=None):
    if assets is None:
        assets = {}
    context["assets"] = {}
    cleanup = []
    for key, asset in assets.items():
        if asset:
            tempfile = django_write_tempfile(asset)
            cleanup.append(tempfile)
            context["assets"][key] = tempfile.name

    return get_template(template).template.render(Context(context)), cleanup


def pdf_view(name, request, template, context, assets=None):
    is_pdf = request.GET.get("format", "").lower() != "html"
    html, cleanup = render_template(template, context, assets)

    if is_pdf:
        response = HttpResponse(content_type="application/pdf")
        if request.GET.get("dl", "") == "true":
            response["Content-Disposition"] = 'attachment; filename="%s.pdf"' % name
        pisa.CreatePDF(html, dest=response, link_callback=link_callback, encoding="utf-8")
        for tempfile in cleanup:
            os.unlink(tempfile.name)
        return response
    else:
        return HttpResponse(html)
