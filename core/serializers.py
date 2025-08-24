
from rest_framework import serializers
from .models import Service, Project, ProjectImage, Certification, TeamMember, Post, ContactMessage

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id','title','slug','summary','body','icon']

class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id','image','alt_text']

class ProjectSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ['id','title','slug','sector','state','year','role','services','materials','cover_image','description','results','testimonial','images']

class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = ['id','title','body','image']

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['id','name','role','bio','photo']

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id','title','slug','excerpt','body','image','published']

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id','name','email','phone','project_type','message','file','created_at']
        read_only_fields = ['created_at']
