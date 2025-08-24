from rest_framework import viewsets, mixins, permissions, filters
from rest_framework.response import Response
from django.core.mail import EmailMessage
from django.conf import settings
from .utils import verify_turnstile
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    # Existing
    Service,
    Project,
    Certification,
    TeamMember,
    Post,
    ContactMessage,
    # Catalog
    Product,
    ProductCategory,
    SampleRequest,
    # Equipment
    Equipment,
    EquipmentCategory,
)
from .serializers import (
    # Existing
    ServiceSerializer,
    ProjectSerializer,
    CertificationSerializer,
    TeamMemberSerializer,
    PostSerializer,
    ContactMessageSerializer,
    # Catalog
    ProductSerializer,
    ProductCategorySerializer,
    SampleRequestSerializer,
    # Equipment
    EquipmentSerializer,
    EquipmentCategorySerializer,
)


class PublicReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in ('GET', 'HEAD', 'OPTIONS') or (
            request.user and request.user.is_staff
        )


# =========================
# Existing endpoints
# =========================

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('title')
    serializer_class = ServiceSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-year', '-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'
    # Enable server-side filtering/search if django-filter is installed
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['sector', 'state', 'year', 'role', 'services__slug', 'materials']
    search_fields = ['title', 'state', 'materials']
    ordering_fields = ['year', 'state', 'created_at']
    ordering = ['-year', '-created_at']


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all().order_by('-created_at')
    serializer_class = CertificationSerializer
    permission_classes = [PublicReadOnly]


class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all().order_by('name')
    serializer_class = TeamMemberSerializer
    permission_classes = [PublicReadOnly]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-published')
    serializer_class = PostSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'excerpt', 'body']
    ordering_fields = ['published', 'title']


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'contact'
    authentication_classes = []  # avoid CSRF issues for public POST

    def create(self, request, *args, **kwargs):
        token = request.data.get('cf-turnstile-response') or request.data.get('turnstile_token')
        remote_ip = request.META.get('REMOTE_ADDR')
        ok, reason = verify_turnstile(token, remote_ip, debug=settings.DEBUG)

        if not ok:
            if settings.DEBUG and settings.TURNSTILE_BYPASS_DEV:
                print("[DEV] Bypassing Turnstile:", reason)
            else:
                return Response({"detail": "Verification failed.", "reason": reason}, status=400)

        # Optional: log validation errors if they occur
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            if settings.DEBUG: print("Contact validation errors:", serializer.errors)
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        data = serializer.data

        # your existing email logic here (unchanged)
        subject = f"New contact message from {data.get('name')}"
        body = f"""Name: {data.get('name')}
Email: {data.get('email')}
Phone: {data.get('phone')}
Project type: {data.get('project_type')}
Message:
{data.get('message')}
"""
        try:
            mail = EmailMessage(subject, body, settings.DEFAULT_FROM_EMAIL, [settings.CONTACT_TO_EMAIL])
            if request.FILES.get('file'):
                mail.attach(request.FILES['file'].name, request.FILES['file'].read())
            mail.send(fail_silently=True)
        except Exception as e:
            print('Email send failed:', e)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


# =========================
# Catalog endpoints
# =========================

class ProductCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProductCategory.objects.all().order_by('name')
    serializer_class = ProductCategorySerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.all().order_by('title')
    serializer_class = ProductSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category__slug', 'finishes__name']
    search_fields = ['title', 'summary', 'body']
    ordering_fields = ['title', 'created_at']
    ordering = ['title']


class SampleRequestViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = SampleRequest.objects.all().order_by('-created_at')
    serializer_class = SampleRequestSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = 'contact'
    authentication_classes = []

    def create(self, request, *args, **kwargs):
        token = request.data.get('cf-turnstile-response') or request.data.get('turnstile_token')
        remote_ip = request.META.get('REMOTE_ADDR')
        ok, reason = verify_turnstile(token, remote_ip, debug=settings.DEBUG)

        if not ok:
            if settings.DEBUG and settings.TURNSTILE_BYPASS_DEV:
                print("[DEV] Bypassing Turnstile:", reason)
            else:
                return Response({"detail": "Verification failed.", "reason": reason}, status=400)

        # Show serializer validation errors in dev
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            if settings.DEBUG: print("SampleRequest validation errors:", serializer.errors)
            return Response(serializer.errors, status=400)

        self.perform_create(serializer)
        return Response(serializer.data, status=201, headers=self.get_success_headers(serializer.data))


# =========================
# Equipment endpoints
# =========================

class EquipmentCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EquipmentCategory.objects.all().order_by('name')
    serializer_class = EquipmentCategorySerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'


class EquipmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Equipment.objects.all().order_by('name')
    serializer_class = EquipmentSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug']
    search_fields = ['name', 'make', 'model', 'capability', 'specs']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']