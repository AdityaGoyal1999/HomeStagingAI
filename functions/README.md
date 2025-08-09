# HomeStaging Backend - Layer-Based Architecture

This backend follows a clean layer-based architecture pattern for better separation of concerns, maintainability, and scalability.

## Project Structure

```
functions/
├── index.js                    # Entry point (minimal)
├── config/                     # Configuration layer
│   ├── database.js            # Database configuration
│   ├── storage.js             # Storage configuration
│   └── firebase.js            # Firebase initialization
├── controllers/               # Controller layer (HTTP request handling)
│   ├── userController.js      # User-related HTTP logic
│   ├── photoController.js     # Photo-related HTTP logic
│   └── index.js              # Controller exports
├── services/                  # Service layer (Business logic)
│   ├── userService.js         # User business logic
│   ├── photoService.js        # Photo business logic
│   ├── storageService.js      # File storage logic
│   └── index.js              # Service exports
├── models/                    # Model layer (Data access)
│   ├── userModel.js           # User data operations
│   ├── photoModel.js          # Photo data operations
│   └── index.js              # Model exports
├── middleware/                # Middleware layer
│   ├── authentication.js      # Auth middleware
│   ├── errorHandler.js        # Error handling middleware
│   ├── validation.js          # Input validation middleware
│   └── index.js              # Middleware exports
├── routes/                    # Route layer
│   ├── userRoutes.js         # User routes
│   ├── photoRoutes.js        # Photo routes
│   └── index.js             # Route exports
├── utils/                     # Utility layer
│   ├── constants.js          # App constants
│   ├── helpers.js            # Utility functions
│   └── validators.js         # Validation schemas
└── package.json
```

## Layer Responsibilities

### 1. **Config Layer** (`/config`)
- Database initialization
- Storage configuration
- Firebase setup
- Environment-specific configurations

### 2. **Controllers Layer** (`/controllers`)
- Handle HTTP requests and responses
- Input validation and sanitization
- Call appropriate services
- Format responses
- Error handling at HTTP level

### 3. **Services Layer** (`/services`)
- Business logic implementation
- Orchestrate multiple models
- Data transformation
- Complex operations
- Transaction management

### 4. **Models Layer** (`/models`)
- Data access operations
- Database queries
- Data structure definitions
- CRUD operations

### 5. **Middleware Layer** (`/middleware`)
- Authentication
- Authorization
- Input validation
- Error handling
- Logging
- Request/Response transformation

### 6. **Routes Layer** (`/routes`)
- Route definitions
- HTTP method mapping
- Middleware chaining
- Route grouping

### 7. **Utils Layer** (`/utils`)
- Helper functions
- Constants
- Validation schemas
- Common utilities

## API Endpoints

### User Endpoints
- `GET /user/profile` - Get user profile
- `GET /getProfile` - Legacy endpoint (redirects to new)

### Photo Endpoints
- `GET /photos` - Get user photos
- `POST /photos/upload` - Upload new photo
- `GET /getPhotos` - Legacy endpoint (redirects to new)
- `POST /uploadPhoto` - Legacy endpoint (redirects to new)

## Data Flow

```
Request → Routes → Controllers → Services → Models → Database
Response ← Controllers ← Services ← Models ← Database
```

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Easy to locate and modify specific functionality
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new features without affecting existing code
5. **Reusability**: Services and models can be reused across controllers
6. **Error Handling**: Centralized error handling at each layer

## Adding New Features

1. **Create Model**: Add data access logic in `/models`
2. **Create Service**: Add business logic in `/services`
3. **Create Controller**: Add HTTP handling in `/controllers`
4. **Create Routes**: Add route definitions in `/routes`
5. **Update Index**: Register new routes in `index.js`

## Migration Notes

- Legacy endpoints are maintained for backward compatibility
- All new development should use the new layer-based structure
- Gradually migrate existing functionality to the new structure 