from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    # Existing
    ServiceViewSet,
    ProjectViewSet,
    CertificationViewSet,
    TeamMemberViewSet,
    PostViewSet,
    ContactMessageViewSet,
    # New: Catalog
    ProductCategoryViewSet,
    ProductViewSet,
    SampleRequestViewSet,
    # New: Equipment
    EquipmentCategoryViewSet,
    EquipmentViewSet,
)

router = DefaultRouter()

# Existing routes
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'certifications', CertificationViewSet, basename='cert')
router.register(r'team', TeamMemberViewSet, basename='team')
router.register(r'posts', PostViewSet, basename='post')
router.register(r'contact', ContactMessageViewSet, basename='contact')

# New: Catalog routes
router.register(r'product-categories', ProductCategoryViewSet, basename='product-category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'sample-requests', SampleRequestViewSet, basename='sample-request')

# New: Equipment routes
router.register(r'equipment-categories', EquipmentCategoryViewSet, basename='equipment-category')
router.register(r'equipment', EquipmentViewSet, basename='equipment')

urlpatterns = [
    path('', include(router.urls)),
]