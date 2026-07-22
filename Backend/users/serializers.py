from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import ContactMessage
from .models import UserProfile
from .models import ResumeAnalysis


from django.db import IntegrityError


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
        full_name = validated_data.pop('full_name', '').strip()
        email = validated_data['email'].strip().lower()
        password = validated_data['password']

        if User.objects.filter(username__iexact=email).exists() or User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": ["An account with this email already exists."]})

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password
            )
            user.first_name = full_name
            user.save()
            return user
        except IntegrityError:
            raise serializers.ValidationError({"email": ["An account with this email already exists."]})
        except Exception as e:
            raise serializers.ValidationError({"detail": f"Could not create account: {str(e)}"})

    # validate from duplicate email
    def validate_email(self, value):
        email_clean = value.strip().lower()
        if User.objects.filter(email__iexact=email_clean).exists() or User.objects.filter(username__iexact=email_clean).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return email_clean


# Login serializer for user login
class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True)

    def validate(self, data):

        email = data.get('email', '').strip().lower()

        password = data.get('password')

        if not email:
            raise serializers.ValidationError("Email is required.")
        if not password:
            raise serializers.ValidationError("Password is required.")

        # Find user using case-insensitive email match or username match
        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            user = User.objects.filter(username__iexact=email).first()

        if user is None:
            raise serializers.ValidationError(
                "User with this email does not exist."
            )

        # Check password directly
        if not user.check_password(password):
            raise serializers.ValidationError(
                "Invalid password."
            )

        if not user.is_active:
            raise serializers.ValidationError(
                "User account is inactive."
            )

        # Generate JWT Tokens safely
        try:
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
        except Exception as e:
            print("RefreshToken creation warning, using fallback token generator:", e)
            refresh = RefreshToken()
            refresh['user_id'] = user.id
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

        return {
            'refresh': refresh_token,
            'access': access_token,
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
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