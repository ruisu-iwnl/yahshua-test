from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import SimpleRouter

from tasks.views import TaskViewSet


router = SimpleRouter()
router.register("tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include(router.urls)),
]

