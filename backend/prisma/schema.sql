-- =============================================================================
-- Pickle & Jar E-Commerce MySQL 8 DDL Script
-- Normalized Production Schema with Soft Delete, Indexes, and Constraints
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `pickle_jar_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `pickle_jar_db`;

-- 1. Admin Users Table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` VARCHAR(36) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS `categories` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `imageUrl` VARCHAR(1024) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deletedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `idx_categories_slug` (`slug`),
  KEY `idx_categories_is_active` (`isActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(36) NOT NULL,
  `categoryId` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `ingredients` TEXT NULL,
  `weightGram` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `comparePrice` DECIMAL(10,2) NULL,
  `stockQuantity` INT NOT NULL DEFAULT 0,
  `isFeatured` TINYINT(1) NOT NULL DEFAULT 0,
  `isBestSeller` TINYINT(1) NOT NULL DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deletedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `idx_products_category` (`categoryId`),
  KEY `idx_products_slug` (`slug`),
  KEY `idx_products_featured` (`isFeatured`, `isActive`),
  KEY `idx_products_bestseller` (`isBestSeller`, `isActive`),
  CONSTRAINT `fk_products_category` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Product Images Table
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` VARCHAR(36) NOT NULL,
  `productId` VARCHAR(36) NOT NULL,
  `imageUrl` VARCHAR(1024) NOT NULL,
  `publicId` VARCHAR(255) NULL,
  `isPrimary` TINYINT(1) NOT NULL DEFAULT 0,
  `sortOrder` INT NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_product_images_product` (`productId`),
  CONSTRAINT `fk_product_images_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Customers Table
CREATE TABLE IF NOT EXISTS `customers` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `email` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_customers_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Addresses Table
CREATE TABLE IF NOT EXISTS `addresses` (
  `id` VARCHAR(36) NOT NULL,
  `customerId` VARCHAR(36) NOT NULL,
  `addressLine1` VARCHAR(255) NOT NULL,
  `addressLine2` VARCHAR(255) NULL,
  `city` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) NOT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `landmark` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_addresses_customer` (`customerId`),
  KEY `idx_addresses_pincode` (`pincode`),
  CONSTRAINT `fk_addresses_customer` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Coupons Table
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(36) NOT NULL,
  `code` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NULL,
  `discountType` ENUM('PERCENTAGE', 'FIXED') NOT NULL,
  `discountValue` DECIMAL(10,2) NOT NULL,
  `minOrderAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `maxDiscountAmount` DECIMAL(10,2) NULL,
  `usageLimit` INT NULL,
  `usageCount` INT NOT NULL DEFAULT 0,
  `expiresAt` DATETIME(3) NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deletedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`),
  KEY `idx_coupons_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(36) NOT NULL,
  `orderNumber` VARCHAR(50) NOT NULL,
  `customerId` VARCHAR(36) NOT NULL,
  `addressId` VARCHAR(36) NOT NULL,
  `couponId` VARCHAR(36) NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `discountAmount` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `shippingFee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `totalAmount` DECIMAL(10,2) NOT NULL,
  `status` ENUM('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  `paymentStatus` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
  `razorpayOrderId` VARCHAR(255) NULL,
  `razorpayPaymentId` VARCHAR(255) NULL,
  `razorpaySignature` VARCHAR(512) NULL,
  `trackingNumber` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_number_unique` (`orderNumber`),
  UNIQUE KEY `orders_razorpay_order_id_unique` (`razorpayOrderId`),
  KEY `idx_orders_number` (`orderNumber`),
  KEY `idx_orders_customer` (`customerId`),
  KEY `idx_orders_status` (`status`),
  KEY `idx_orders_created` (`createdAt`),
  CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_address` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_coupon` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Order Items Table
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` VARCHAR(36) NOT NULL,
  `orderId` VARCHAR(36) NOT NULL,
  `productId` VARCHAR(36) NOT NULL,
  `productName` VARCHAR(255) NOT NULL,
  `productPrice` DECIMAL(10,2) NOT NULL,
  `weightGram` INT NOT NULL,
  `quantity` INT NOT NULL,
  `totalAmount` DECIMAL(10,2) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_order_items_order` (`orderId`),
  KEY `idx_order_items_product` (`productId`),
  CONSTRAINT `fk_order_items_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Payments Table
CREATE TABLE IF NOT EXISTS `payments` (
  `id` VARCHAR(36) NOT NULL,
  `orderId` VARCHAR(36) NOT NULL,
  `razorpayPaymentId` VARCHAR(255) NOT NULL,
  `razorpayOrderId` VARCHAR(255) NOT NULL,
  `razorpaySignature` VARCHAR(512) NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `currency` VARCHAR(10) NOT NULL DEFAULT 'INR',
  `status` ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') NOT NULL,
  `paymentMethod` VARCHAR(50) NULL,
  `rawPayload` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_razorpay_payment_unique` (`razorpayPaymentId`),
  KEY `idx_payments_order` (`orderId`),
  KEY `idx_payments_razorpay_payment` (`razorpayPaymentId`),
  CONSTRAINT `fk_payments_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Inventory Logs Table
CREATE TABLE IF NOT EXISTS `inventory_logs` (
  `id` VARCHAR(36) NOT NULL,
  `productId` VARCHAR(36) NOT NULL,
  `changeType` ENUM('RESTOCK', 'SALE', 'ADJUSTMENT', 'RETURN') NOT NULL,
  `quantity` INT NOT NULL,
  `previousStock` INT NOT NULL,
  `newStock` INT NOT NULL,
  `referenceId` VARCHAR(255) NULL,
  `notes` VARCHAR(255) NULL,
  `createdBy` VARCHAR(36) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `idx_inventory_logs_product` (`productId`),
  CONSTRAINT `fk_inventory_logs_product` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_inventory_logs_admin` FOREIGN KEY (`createdBy`) REFERENCES `admin_users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Banners Table
CREATE TABLE IF NOT EXISTS `banners` (
  `id` VARCHAR(36) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) NULL,
  `imageUrl` VARCHAR(1024) NOT NULL,
  `targetUrl` VARCHAR(512) NULL,
  `buttonText` VARCHAR(100) NULL,
  `position` INT NOT NULL DEFAULT 0,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  `deletedAt` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  KEY `idx_banners_position` (`isActive`, `position`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
