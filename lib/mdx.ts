// MDX blog configuration and utilities
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import readingTime from 'reading-time';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: string;
  image?: string;
  featured?: boolean;
  draft?: boolean;
}

const CONTENT_PATH = path.join(process.cwd(), 'content/blog');

// Ensure content directory exists
export function ensureContentDirectory() {
  if (!fs.existsSync(CONTENT_PATH)) {
    fs.mkdirSync(CONTENT_PATH, { recursive: true });
  }
}

// Get all blog posts
export async function getAllPosts(): Promise<BlogPost[]> {
  ensureContentDirectory();
  
  const files = fs.readdirSync(CONTENT_PATH);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace('.mdx', '');
        const post = await getPostBySlug(slug);
        return post;
      })
  );

  // Filter out drafts in production
  const filteredPosts = process.env.NODE_ENV === 'production' 
    ? posts.filter(post => post && !post.draft)
    : posts;

  // Sort by date
  return filteredPosts
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as BlogPost[];
}

// Get a single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  ensureContentDirectory();
  
  const filePath = path.join(CONTENT_PATH, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  const readingTimeResult = readingTime(content);

  return {
    slug,
    content,
    title: data.title,
    description: data.description,
    date: data.date,
    author: data.author || 'Dank Deals Team',
    category: data.category || 'General',
    tags: data.tags || [],
    readingTime: readingTimeResult.text,
    image: data.image,
    featured: data.featured || false,
    draft: data.draft || false,
  };
}

// Get posts by category
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

// Get featured posts
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts
    .filter(post => post.featured)
    .slice(0, limit);
}

// Get related posts
export async function getRelatedPosts(slug: string, limit: number = 3): Promise<BlogPost[]> {
  const post = await getPostBySlug(slug);
  if (!post) return [];

  const allPosts = await getAllPosts();
  
  // Find posts with similar tags or category
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug)
    .map(p => {
      let score = 0;
      
      // Same category = 2 points
      if (p.category === post.category) score += 2;
      
      // Each matching tag = 1 point
      p.tags.forEach(tag => {
        if (post.tags.includes(tag)) score += 1;
      });
      
      return { post: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return relatedPosts;
}

// Content pillars for SEO
export const CONTENT_PILLARS = {
  'local-guide': {
    title: 'Minneapolis Cannabis Guide',
    description: 'Your complete guide to cannabis in Minneapolis and the Twin Cities',
    keywords: ['minneapolis cannabis', 'twin cities dispensary', 'minnesota marijuana laws'],
  },
  'education': {
    title: 'Cannabis Education',
    description: 'Learn about different strains, effects, and responsible use',
    keywords: ['cannabis strains', 'thc vs cbd', 'cannabis effects'],
  },
  'delivery': {
    title: 'Cannabis Delivery Tips',
    description: 'Everything about cannabis delivery in Minneapolis',
    keywords: ['cannabis delivery minneapolis', 'weed delivery mn', 'dispensary delivery'],
  },
  'products': {
    title: 'Product Reviews',
    description: 'In-depth reviews of cannabis products available in Minnesota',
    keywords: ['cannabis products mn', 'best edibles minneapolis', 'flower reviews'],
  },
  'lifestyle': {
    title: 'Cannabis Lifestyle',
    description: 'Cannabis culture, recipes, and lifestyle in the Twin Cities',
    keywords: ['cannabis lifestyle', 'marijuana culture minneapolis', 'cannabis events mn'],
  },
};

// Create initial blog posts if they don't exist
export function createInitialBlogPosts() {
  ensureContentDirectory();

  const initialPosts = [
    {
      filename: 'cannabis-delivery-minneapolis-guide.mdx',
      content: `---
title: "The Ultimate Guide to Cannabis Delivery in Minneapolis"
description: "Everything you need to know about getting cannabis delivered in Minneapolis and the Twin Cities area."
date: "${new Date().toISOString()}"
author: "Dank Deals Team"
category: "local-guide"
tags: ["minneapolis", "delivery", "guide"]
image: "/blog/minneapolis-skyline.jpg"
featured: true
---

# The Ultimate Guide to Cannabis Delivery in Minneapolis

Welcome to your comprehensive guide for cannabis delivery in Minneapolis! Whether you're a seasoned consumer or new to the world of cannabis, this guide will help you navigate the Twin Cities cannabis delivery scene.

## Legal Status in Minnesota

As of 2023, Minnesota has legalized adult-use cannabis for residents 21 and older. Here's what you need to know:

- **Age Requirement**: Must be 21+ with valid ID
- **Possession Limits**: Up to 2 ounces in public
- **Home Cultivation**: Up to 8 plants (4 flowering)
- **Delivery**: Legal for licensed dispensaries

## How Cannabis Delivery Works

1. **Verify Your Age**: Upload your ID during checkout
2. **Place Your Order**: Browse our menu and add items to cart
3. **Choose Delivery Time**: Select a convenient delivery window
4. **Track Your Order**: Real-time updates on your delivery status

## Delivery Areas We Serve

We proudly deliver to:
- Downtown Minneapolis
- Uptown
- Northeast Minneapolis
- South Minneapolis
- And surrounding areas!

## Tips for First-Time Customers

- Start with low doses, especially with edibles
- Keep products away from children and pets
- Don't drive under the influence
- Store products in a cool, dry place

## Why Choose Dank Deals MN?

✓ Fast, discreet delivery
✓ Premium quality products
✓ Knowledgeable budtenders
✓ Competitive prices
✓ Lab-tested products

Ready to place your first order? [Browse our menu](/menu) and experience the best cannabis delivery in Minneapolis!
`
    },
    {
      filename: 'thc-vs-cbd-beginners-guide.mdx',
      content: `---
title: "THC vs CBD: A Beginner's Guide"
description: "Understanding the differences between THC and CBD, their effects, and how to choose the right products."
date: "${new Date(Date.now() - 86400000).toISOString()}"
author: "Dr. Green"
category: "education"
tags: ["thc", "cbd", "education", "beginners"]
image: "/blog/thc-cbd-molecule.jpg"
featured: true
---

# THC vs CBD: A Beginner's Guide

If you're new to cannabis, you've probably heard about THC and CBD. But what exactly are they, and how do they differ? Let's break it down.

## What is THC?

THC (Tetrahydrocannabinol) is the primary psychoactive compound in cannabis. It's responsible for the "high" feeling.

### Effects of THC:
- Euphoria and relaxation
- Increased appetite
- Altered perception
- Pain relief
- Better sleep

## What is CBD?

CBD (Cannabidiol) is non-psychoactive, meaning it won't get you high. It's known for its therapeutic benefits.

### Effects of CBD:
- Anxiety relief
- Anti-inflammatory
- Pain management
- Seizure reduction
- No intoxication

## Choosing the Right Ratio

Different ratios work for different needs:

- **High THC**: Best for recreational use, pain relief, sleep
- **Balanced (1:1)**: Good for beginners, mild effects
- **High CBD**: Ideal for anxiety, inflammation, no high

## Popular Products by Type

### High THC Products:
- Premium flower strains
- Potent edibles
- Concentrates

### CBD Products:
- CBD tinctures
- Topical creams
- CBD gummies

### Balanced Products:
- 1:1 ratio edibles
- Balanced vape cartridges
- Hybrid flower strains

## Start Low and Go Slow

Remember: everyone's endocannabinoid system is different. Start with low doses and gradually increase until you find what works for you.

Ready to explore? Check out our [curated selection](/menu) of THC and CBD products!
`
    },
    {
      filename: 'best-edibles-minneapolis-2024.mdx',
      content: `---
title: "Best Cannabis Edibles in Minneapolis 2024"
description: "Our top picks for cannabis edibles available for delivery in Minneapolis, from gummies to chocolates."
date: "${new Date(Date.now() - 172800000).toISOString()}"
author: "Edible Expert Emma"
category: "products"
tags: ["edibles", "reviews", "minneapolis", "2024"]
image: "/blog/cannabis-edibles-spread.jpg"
---

# Best Cannabis Edibles in Minneapolis 2024

Edibles have come a long way from homemade brownies. Today's cannabis edibles offer precise dosing, amazing flavors, and consistent effects. Here are our top picks for 2024.

## Top 5 Edibles for 2024

### 1. Cosmic Gummies - Galaxy Grape
**Dose**: 10mg THC per gummy
**Price**: $25/pack

These award-winning gummies deliver consistent effects with an out-of-this-world grape flavor. Perfect for beginners and veterans alike.

### 2. Artisan Chocolate Bars - Dark Mint
**Dose**: 100mg THC per bar (10 pieces)
**Price**: $35/bar

Locally crafted with premium chocolate and Minnesota-grown cannabis. The mint perfectly masks any cannabis taste.

### 3. Nano-Enhanced Drink Mix
**Dose**: 5mg THC per packet
**Price**: $5/packet

Fast-acting (15-30 minutes) thanks to nano-technology. Mix with any beverage for discrete consumption.

### 4. Vegan Fruit Chews
**Dose**: 5mg THC per chew
**Price**: $20/pack

All-natural, vegan-friendly option with real fruit flavors. Great for microdosing throughout the day.

### 5. High-Dose Cookies
**Dose**: 50mg THC per cookie
**Price**: $15/cookie

For experienced users only! These potent treats pack a punch in every bite.

## Dosing Guide

- **Beginners**: Start with 2.5-5mg
- **Occasional Users**: 5-10mg
- **Regular Users**: 10-20mg
- **High Tolerance**: 20mg+

## Pro Tips for Edibles

1. **Wait Before Taking More**: Effects can take 30-120 minutes
2. **Eat with Food**: Helps with absorption and reduces stomach upset
3. **Stay Hydrated**: Keep water nearby
4. **Plan Ahead**: Effects last 4-8 hours

## Storage Tips

- Keep in original packaging
- Store in a cool, dry place
- Keep away from children and pets
- Check expiration dates

Ready to try these amazing edibles? [Order now](/menu?category=edibles) for same-day delivery in Minneapolis!
`
    }
  ];

  initialPosts.forEach(({ filename, content }) => {
    const filePath = path.join(CONTENT_PATH, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
    }
  });
} 