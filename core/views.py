
from rest_framework import viewsets, mixins, permissions
from django.core.mail import EmailMessage
from django.conf import settings
from .models import Service, Project, ProjectImage, Certification, TeamMember, Post, ContactMessage
from .serializers import (
    ServiceSerializer, ProjectSerializer, ProjectImageSerializer,
    CertificationSerializer, TeamMemberSerializer, PostSerializer,
    ContactMessageSerializer
)

class PublicReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in ('GET','HEAD','OPTIONS') or (request.user and request.user.is_staff)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by('title')
    serializer_class = ServiceSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by('-year','-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [PublicReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['sector','state','year','role']

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

class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        resp = super().create(request, *args, **kwargs)
        data = resp.data
        # send email via SendGrid SMTP configured in settings
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
        return resp
