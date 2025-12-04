// Example: Property Service Layer (backend/src/services/property.service.ts)
// This handles business logic and database operations

import { PrismaClient } from '@prisma/client';
import { Property, PropertyFilters } from '../../../shared/types/Property.js';

const prisma = new PrismaClient();

export class PropertyService {
  /**
   * Get all properties for a user with optional filters
   */
  static async getProperties(filters: PropertyFilters & { userId: string }): Promise<Property[]> {
    const where: any = {
      userId: filters.userId,
    };

    // Search filter
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { address: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Price range filter
    if (filters.priceMin || filters.priceMax) {
      where.price = {};
      if (filters.priceMin) where.price.gte = filters.priceMin;
      if (filters.priceMax) where.price.lte = filters.priceMax;
    }

    // Location filter
    if (filters.location) {
      where.address = { contains: filters.location, mode: 'insensitive' };
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      where.specs = { ...where.specs, rooms: filters.bedrooms };
    }

    // Bathrooms filter
    if (filters.bathrooms) {
      where.specs = { ...where.specs, toilets: filters.bathrooms };
    }

    const properties = await prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        videos: true,
      },
    });

    // Transform database model to API response format
    return properties.map(this.transformToProperty);
  }

  /**
   * Get single property by ID
   */
  static async getPropertyById(id: string, userId: string): Promise<Property | null> {
    const property = await prisma.property.findFirst({
      where: { id, userId },
      include: {
        images: true,
        videos: true,
      },
    });

    return property ? this.transformToProperty(property) : null;
  }

  /**
   * Create new property
   */
  static async createProperty(
    userId: string,
    propertyData: Omit<Property, 'id'>
  ): Promise<Property> {
    // Check user's plan limit
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { _count: { select: { properties: true } } },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const planLimit = this.getPlanListingsLimit(user.plan);
    if (user._count.properties >= planLimit) {
      throw new Error(`You've reached your plan limit of ${planLimit} listings`);
    }

    // Create property with images
    const property = await prisma.property.create({
      data: {
        userId,
        name: propertyData.name,
        price: this.parsePriceToNumber(propertyData.price),
        address: propertyData.address,
        description: propertyData.description,
        specs: {
          create: {
            lt: propertyData.specs.lt,
            lb: propertyData.specs.lb,
            rooms: propertyData.specs.rooms,
            toilets: propertyData.specs.toilets,
          },
        },
        images: {
          create: propertyData.images?.map(url => ({ url })) || [],
        },
      },
      include: {
        images: true,
        specs: true,
      },
    });

    return this.transformToProperty(property);
  }

  /**
   * Update property
   */
  static async updateProperty(
    id: string,
    userId: string,
    updateData: Partial<Property>
  ): Promise<Property> {
    // Verify ownership
    const existing = await prisma.property.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new Error('Property not found or access denied');
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.price && { price: this.parsePriceToNumber(updateData.price) }),
        ...(updateData.address && { address: updateData.address }),
        ...(updateData.description && { description: updateData.description }),
        ...(updateData.specs && {
          specs: {
            update: {
              lt: updateData.specs.lt,
              lb: updateData.specs.lb,
              rooms: updateData.specs.rooms,
              toilets: updateData.specs.toilets,
            },
          },
        }),
      },
      include: {
        images: true,
        specs: true,
      },
    });

    return this.transformToProperty(property);
  }

  /**
   * Delete property
   */
  static async deleteProperty(id: string, userId: string): Promise<void> {
    // Verify ownership
    const property = await prisma.property.findFirst({
      where: { id, userId },
    });

    if (!property) {
      throw new Error('Property not found or access denied');
    }

    // Delete associated files from S3 (if needed)
    // await S3Service.deletePropertyFiles(id);

    await prisma.property.delete({
      where: { id },
    });
  }

  /**
   * Transform database model to API response format
   */
  private static transformToProperty(dbProperty: any): Property {
    return {
      id: dbProperty.id,
      name: dbProperty.name,
      image: dbProperty.images?.[0]?.url || '',
      images: dbProperty.images?.map((img: any) => img.url) || [],
      price: this.formatPrice(dbProperty.price),
      address: dbProperty.address,
      description: dbProperty.description || '',
      specs: {
        lt: dbProperty.specs?.lt || 0,
        lb: dbProperty.specs?.lb || 0,
        rooms: dbProperty.specs?.rooms || 0,
        toilets: dbProperty.specs?.toilets || 0,
      },
    };
  }

  /**
   * Parse price string to number (e.g., "Rp 2.500.000.000" -> 2500000000)
   */
  private static parsePriceToNumber(price: string): number {
    const match = price.match(/([\d.,]+)/);
    if (!match) return 0;
    const normalized = match[1].replace(/[^\d]/g, '');
    return Number(normalized || '0');
  }

  /**
   * Format number to price string (e.g., 2500000000 -> "Rp 2.500.000.000")
   */
  private static formatPrice(price: number): string {
    return `Rp ${price.toLocaleString('id-ID')}`;
  }

  /**
   * Get listings limit based on plan
   */
  private static getPlanListingsLimit(plan: string): number {
    const limits: Record<string, number> = {
      Basic: 3,
      Pro: 50,
      'Pro Max': 150,
    };
    return limits[plan] || 3;
  }
}


