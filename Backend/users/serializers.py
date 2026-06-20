from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import ContactMessage
from .models import UserProfile
from .models import ResumeAnalysis


class RegisterSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(write_only=True)

    class Meta:
        model = User

        fields = [
            'full_name',
            'email',
            'password'
        ]

        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):

        full_name = validated_data.pop('full_name')

        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password']
        )

        # Store full name
        user.first_name = full_name

        user.save()

        return user
    # validate from duplicate email
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Email already exists"
            )

        return value

# Login serializer for user login
class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True)

    def validate(self, data):

        email = data.get('email')

        password = data.get('password')

        # Find user using email
        user = User.objects.filter(email=email).first()

        if user is None:
            raise serializers.ValidationError(
                "User with this email does not exist."
            )

        # Authenticate user
        user = authenticate(
            username=user.username,
            password=password
        )

        if user is None:
            raise serializers.ValidationError(
                "Invalid password."
            )

        # Generate JWT Tokens
        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'username': user.username,
                'email': user.email,
            }
        }
class ContactMessageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContactMessage
        fields = "__all__"

# resume upload serializer

class ResumeUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = ["resume"]

class ResumeAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeAnalysis
        fields = "__all__"
        read_only_fields = ["user", "created_at"]