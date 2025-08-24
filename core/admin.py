
from django.contrib import admin
from .models import Service, Project, ProjectImage, Certification, TeamMember, Post, ContactMessage

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title','slug','summary')
    search_fields = ('title','summary')
    prepopulated_fields = {'slug':('title',)}

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title','sector','state','year','role')
    list_filter = ('sector','state','year','role')
    search_fields = ('title','state','materials')
    prepopulated_fields = {'slug':('title',)}
    inlines = [ProjectImageInline]

@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('title','created_at')

@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ('name','role')

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title','slug','published')
    prepopulated_fields = {'slug':('title',)}

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name','email','phone','project_type','created_at')
    readonly_fields = ('created_at',)
