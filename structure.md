```
src/
│
├── assets/                     # Tài nguyên tĩnh
│   ├── images/
│   ├── icons/
│   └── styles/                 # Global CSS
│       ├── reset.css
│       ├── variables.css
│       ├── base.css            # body, typography
│       └── global.css
│
├── config/                     # Cấu hình hệ thống
│   ├── api.config.ts
│   └── routes.ts
│
├── lib/                        # Lib bên thứ 3
│   └── axiosClient.ts
│
├── components/                 # SHARED UI (Dumb components)
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.css
│   │   └── index.ts
│   │
│   ├── Input/
│   │   ├── Input.tsx
│   │   ├── Input.css
│   │   └── index.ts
│   │
│   ├── Modal/
│   │   ├── Modal.tsx
│   │   ├── Modal.css
│   │   └── index.ts
│   │
│   └── Skeleton/
│       ├── Skeleton.tsx
│       ├── Skeleton.css
│       └── index.ts
│
├── features/                   # 👈 TRÁI TIM CỦA APP
│   │
│   ├── auth/
│   │   ├── api/
│   │   │   └── auth.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── LoginForm.css
│   │   │   ├── RegisterForm.tsx
│   │   │   └── RegisterForm.css
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   │
│   │   ├── slices/
│   │   │   └── authSlice.ts
│   │   │
│   │   └── types/
│   │       └── auth.type.ts
│   │
│   ├── products/
│   │   ├── api/
│   │   │   └── product.api.ts
│   │   │
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCard.css
│   │   │   ├── ProductList.tsx
│   │   │   └── ProductList.css
│   │   │
│   │   ├── hooks/
│   │   │   └── useProductList.ts
│   │   │
│   │   ├── slices/
│   │   │   └── productSlice.ts
│   │   │
│   │   └── types/
│   │       └── product.type.ts
│   │
│   └── cart/
│       ├── components/
│       │   ├── CartItem.tsx
│       │   ├── CartItem.css
│       │   └── MiniCart.tsx
│       │
│       ├── hooks/
│       │   └── useCart.ts
│       │
│       ├── slices/
│       │   └── cartSlice.ts
│       │
│       └── utils/
│           └── cart.helper.ts
│
├── hooks/                      # Global hooks
│   ├── useDebounce.ts
│   ├── useOnClickOutside.ts
│   └── useScrollTop.ts
│
├── layouts/
│   ├── MainLayout/
│   │   ├── MainLayout.tsx
│   │   ├── MainLayout.css
│   │   └── index.ts
│   │
│   ├── AuthLayout/
│   │   ├── AuthLayout.tsx
│   │   ├── AuthLayout.css
│   │   └── index.ts
│   │
│   └── AdminLayout/
│       ├── AdminLayout.tsx
│       ├── AdminLayout.css
│       └── index.ts
│
├── pages/                      # Pages = lắp ghép
│   ├── Home/
│   │   ├── Home.tsx
│   │   └── Home.css
│   │
│   ├── Product/
│   │   ├── ProductListPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── Product.css
│   │
│   ├── Cart/
│   │   ├── CartPage.tsx
│   │   └── Cart.css
│   │
│   └── Auth/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       └── Auth.css
│
├── store/
│   ├── index.ts
│   └── rootReducer.ts
│
├── utils/
│   ├── format.ts
│   ├── storage.ts
│   └── validators.ts
│
├── App.tsx
├── main.tsx
└── vite-env.d.ts (hoặc react-app-env.d.ts)
