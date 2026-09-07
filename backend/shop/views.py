from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Category, Product, Order, OrderItem
from .serializers import (
    RegisterSerializer, LoginSerializer, CategorySerializer, 
    ProductSerializer, OrderSerializer
)

class RegisterAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "message": "Muvaffaqiyatli ro'yxatdan o'tdingiz!",
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "full_name": user.first_name,
                    "email": user.email,
                },
                "token": token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({
                    "message": "Xush kelibsiz!",
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "full_name": user.first_name or user.username,
                        "email": user.email,
                    },
                    "token": token.key
                }, status=status.HTTP_200_OK)
            return Response({"error": "Login yoki parol noto'g'ri!"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "full_name": user.first_name,
            "email": user.email,
        })

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['price', 'rating', 'created_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category__slug=category)
        return queryset

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        items_data = data.get('items', [])
        
        user = request.user if request.user.is_authenticated else None

        order = Order.objects.create(
            user=user,
            full_name=data.get('fullName', 'Mijoz'),
            phone=data.get('phone', ''),
            address=data.get('address', ''),
            payment_method=data.get('paymentMethod', 'uzum_nasiya'),
            total_amount=data.get('totalAmount', 0)
        )

        for item in items_data:
            product_id = item.get('productId')
            qty = item.get('quantity', 1)
            try:
                prod = Product.objects.get(id=product_id)
                OrderItem.objects.create(
                    order=order,
                    product=prod,
                    quantity=qty,
                    price=prod.price
                )
            except Product.DoesNotExist:
                continue

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
