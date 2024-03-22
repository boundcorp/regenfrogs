import html
import re

from django.conf import settings
from django.template import Context
from django.template.loader import get_template
from django.utils.html import strip_tags


def remove_style_tags(html):
    pattern = r"<style\b[^>]*>(.*?)</style>"
    return re.sub(pattern, "", html, flags=re.DOTALL)


def prepare_email(data, template="email_base.html"):
    if "site_link" in data:
        if data["site_link"].startswith("/"):
            data["link"] = settings.BASE_URL + data["site_link"]
        else:
            data["link"] = settings.BASE_URL + "/" + data["site_link"]

    data["BASE_URL"] = settings.BASE_URL
    data["footer_link"] = data.get("footer_link", settings.BASE_URL + "/support")

    as_html = get_template(template).template.render(Context(data))
    as_html = remove_style_tags(as_html)
    plain_message = html.unescape(strip_tags(as_html))

    if "button_text" in data:
        plain_message = plain_message.replace(data["button_text"], data["link"])

    return as_html, plain_message.strip()


class MailMixin(object):
    def send_raw_mail(self, subject, html_message, plain_message=None, cc_emails=None):
        from django.core.mail import send_mail

        send_mail(
            subject,
            plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[self.email] + (cc_emails or []),
            html_message=html_message,
        )

    def send_notification_mail(self, title, content_blocks=None, signature=None, cc_emails=None):
        html, plain_message = prepare_email(
            {
                "title": title,
                "content_blocks": content_blocks or [],
                "signature": signature,
            }
        )
        self.send_raw_mail(title, html, plain_message, cc_emails=cc_emails)

    def send_action_button_mail(self, title, button_text, link, content_blocks=None, signature=None, cc_emails=None):
        html, plain_message = prepare_email(
            {
                "title": title,
                "site_link": link,
                "button_text": button_text,
                "content_blocks": content_blocks or [],
                "signature": signature,
            }
        )
        self.send_raw_mail(title, html, plain_message, cc_emails=cc_emails)
