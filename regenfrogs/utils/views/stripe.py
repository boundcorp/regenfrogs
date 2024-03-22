from django.http import JsonResponse
from requests import Response
from rest_framework.views import APIView


def success(status=200, **kwargs):
    return JsonResponse({"success": True, **kwargs}, status=status)


class StripeWebhook(APIView):
    def post(self, request, format=None):
        event = request.data
        _type = event.get("type", "")
        print("Stripe Event", event)
        if _type == "invoice.payment_succeeded":
            raise ValueError("Payment not configured")
        elif not _type:
            raise ValueError("No type provided")
        return success(200)

    def get(self, request, format=None):
        return Response([])
