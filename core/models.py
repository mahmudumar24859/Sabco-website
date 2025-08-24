
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

# --- Catalog (products, variants, images, sample requests) ---

class ProductCategory(TimestampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    def save(self, *a, **k):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*a, **k)

    def __str__(self):
        return self.name


class Finish(TimestampedModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.CharField(max_length=240, blank=True)

    def __str__(self):
        return self.name


class Pattern(TimestampedModel):
    name = models.CharField(max_length=100, unique=True)
    image = models.ImageField(upload_to='catalog/patterns/', blank=True, null=True)

    def __str__(self):
        return self.name


class Product(TimestampedModel):
    TYPE_CHOICES = [
        ('precast', 'Precast'),
        ('tile', 'Tile'),
    ]
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    category = models.ForeignKey(ProductCategory, related_name='products', on_delete=models.SET_NULL, null=True)
    summary = models.CharField(max_length=260, blank=True)
    body = RichTextField(blank=True)
    pattern = models.ForeignKey(Pattern, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    finishes = models.ManyToManyField(Finish, related_name='products', blank=True)
    cover_image = models.ImageField(upload_to='catalog/covers/', blank=True, null=True)
    spec_sheet = models.FileField(upload_to='catalog/specs/', blank=True, null=True)

    def save(self, *a, **k):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*a, **k)

    def __str__(self):
        return self.title


class ProductVariant(TimestampedModel):
    product = models.ForeignKey(Product, related_name='variants', on_delete=models.CASCADE)
    size = models.CharField(max_length=60)              # e.g. "300x300"
    thickness = models.CharField(max_length=40, blank=True)  # e.g. "50mm"
    finish = models.ForeignKey(Finish, related_name='variants', on_delete=models.SET_NULL, null=True, blank=True)
    weight = models.CharField(max_length=40, blank=True)
    notes = models.CharField(max_length=240, blank=True)

    def __str__(self):
        return f'{self.product.title} — {self.size}'


class ProductImage(TimestampedModel):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='catalog/gallery/')
    alt_text = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return f'Image for {self.product.title}'


class SampleRequest(TimestampedModel):
    product = models.ForeignKey(Product, related_name='sample_requests', on_delete=models.CASCADE)
    name = models.CharField(max_length=140)
    email = models.EmailField()
    phone = models.CharField(max_length=80, blank=True)
    address = models.CharField(max_length=240, blank=True)
    finish_preference = models.CharField(max_length=120, blank=True)
    message = models.TextField(blank=True)

    def __str__(self):
        return f'Sample: {self.product.title} — {self.name}'


# --- Equipment / Fleet ---

class EquipmentCategory(TimestampedModel):
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=140, unique=True, blank=True)

    def save(self, *a, **k):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*a, **k)

    def __str__(self):
        return self.name


class Equipment(TimestampedModel):
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    category = models.ForeignKey(EquipmentCategory, related_name='equipment', on_delete=models.SET_NULL, null=True)
    make = models.CharField(max_length=120, blank=True)
    model = models.CharField(max_length=120, blank=True)
    year = models.CharField(max_length=10, blank=True)
    capacity = models.CharField(max_length=140, blank=True)    # e.g. "10T/h", "20T"
    capability = models.CharField(max_length=240, blank=True)  # short capability/USP
    specs = RichTextField(blank=True)
    image = models.ImageField(upload_to='equipment/', blank=True, null=True)

    def save(self, *a, **k):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*a, **k)

    def __str__(self):
        return self.name