import graphene
from graphene_django.types import DjangoObjectType
from .models import User


class UserType(DjangoObjectType):
    class Meta:
        model = User


class Query(object):
    all_users = graphene.List(UserType)

    def resolve_all_users(self, info, **kwargs):
        return User.objects.all()


class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        name = graphene.String()
        email = graphene.String()
        password = graphene.String()

    def mutate(self, info, name, email, password):
        usr = User(name=name, email=email, password=password)
        usr.save()
        return CreateUser(user=usr)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()
