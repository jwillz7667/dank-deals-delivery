// Structured data helpers for enhanced SEO
import { Product } from './products';

interface StructuredDataConfig {
  product?: Product;
  businessInfo?: BusinessInfo;
  aggregateRating?: AggregateRating;
}

interface BusinessInfo {
  name: string;
  description: string;
  url: string;
  logo: string;
  telephone: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  openingHours: string[];
}

interface AggregateRating {
  ratingValue: number;
  ratingCount: number;
  bestRating: number;
  worstRating: number;
}

// Default business information
const defaultBusinessInfo: BusinessInfo = {
  name: "Dank Deals MN",
  description: "Premium cannabis delivery service in Minneapolis and Twin Cities. Fast, discreet, and compliant cannabis delivery.",
  url: "https://dankdealsmn.com",
  logo: "https://dankdealsmn.com/DANKDEALSMN.COM-LOGO.png",
  telephone: "+1-612-CANNABIS",
  address: {
    streetAddress: "Minneapolis",
    addressLocality: "Minneapolis",
    addressRegion: "MN",
    postalCode: "55401",
    addressCountry: "US"
  },
  geo: {
    latitude: 44.9778,
    longitude: -93.2650
  },
  openingHours: [
    "Mo-Fr 10:00-22:00",
    "Sa-Su 10:00-23:00"
  ]
};

// Generate organization schema
export function generateOrganizationSchema(businessInfo: BusinessInfo = defaultBusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessInfo.name,
    description: businessInfo.description,
    url: businessInfo.url,
    logo: businessInfo.logo,
    telephone: businessInfo.telephone,
    address: {
      "@type": "PostalAddress",
      ...businessInfo.address
    },
    geo: {
      "@type": "GeoCoordinates",
      ...businessInfo.geo
    },
    sameAs: [
      "https://www.instagram.com/dankdealsmn",
      "https://www.facebook.com/dankdealsmn",
      "https://twitter.com/dankdealsmn"
    ]
  };
}

// Generate local business schema
export function generateLocalBusinessSchema(businessInfo: BusinessInfo = defaultBusinessInfo) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": businessInfo.url,
    name: businessInfo.name,
    description: businessInfo.description,
    url: businessInfo.url,
    logo: businessInfo.logo,
    image: businessInfo.logo,
    telephone: businessInfo.telephone,
    address: {
      "@type": "PostalAddress",
      ...businessInfo.address
    },
    geo: {
      "@type": "GeoCoordinates",
      ...businessInfo.geo
    },
    openingHoursSpecification: businessInfo.openingHours.map(hours => {
      const [days, time] = hours.split(' ');
      const [open, close] = time.split('-');
      return {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: days.includes('-') ? days.split('-').map(d => d === 'Mo' ? 'Monday' : d === 'Tu' ? 'Tuesday' : d === 'We' ? 'Wednesday' : d === 'Th' ? 'Thursday' : d === 'Fr' ? 'Friday' : d === 'Sa' ? 'Saturday' : 'Sunday') : [days],
        opens: open,
        closes: close
      };
    }),
    priceRange: "$$",
    servesCuisine: "Cannabis",
    acceptsReservations: false,
    // Delivery-specific properties
    availableDeliveryMethod: {
      "@type": "DeliveryMethod",
      "@id": "http://purl.org/goodrelations/v1#DeliveryModeDirect"
    },
    deliveryTimeSettings: {
      "@type": "DeliveryTimeSettings",
      deliveryTime: {
        "@type": "ShippingDeliveryTime",
        handlingTime: {
          "@type": "QuantitativeValue",
          minValue: 0,
          maxValue: 1,
          unitCode: "HUR"
        },
        transitTime: {
          "@type": "QuantitativeValue",
          minValue: 30,
          maxValue: 90,
          unitCode: "MIN"
        }
      },
      businessDays: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      }
    }
  };
}

// Generate product schema with delivery settings
export function generateProductSchema(product: Product, aggregateRating?: AggregateRating) {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://dankdealsmn.com/product/${product.slug}`,
    name: product.name,
    description: product.description,
    image: product.images.map(img => `https://dankdealsmn.com${img}`),
    brand: {
      "@type": "Brand",
      name: product.brand || "Dank Deals MN"
    },
    sku: product.id,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: `https://dankdealsmn.com/product/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Dank Deals MN"
      },
      // Delivery information
      availableDeliveryMethod: {
        "@type": "DeliveryMethod",
        "@id": "http://purl.org/goodrelations/v1#DeliveryModeDirect"
      },
      deliveryLeadTime: {
        "@type": "QuantitativeValue",
        minValue: 30,
        maxValue: 90,
        unitCode: "MIN"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "USD"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "US",
          addressRegion: ["MN"],
          postalCodeRange: {
            "@type": "PostalCodeRangeSpecification",
            postalCodeBegin: "55401",
            postalCodeEnd: "55488"
          }
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "HUR"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 30,
            maxValue: 90,
            unitCode: "MIN"
          }
        }
      }
    },
    // Cannabis-specific properties
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "THC Content",
        value: product.thc || "N/A"
      },
      {
        "@type": "PropertyValue",
        name: "CBD Content",
        value: product.cbd || "N/A"
      },
      {
        "@type": "PropertyValue",
        name: "Strain Type",
        value: product.strain || "Hybrid"
      },
      {
        "@type": "PropertyValue",
        name: "Lab Tested",
        value: "Yes"
      }
    ]
  };

  // Add aggregate rating if available
  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.ratingCount,
      bestRating: aggregateRating.bestRating,
      worstRating: aggregateRating.worstRating
    };
  }

  // Add review if available
  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map(review => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1
      },
      author: {
        "@type": "Person",
        name: review.author
      },
      datePublished: review.date,
      reviewBody: review.text
    }));
  }

  return schema;
}

// Generate service schema for delivery service
export function generateServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://dankdealsmn.com/#delivery-service",
    name: "Cannabis Delivery Service",
    description: "Fast, discreet, and compliant cannabis delivery in Minneapolis and Twin Cities",
    provider: {
      "@type": "Organization",
      name: "Dank Deals MN",
      url: "https://dankdealsmn.com"
    },
    serviceType: "Cannabis Delivery",
    areaServed: {
      "@type": "City",
      name: "Minneapolis",
      containedInPlace: {
        "@type": "State",
        name: "Minnesota",
        containedInPlace: {
          "@type": "Country",
          name: "United States"
        }
      }
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: "https://dankdealsmn.com",
      servicePhone: "+1-612-CANNABIS",
      serviceSmsNumber: "+1-612-CANNABIS",
      availableLanguage: {
        "@type": "Language",
        name: "English"
      },
      serviceLocation: {
        "@type": "Place",
        name: "Minneapolis Metro Area"
      }
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "DeliveryChargeSpecification",
        appliesToDeliveryMethod: {
          "@type": "DeliveryMethod",
          "@id": "http://purl.org/goodrelations/v1#DeliveryModeDirect"
        },
        price: 0,
        priceCurrency: "USD",
        eligibleTransactionVolume: {
          "@type": "PriceSpecification",
          price: 50,
          priceCurrency: "USD"
        }
      }
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cannabis Products",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Flower",
          url: "https://dankdealsmn.com/menu?category=flower"
        },
        {
          "@type": "OfferCatalog", 
          name: "Edibles",
          url: "https://dankdealsmn.com/menu?category=edibles"
        },
        {
          "@type": "OfferCatalog",
          name: "Concentrates",
          url: "https://dankdealsmn.com/menu?category=concentrates"
        },
        {
          "@type": "OfferCatalog",
          name: "Vapes",
          url: "https://dankdealsmn.com/menu?category=vapes"
        }
      ]
    }
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@id": item.url,
        name: item.name
      }
    }))
  };
}

// Generate FAQ schema
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };
}

// Combine all schemas for a page
export function generatePageSchemas(config: StructuredDataConfig) {
  const schemas = [];

  // Always include organization and local business
  schemas.push(generateOrganizationSchema(config.businessInfo));
  schemas.push(generateLocalBusinessSchema(config.businessInfo));
  schemas.push(generateServiceSchema());

  // Add product schema if product is provided
  if (config.product) {
    schemas.push(generateProductSchema(config.product, config.aggregateRating));
  }

  return schemas;
} 