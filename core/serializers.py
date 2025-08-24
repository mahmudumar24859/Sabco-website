from rest_framework import serializers
from .models import (
    # Existing models
    Service,
    Project,
    ProjectImage,
    Certification,
    TeamMember,
    Post,
    ContactMessage,
    # Catalog models
    ProductCategory,
    Finish,
    Pattern,
    Product,
    ProductVariant,
    ProductImage as CatalogProductImage,  # alias to avoid name clash
    SampleRequest,
    # Equipment models
    EquipmentCategory,
    Equipment,
)


# ---------- Helpers: absolute URLs for images/files ----------

class AbsoluteImageField(serializers.ImageField):
    def to_representation(self, value):
        if not value:
            return None
        try:
            url = value.url
        except Exception:
            url = str(value)
        request = self.context.get('request')
        if request and isinstance(url, str) and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url


class AbsoluteFileField(serializers.FileField):
    def to_representation(self, value):
        if not value:
            return None
        try:
            url = value.url
        except Exception:
            url = str(value)
        request = self.context.get('request')
        if request and isinstance(url, str) and url.startswith('/'):
            return request.build_absolute_uri(url)
        return url


# ---------- Existing serializers ----------

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'slug', 'summary', 'body', 'icon']


class ProjectImageSerializer(serializers.ModelSerializer):
    image = AbsoluteImageField()

    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'alt_text']


class ProjectSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    cover_image = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'sector', 'state', 'year', 'role',
            'services', 'materials', 'cover_image', 'description',
            'results', 'testimonial', 'images',
        ]


class CertificationSerializer(serializers.ModelSerializer):
    image = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = Certification
        fields = ['id', 'title', 'body', 'image']


class TeamMemberSerializer(serializers.ModelSerializer):
    photo = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = TeamMember
        fields = ['id', 'name', 'role', 'bio', 'photo']


class PostSerializer(serializers.ModelSerializer):
    image = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'excerpt', 'body', 'image', 'published']


class ContactMessageSerializer(serializers.ModelSerializer):
    # If you want to expose the uploaded file URL in responses, switch to:
    # file = AbsoluteFileField(required=False, allow_null=True)
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'project_type', 'message', 'file', 'created_at']
        read_only_fields = ['created_at']


# ---------- Catalog serializers ----------

class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'name', 'slug']


class FinishSerializer(serializers.ModelSerializer):
    class Meta:
        model = Finish
        fields = ['id', 'name', 'description']


class PatternSerializer(serializers.ModelSerializer):
    image = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = Pattern
        fields = ['id', 'name', 'image']


class CatalogProductImageSerializer(serializers.ModelSerializer):
    image = AbsoluteImageField()

    class Meta:
        model = CatalogProductImage
        fields = ['id', 'image', 'alt_text']


class ProductVariantSerializer(serializers.ModelSerializer):
    finish = FinishSerializer(read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'thickness', 'finish', 'weight', 'notes']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', read_only=True)
    pattern = PatternSerializer(read_only=True)
    finishes = FinishSerializer(many=True, read_only=True)
    cover_image = AbsoluteImageField(required=False, allow_null=True)
    spec_sheet = AbsoluteFileField(required=False, allow_null=True)
    images = CatalogProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'title', 'slug', 'type', 'category', 'summary', 'body',
            'pattern', 'finishes', 'cover_image', 'spec_sheet', 'images', 'variants',
        ]


class SampleRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = SampleRequest
        fields = [
            'id', 'product', 'name', 'email', 'phone', 'address',
            'finish_preference', 'message', 'created_at',
        ]
        read_only_fields = ['created_at']


# ---------- Equipment serializers ----------

class EquipmentCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EquipmentCategory
        fields = ['id', 'name', 'slug']


class EquipmentSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='name', read_only=True)
    image = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = Equipment
        fields = [
            'id', 'name', 'slug', 'category', 'make', 'model', 'year',
            'capacity', 'capability', 'specs', 'image',
        ]