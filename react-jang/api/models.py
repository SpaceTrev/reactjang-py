from django.db.models import DateTimeField, FloatField, Model, TextField


class User(Model):
    created_at = DateTimeField(auto_now_add=True)
    name = TextField(blank=True)
    email = TextField(blank=True)
    password = TextField(blank=True)
    updated_at = DateTimeField(auto_now=True)
