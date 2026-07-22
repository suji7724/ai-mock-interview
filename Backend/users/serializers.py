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

        full_name = validated_data.pop('full_name').strip()

        email = validated_data['email'].strip().lower()

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
        email_clean = value.strip().lower()
        if User.objects.filter(email__iexact=email_clean).exists():
            raise serializers.ValidationError(
                "Email already exists"
            )

        return email_clean

# Login serializer for user login
class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True)

    def validate(self, data):

        email = data.get('email', '').strip().lower()

        password = data.get('password')

        # Find user using case-insensitive email match
        user = User.objects.filter(email__iexact=email).first()

        if user is None:
            raise serializers.ValidationError(
                "User with this email does not exist."
            )

        # Authenticate user
        auth_user = authenticate(
            username=user.username,
            password=password
        )

        if auth_user is None:
            raise serializers.ValidationError(
                "Invalid password."
            )

        # Generate JWT Tokens
        refresh = RefreshToken.for_user(auth_user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'username': auth_user.username,
                'email': auth_user.email,
                'first_name': auth_user.first_name,
                'last_name': auth_user.last_name,
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