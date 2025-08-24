from django.contrib import admin
from .models import (
    # Existing
    Service, Project, ProjectImage, Certification, TeamMember, Post, ContactMessage,
    # Catalog
    Product, ProductImage as CatalogProductImage, ProductVariant, ProductCategory, Finish, Pattern, SampleRequest,
    # Equipment
    Equipment, EquipmentCategory,
)

# ---------- Existing inlines/admins ----------

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'summary')
    search_fields = ('title', 'summary')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'sector', 'state', 'year', 'role')
    list_filter = ('sector', 'state', 'year', 'role')
    search_fields = ('title', 'state', 'materials')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProjectImageInline]


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role')


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'published')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'project_type', 'created_at')
    readonly_fields = ('created_at',)


# ---------- New: Catalog admin ----------

class CatalogProductImageInline(admin.TabularInline):
    model = CatalogProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'category', 'created_at')
    list_filter = ('type', 'category', 'finishes')
    search_fields = ('title', 'summary', 'body')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [CatalogProductImageInline, ProductVariantInline]


@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Finish)
class FinishAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name', 'description')


@admin.register(Pattern)
class PatternAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)


@admin.register(SampleRequest)
class SampleRequestAdmin(admin.ModelAdmin):
    list_display = ('product', 'name', 'email', 'phone', 'created_at')
    readonly_fields = ('created_at',)
    search_fields = ('name', 'email', 'phone', 'message')
    list_filter = ('product',)


# ---------- New: Equipment admin ----------

@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'capacity')
    list_filter = ('category',)
    search_fields = ('name', 'make', 'model', 'capability')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(EquipmentCategory)
class EquipmentCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}