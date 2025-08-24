
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ServiceViewSet, ProjectViewSet, CertificationViewSet,
    TeamMemberViewSet, PostViewSet, ContactMessageViewSet
)

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'certifications', CertificationViewSet, basename='cert')
router.register(r'team', TeamMemberViewSet, basename='team')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'contact', ContactMessageViewSet, basename='contact')

urlpatterns = [
    path('', include(router.urls)),
]
