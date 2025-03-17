from django.shortcuts import render

# Create your views here.
import requests
from django.shortcuts import render


def index(request):
    return render(request, "index.html")