from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class GigsView(APIView):
    def get(self, request):
        gigs = [
            {"id": 1, "title": "Web Developer Needed", "client": "Client A"},
            {"id": 2, "title": "Graphic Designer", "client": "Client B"},
            {"id": 3, "title": "Software Developer", "client": "Client c"},
            {"id": 4, "title": "All Designer", "client": "Client B"},
        ]
        return Response(gigs)