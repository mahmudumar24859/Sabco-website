
from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField

class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        abstract = True

class Service(TimestampedModel):
    title = models.CharField(max_length=140, unique=True)
    slug = models.SlugField(max_length=160, unique=True, blank=True)
    summary = models.CharField(max_length=240, blank=True)
    body = RichTextField(blank=True)
    icon = models.CharField(max_length=60, blank=True)
    def save(self,*a,**k):
        if not self.slug: self.slug = slugify(self.title)
        super().save(*a,**k)
    def __str__(self): return self.title

class Project(TimestampedModel):
    ROLE_CHOICES=[('main','Main Contractor'),('sub','Sub-contractor')]
    SECTOR_CHOICES=[('industrial','Industrial'),('commercial','Commercial'),('public','Public Works'),('residential','Residential')]
    title=models.CharField(max_length=200)
    slug=models.SlugField(max_length=220, unique=True, blank=True)
    sector=models.CharField(max_length=32, choices=SECTOR_CHOICES)
    state=models.CharField(max_length=80)
    year=models.PositiveIntegerField()
    role=models.CharField(max_length=16, choices=ROLE_CHOICES)
    services=models.ManyToManyField(Service, related_name='projects', blank=True)
    materials=models.CharField(max_length=200, blank=True)
    cover_image=models.ImageField(upload_to='projects/covers/', blank=True, null=True)
    description=RichTextField(blank=True)
    results=models.TextField(blank=True)
    testimonial=models.CharField(max_length=280, blank=True)
    def save(self,*a,**k):
        if not self.slug: self.slug = slugify(self.title)
        super().save(*a,**k)
    def __str__(self): return self.title

class ProjectImage(TimestampedModel):
    project=models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
    image=models.ImageField(upload_to='projects/gallery/')
    alt_text=models.CharField(max_length=200, blank=True)
    def __str__(self): return f'Image for {self.project.title}'

class Certification(TimestampedModel):
    title=models.CharField(max_length=200)
    body=models.TextField(blank=True)
    image=models.ImageField(upload_to='certifications/', blank=True, null=True)
    def __str__(self): return self.title

class TeamMember(TimestampedModel):
    name=models.CharField(max_length=140)
    role=models.CharField(max_length=140)
    bio=models.TextField(blank=True)
    photo=models.ImageField(upload_to='team/', blank=True, null=True)
    def __str__(self): return f'{self.name} — {self.role}'

class Post(TimestampedModel):
    title=models.CharField(max_length=240)
    slug=models.SlugField(max_length=260, unique=True, blank=True)
    excerpt=models.CharField(max_length=300, blank=True)
    body=RichTextField(blank=True)
    image=models.ImageField(upload_to='blog/', blank=True, null=True)
    published=models.DateTimeField(auto_now_add=True)
    def save(self,*a,**k):
        if not self.slug: self.slug = slugify(self.title)
        super().save(*a,**k)
    def __str__(self): return self.title

class ContactMessage(TimestampedModel):
    name=models.CharField(max_length=140)
    email=models.EmailField()
    phone=models.CharField(max_length=80, blank=True)
    project_type=models.CharField(max_length=140, blank=True)
    message=models.TextField(blank=True)
    file=models.FileField(upload_to='leads/', blank=True, null=True)
    def __str__(self): return f'{self.name} <{self.email}>'
