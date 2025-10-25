# Database Seeding

This module provides a comprehensive database seeding solution for the NestJS application.

## Features

- ✅ **Environment-aware seeding** - Different behavior for dev/test/prod
- ✅ **Idempotent operations** - Safe to run multiple times
- ✅ **Proper error handling** - Detailed logging and error reporting
- ✅ **Modular data files** - Separate seed data for different entities
- ✅ **CLI commands** - Easy-to-use npm scripts
- ✅ **Transaction safety** - Proper cleanup on failures

## Usage

### Basic Commands

```bash
# Seed the database with initial data
npm run seed

# Clear all data from the database
npm run seed:clear

# Reset database (clear + seed)
npm run seed:reset
```

### Environment-Specific Behavior

The seeding behavior changes based on your `NODE_ENV`:

- **Development**: Seeds both roles and users, doesn't clear existing data
- **Test**: Seeds both roles and users, always clears existing data first
- **Production**: Only seeds roles, never seeds users, never clears data

## File Structure

```
src/database/
├── README.md                 # This file
├── database.module.ts        # Database module configuration
├── seeder.service.ts         # Main seeding service
├── seed.command.ts          # CLI command runner
├── seed-config.ts           # Environment-based configuration
└── seed-data/
    ├── roles.seed.ts        # Role seed data
    └── users.seed.ts        # User seed data
```

## Adding New Seed Data

### 1. Create Seed Data File

Create a new file in `seed-data/` directory:

```typescript
// src/database/seed-data/products.seed.ts
export const productsSeedData = [
  {
    name: 'Product 1',
    price: 29.99,
    category: 'electronics',
  },
  // ... more products
];
```

### 2. Update Seeder Service

Add the new entity to the seeder service:

```typescript
// In seeder.service.ts
import { productsSeedData } from './seed-data/products.seed';

// Add to constructor
@InjectRepository(Product)
private readonly productRepository: Repository<Product>,

// Add new method
private async seedProducts(): Promise<void> {
  this.logger.log('Seeding products...');
  
  for (const productData of productsSeedData) {
    const existingProduct = await this.productRepository.findOne({
      where: { name: productData.name },
    });

    if (!existingProduct) {
      const product = this.productRepository.create(productData);
      await this.productRepository.save(product);
      this.logger.log(`Created product: ${productData.name}`);
    } else {
      this.logger.log(`Product already exists: ${productData.name}`);
    }
  }
}

// Update main seed method
if (config.products) {
  await this.seedProducts();
}
```

### 3. Update Configuration

Add the new entity to the seed configuration:

```typescript
// In seed-config.ts
export interface SeedConfig {
  roles: boolean;
  users: boolean;
  products: boolean; // Add this
  clearBeforeSeed: boolean;
}

// Update getSeedConfig function
case 'development':
  return {
    roles: true,
    users: true,
    products: true, // Add this
    clearBeforeSeed: false,
  };
```

### 4. Update Database Module

Add the new entity to the database module:

```typescript
// In database.module.ts
import { Product } from '../products/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, Product]), // Add Product
  ],
  // ...
})
```

## Best Practices

1. **Always check for existing data** - Use `findOne` before creating to avoid duplicates
2. **Use transactions for related data** - If seeding related entities, wrap in a transaction
3. **Log everything** - Use the logger to track what's happening
4. **Handle errors gracefully** - Don't let one failed seed stop the entire process
5. **Keep seed data minimal** - Only include essential data for development/testing
6. **Never seed sensitive data in production** - Use environment-specific configurations

## Troubleshooting

### Common Issues

1. **Foreign key constraint errors**: Make sure to seed parent entities before child entities
2. **Duplicate key errors**: Check that your seed data doesn't conflict with existing data
3. **Permission errors**: Ensure the database user has proper permissions

### Debug Mode

To see detailed logging, set the log level:

```bash
LOG_LEVEL=debug npm run seed
```

## Integration with CI/CD

You can integrate seeding into your deployment pipeline:

```yaml
# In your CI/CD pipeline
- name: Seed Database
  run: |
    NODE_ENV=production npm run seed
```

## Security Considerations

- Never commit real user passwords to seed data
- Use environment variables for sensitive configuration
- Consider using a separate seeding user with limited permissions
- Always validate seed data before insertion
